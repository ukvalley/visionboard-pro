import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import visionBoardService from '../../services/visionBoardService';
import { moduleConfigs, getModuleProgress } from '../common/ModuleCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visionBoards, setVisionBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await visionBoardService.getAll();
      const boards = response.data || [];
      setVisionBoards(boards);
      if (boards.length > 0) {
        // Find the most recently updated active board
        const activeBoards = boards.filter(b => b.isActive !== false);
        setActiveBoard(activeBoards[0] || boards[0]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real insights from data
  const insights = useMemo(() => {
    if (!activeBoard) return null;

    const ss = activeBoard.strategySheet || {};
    const result = {
      // Completion metrics
      overallProgress: activeBoard.overallProgress || 0,

      // Vision & Strategy
      hasVision: !!(ss.vision?.data?.visionStatement || ss.corePurpose?.data?.purposeStatement),
      hasBHAG: !!ss.bhag?.data?.bhagStatement,
      hasValues: (ss.coreValues?.data?.values || []).length > 0,

      // Goals & Targets
      okrs: ss.smartGoals?.data?.okrs || [],
      goals: ss.smartGoals?.data?.goals || [],
      kpis: ss.smartGoals?.data?.kpis || [],

      // Execution
      priorities: ss.strategicPriorities?.data?.priorities || [],
      wwwActions: ss.strategicPriorities?.data?.wwwActions || [],
      risks: ss.riskManagement?.data?.risks || [],
      projects: ss.strategicPriorities?.data?.projects || [],

      // Financial
      revenueTarget: ss.revenueModel?.data?.annualRevenueTarget || 0,
      monthlyTarget: ss.revenueModel?.data?.monthlyRevenueTarget || 0,
      currentRevenue: ss.revenueModel?.data?.currentRevenue || 0,

      // Resources
      teamRoles: (ss.organizationalStructure?.data?.roles || []).length,
      faceChart: (ss.organizationalStructure?.data?.faceChart || []).length,
      talentAssessed: (ss.organizationalStructure?.data?.talentAssessment || []).length,

      // Collaboration
      workspaces: ss.collaboration?.data?.workspaces || [],
      mentorships: ss.collaboration?.data?.mentorships || [],

      // SWOT
      strengths: (ss.swotAnalysis?.data?.strengths || []).length,
      weaknesses: (ss.swotAnalysis?.data?.weaknesses || []).length,
      opportunities: (ss.swotAnalysis?.data?.opportunities || []).length,
      threats: (ss.swotAnalysis?.data?.threats || []).length,
    };

    // Calculate attention items
    result.attentionItems = [];

    // Check for incomplete key results
    const incompleteOKRs = result.okrs.filter(okr => (okr.progress || 0) < 70);
    if (incompleteOKRs.length > 0) {
      result.attentionItems.push({
        type: 'warning',
        icon: '🎯',
        title: `${incompleteOKRs.length} OKR(s) below 70% progress`,
        action: 'Review Key Results',
        href: `/visionboards/${activeBoard._id}/modules?module=targets`
      });
    }

    // Check for high risks without prevention
    const highRisks = result.risks.filter(r =>
      r.probability === 'High' || r.impact === 'High'
    );
    if (highRisks.length > 0) {
      result.attentionItems.push({
        type: 'alert',
        icon: '⚠️',
        title: `${highRisks.length} high-impact risk(s) identified`,
        action: 'Review Risks',
        href: `/visionboards/${activeBoard._id}/modules?module=execution`
      });
    }

    // Check for pending actions
    const pendingActions = result.wwwActions.filter(a => a.status !== 'Done');
    if (pendingActions.length > 0) {
      result.attentionItems.push({
        type: 'info',
        icon: '📋',
        title: `${pendingActions.length} action item(s) pending`,
        action: 'View Actions',
        href: `/visionboards/${activeBoard._id}/modules?module=execution`
      });
    }

    // Check for missing foundation
    if (!result.hasVision || !result.hasBHAG) {
      result.attentionItems.push({
        type: 'suggestion',
        icon: '💡',
        title: 'Complete your Vision & Strategy foundation',
        action: 'Define Vision',
        href: `/visionboards/${activeBoard._id}?tab=strategy`
      });
    }

    // Check revenue alignment
    if (result.revenueTarget > 0 && result.currentRevenue > 0) {
      const revenueProgress = (result.currentRevenue / result.revenueTarget) * 100;
      if (revenueProgress < 50) {
        result.attentionItems.push({
          type: 'warning',
          icon: '💰',
          title: `Revenue at ${Math.round(revenueProgress)}% of annual target`,
          action: 'View Financials',
          href: `/visionboards/${activeBoard._id}/modules?module=financial`
        });
      }
    }

    // Calculate quick wins (items that can be completed quickly)
    result.quickWins = [];

    if (result.strengths === 0) {
      result.quickWins.push({ task: 'Add your first strength in SWOT', module: 'vision' });
    }
    if (result.teamRoles === 0) {
      result.quickWins.push({ task: 'Define your first team role', module: 'resources' });
    }
    if (result.kpis.length === 0) {
      result.quickWins.push({ task: 'Set up your first KPI', module: 'targets' });
    }
    if (result.wwwActions.length === 0) {
      result.quickWins.push({ task: 'Create your first action item', module: 'execution' });
    }

    // Calculate module scores
    result.moduleScores = moduleConfigs.map(config => ({
      ...config,
      progress: getModuleProgress(config.id, activeBoard),
      hasData: getModuleProgress(config.id, activeBoard) > 0
    }));

    // Find strongest and weakest modules
    const modulesWithData = result.moduleScores.filter(m => m.progress > 0);
    if (modulesWithData.length >= 2) {
      modulesWithData.sort((a, b) => b.progress - a.progress);
      result.strongestModule = modulesWithData[0];
      result.weakestModule = modulesWithData[modulesWithData.length - 1];
    }

    return result;
  }, [activeBoard]);

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '$0';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // No vision boards state
  if (visionBoards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to VisionBoard Pro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Your strategic planning journey starts here. Create your first vision board to begin mapping your business success.
          </p>
          <Link to="/visionboards/new">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Vision Board
            </Button>
          </Link>
        </div>

        <Card className="mt-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What you'll build:</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🎯', title: 'Vision & Strategy', desc: 'Define your purpose and direction' },
              { icon: '📊', title: 'OKRs & Goals', desc: 'Set measurable objectives' },
              { icon: '👥', title: 'Team Alignment', desc: 'Clarify roles and accountability' },
              { icon: '💰', title: 'Financial Planning', desc: 'Track revenue and cash' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Board Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's your strategic overview
          </p>
        </div>

        {/* Board Selector */}
        <div className="flex items-center gap-3">
          <select
            className="input min-w-[200px]"
            value={activeBoard?._id || ''}
            onChange={(e) => {
              const board = visionBoards.find(b => b._id === e.target.value);
              setActiveBoard(board);
            }}
          >
            {visionBoards.map(board => (
              <option key={board._id} value={board._id}>
                {board.name} ({board.overallProgress || 0}%)
              </option>
            ))}
          </select>
          <Link to={`/visionboards/${activeBoard?._id}`}>
            <Button variant="secondary" size="sm">View Board</Button>
          </Link>
        </div>
      </div>

      {insights && (
        <>
          {/* Attention Required Section */}
          {insights.attentionItems.length > 0 && (
            <Card className="border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🔔</span>
                <h2 className="font-semibold text-gray-900 dark:text-white">Needs Your Attention</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {insights.attentionItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</span>
                    </div>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{item.action} →</span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Key Metrics Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Overall Progress"
              value={`${insights.overallProgress}%`}
              icon="📈"
              color="blue"
              subtitle="Strategy completion"
            />
            <MetricCard
              label="Active OKRs"
              value={insights.okrs.length}
              icon="🎯"
              color="green"
              subtitle={insights.okrs.length > 0 ? `${insights.okrs.filter(o => (o.progress || 0) >= 70).length} on track` : 'No OKRs set'}
            />
            <MetricCard
              label="Revenue Target"
              value={formatCurrency(insights.revenueTarget)}
              icon="💰"
              color="purple"
              subtitle={insights.currentRevenue > 0 ? `${formatCurrency(insights.currentRevenue)} current` : 'Set your target'}
            />
            <MetricCard
              label="Open Actions"
              value={insights.wwwActions.filter(a => a.status !== 'Done').length}
              icon="📋"
              color="orange"
              subtitle={insights.wwwActions.length > 0 ? `of ${insights.wwwActions.length} total` : 'No actions defined'}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Module Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Module Progress */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Module Health</h2>
                  <Link to={`/visionboards/${activeBoard?._id}/modules`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {insights.moduleScores.map((module) => (
                    <Link
                      key={module.id}
                      to={module.id === 'vision'
                        ? `/visionboards/${activeBoard?._id}?tab=strategy`
                        : `/visionboards/${activeBoard?._id}/modules?module=${module.id}`
                      }
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center text-white text-lg`}>
                        {module.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{module.name}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${module.color} transition-all`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* OKR Progress */}
              {insights.okrs.length > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 dark:text-white">OKR Progress</h2>
                    <Link to={`/visionboards/${activeBoard?._id}/modules?module=targets`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Manage OKRs
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {insights.okrs.slice(0, 3).map((okr, idx) => (
                      <div key={okr.id || idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{okr.objective}</span>
                          <span className={`text-sm font-bold ${(okr.progress || 0) >= 70 ? 'text-green-600 dark:text-green-400' : (okr.progress || 0) >= 40 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                            {okr.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              (okr.progress || 0) >= 70 ? 'bg-green-500' : (okr.progress || 0) >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${okr.progress || 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {(okr.keyResults || []).length} Key Results • Owner: {okr.owner || 'Unassigned'}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Risk Overview */}
              {insights.risks.length > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Risk Landscape</h2>
                    <Link to={`/visionboards/${activeBoard?._id}/modules?module=execution`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Manage Risks
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {insights.risks.filter(r => r.probability === 'High' && r.impact === 'High').length}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Critical</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {insights.risks.filter(r => r.probability === 'Medium' || r.impact === 'Medium').length}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Moderate</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {insights.risks.filter(r => r.probability === 'Low' && r.impact === 'Low').length}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
                    </div>
                  </div>
                  {insights.risks.length > 0 && (
                    <div className="space-y-2">
                      {insights.risks.slice(0, 3).map((risk, idx) => (
                        <div key={risk.id || idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <span className="text-sm text-gray-900 dark:text-white truncate flex-1">{risk.risk}</span>
                          <div className="flex items-center gap-2 ml-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              risk.probability === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              risk.probability === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {risk.probability || 'Low'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Right Column - Quick Actions & Insights */}
            <div className="space-y-6">
              {/* Strengths & Gaps */}
              {insights.strongestModule && insights.weakestModule && (
                <Card>
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Strategy Insights</h2>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-600 dark:text-green-400">💪</span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">STRONGEST AREA</span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">{insights.strongestModule.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{insights.strongestModule.progress}% complete</p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-600 dark:text-orange-400">🎯</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">NEEDS FOCUS</span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">{insights.weakestModule.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{insights.weakestModule.progress}% complete</p>
                      <Link
                        to={insights.weakestModule.id === 'vision'
                          ? `/visionboards/${activeBoard?._id}?tab=strategy`
                          : `/visionboards/${activeBoard?._id}/modules?module=${insights.weakestModule.id}`
                        }
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block"
                      >
                        Start improving →
                      </Link>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Wins */}
              {insights.quickWins.length > 0 && (
                <Card>
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Wins ⚡</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Small actions that take minutes but move you forward</p>
                  <div className="space-y-2">
                    {insights.quickWins.slice(0, 4).map((win, idx) => (
                      <Link
                        key={idx}
                        to={win.module === 'vision'
                          ? `/visionboards/${activeBoard?._id}?tab=strategy`
                          : `/visionboards/${activeBoard?._id}/modules?module=${win.module}`
                        }
                        className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs text-primary-600 dark:text-primary-400 font-medium">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{win.task}</span>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {/* Team & Resources */}
              <Card>
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Resources Overview</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👥</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Team Roles Defined</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{insights.teamRoles}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📊</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">FACe Chart Entries</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{insights.faceChart}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎯</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Talent Assessed</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{insights.talentAssessed}</span>
                  </div>
                </div>
                <Link
                  to={`/visionboards/${activeBoard?._id}/modules?module=resources`}
                  className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline mt-4"
                >
                  Manage Resources →
                </Link>
              </Card>

              {/* AI Coach CTA */}
              <Card className="bg-gradient-to-br from-primary-500 to-indigo-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🤖</span>
                  <div>
                    <h3 className="font-semibold">Ask Patrick</h3>
                    <p className="text-sm text-white/80">AI Business Coach</p>
                  </div>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Get personalized guidance on your strategy, execution, and growth challenges.
                </p>
                <Link to={`/visionboards/${activeBoard?._id}/modules?module=collaboration`}>
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                    Start Conversation
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ label, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;