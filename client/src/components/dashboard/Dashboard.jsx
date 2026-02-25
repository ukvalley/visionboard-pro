import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { formatCurrency, formatDate, sectionNames } from '../../utils/helpers';
import visionBoardService from '../../services/visionBoardService';
import { moduleConfigs, getModuleProgress } from '../common/ModuleCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [visionBoards, setVisionBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBoards: 0,
    activeBoards: 0,
    averageProgress: 0,
    activeGoals: 24,
    completedMilestones: 18,
    pendingActions: 7
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await visionBoardService.getAll();
      const boards = response.data || [];
      setVisionBoards(boards);

      if (boards.length > 0) {
        setActiveBoard(boards[0]);
      }

      setStats({
        totalBoards: boards.length,
        activeBoards: boards.filter(b => b.isActive).length,
        averageProgress: boards.length > 0
          ? Math.round(boards.reduce((acc, b) => acc + (b.overallProgress || 0), 0) / boards.length)
          : 0,
        activeGoals: 24,
        completedMilestones: 18,
        pendingActions: 7
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate module progress based on active board data
  const getModuleCards = () => {
    return moduleConfigs.map(config => ({
      ...config,
      stats: {
        progress: activeBoard ? getModuleProgress(config.id, activeBoard) : 0,
        label: config.shortName
      },
      href: activeBoard ? `/visionboards/${activeBoard._id}/modules?module=${config.id}` : '/visionboards'
    }));
  };

  const moduleCards = getModuleCards();

  const quickActions = [
    { name: 'New Vision Board', icon: '➕', href: '/visionboards/new' },
    { name: 'Add Monthly Update', icon: '📝', href: '/progress' },
    { name: 'View Analytics', icon: '📈', href: activeBoard ? `/visionboards/${activeBoard._id}/modules?module=financial` : '/visionboards' },
    { name: 'Team Review', icon: '👥', href: activeBoard ? `/visionboards/${activeBoard._id}/modules?module=resources` : '/visionboards' }
  ];

  const recentActivity = [
    { id: 1, action: 'Updated financial goals', module: 'Vision Board', time: '2 hours ago' },
    { id: 2, action: 'Completed Q1 milestone', module: 'Target Tracker', time: '5 hours ago' },
    { id: 3, action: 'Added new team member', module: 'Resources', time: '1 day ago' },
    { id: 4, action: 'Risk assessment updated', module: 'Execution', time: '2 days ago' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 rounded-2xl p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-primary-100 mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-primary-100 max-w-lg">
              Your vision boards are waiting. Track your progress, update your goals, and stay focused on execution.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/visionboards">
              <Button className="bg-white/20 text-white hover:bg-white/30 border border-white/30">
                View All Boards
              </Button>
            </Link>
            <Link to="/visionboards/new">
              <Button className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Vision Board
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Vision Boards"
          value={stats.totalBoards}
          icon="🎯"
          color="primary"
          trend="+2 this month"
        />
        <StatsCard
          title="Avg Progress"
          value={`${stats.averageProgress}%`}
          icon="📊"
          color="green"
          trend="Across all boards"
        />
        <StatsCard
          title="Active Goals"
          value={stats.activeGoals}
          icon="🎯"
          color="blue"
          trend="8 modules"
        />
        <StatsCard
          title="Milestones Done"
          value={stats.completedMilestones}
          icon="✅"
          color="purple"
          trend="On track"
        />
        <StatsCard
          title="Pending Actions"
          value={stats.pendingActions}
          icon="⏳"
          color="orange"
          trend="Needs attention"
        />
      </div>

      {/* Active Vision Board Selector */}
      {visionBoards.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Vision Board</h2>
            <Link to="/visionboards" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Switch Board →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {visionBoards.map(board => (
              <button
                key={board._id}
                onClick={() => setActiveBoard(board)}
                className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all ${
                  activeBoard?._id === board._id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {board.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{board.name}</p>
                    <p className="text-xs text-gray-500">{board.overallProgress}% complete</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Module Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Modules Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">8 modules available for your vision board</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {moduleCards.map(module => (
            <Link key={module.id} to={module.href}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {module.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{module.stats.progress}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{module.stats.label}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {module.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {module.description}
                </p>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${module.color} transition-all`}
                    style={{ width: `${module.stats.progress}%` }}
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{action.name}</span>
                  <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-primary-600 dark:text-primary-400">{activity.module}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-primary-600 dark:text-primary-400">Tip:</strong> Your revenue is trending 15% above target. Consider increasing your Q2 goals.
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-orange-600 dark:text-orange-400">Alert:</strong> 3 action items are past due in Execution & Risk module.
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-green-600 dark:text-green-400">Success:</strong> Team accountability score improved by 12% this month.
              </p>
            </div>
          </div>
          <Link to={activeBoard ? `/visionboards/${activeBoard._id}/modules?module=collaboration` : '/visionboards'}>
            <Button variant="primary" className="w-full mt-4">
              Ask Patrick AI Coach
            </Button>
          </Link>
        </Card>
      </div>

      {/* No Vision Boards State */}
      {visionBoards.length === 0 && (
        <Card className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No vision boards yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Create your first vision board to start planning and tracking your business goals with all 8 modules
          </p>
          <Link to="/visionboards/new">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Board
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-violet-600',
    orange: 'from-orange-500 to-amber-600'
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;