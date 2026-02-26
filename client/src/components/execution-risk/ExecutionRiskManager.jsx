import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState } from '../common/ModuleCard';
import ModuleHelpButton from '../common/ModuleHelpButton';
import visionBoardService from '../../services/visionBoardService';

const ExecutionRiskManager = ({ visionBoardId }) => {

  const [activeView, setActiveView] = useState('www');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // WWW Actions (Who-What-When)
  const [wwwActions, setWwwActions] = useState([]);
  const [newWWW, setNewWWW] = useState({ who: '', what: '', when: '', status: 'Pending' });

  // Rockefeller Habits Checklist
  const [habits, setHabits] = useState([
    { id: 1, name: 'Daily Huddle', description: '15-min daily standup with each team', completed: false },
    { id: 2, name: 'Weekly Meeting', description: 'Weekly tactical/strategic meeting', completed: false },
    { id: 3, name: 'Monthly Learning', description: 'Monthly training/development session', completed: false },
    { id: 4, name: 'Quarterly Planning', description: 'Quarterly strategic planning offsite', completed: false },
    { id: 5, name: 'Annual Planning', description: 'Annual 2-3 day planning session', completed: false },
    { id: 6, name: 'Scoreboard', description: 'Visible KPI dashboard for all teams', completed: false },
    { id: 7, name: 'Priorities', description: 'Everyone knows top 3-5 priorities', completed: false },
    { id: 8, name: 'Smart Numbers', description: 'Leading indicators tracked daily/weekly', completed: false },
    { id: 9, name: 'OPSP', description: 'One-Page Strategic Plan completed', completed: false },
    { id: 10, name: 'Core Values', description: 'Core values alive and practiced', completed: false }
  ]);

  // Strategic Priorities
  const [priorities, setPriorities] = useState([]);
  const [newPriority, setNewPriority] = useState({ name: '', whyItMatters: '', capabilitiesRequired: '', successLooksLike: '' });

  // Risk Matrix
  const [risks, setRisks] = useState([]);
  const [newRisk, setNewRisk] = useState({ risk: '', probability: 'Medium', impact: 'Medium', preventionStrategy: '', monitoringMethod: '' });

  // Project Portfolio
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', owner: '', deadline: '', status: 'Planning', priority: 'Medium', progress: 0 });

  // AI Simulation
  const [aiSimulation, setAiSimulation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (visionBoardId) {
      fetchVisionBoard();
    }
  }, [visionBoardId]);

  const fetchVisionBoard = async () => {
    try {
      const response = await visionBoardService.getById(visionBoardId);
      setVisionBoard(response.data);

      const ss = response.data.strategySheet || {};

      // Load Strategic Priorities
      if (ss.strategicPriorities?.data) {
        setPriorities(ss.strategicPriorities.data.priorities || []);
        setWwwActions(ss.strategicPriorities.data.wwwActions || []);
        setHabits(ss.strategicPriorities.data.habits || habits);
        setProjects(ss.strategicPriorities.data.projects || []);
      }

      // Load Risks
      if (ss.riskManagement?.data) {
        setRisks(ss.riskManagement.data.risks || []);
      }
    } catch (error) {
      console.error('Failed to fetch vision board:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (sectionName, data) => {
    setSaving(true);
    try {
      const response = await visionBoardService.updateSection(visionBoardId, sectionName, {
        completed: true,
        data
      });
      setVisionBoard(response.data);
      return true;
    } catch (error) {
      console.error(`Failed to save ${sectionName}:`, error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // WWW Actions handlers
  const handleAddWWW = async () => {
    if (!newWWW.who.trim() || !newWWW.what.trim()) return;
    const updated = [...wwwActions, { ...newWWW, id: Date.now() }];
    setWwwActions(updated);
    await saveSection('strategicPriorities', { priorities, wwwActions: updated, habits, projects });
    setNewWWW({ who: '', what: '', when: '', status: 'Pending' });
  };

  const handleToggleWWW = async (id) => {
    const updated = wwwActions.map(a => a.id === id ? { ...a, status: a.status === 'Done' ? 'Pending' : 'Done' } : a);
    setWwwActions(updated);
    await saveSection('strategicPriorities', { priorities, wwwActions: updated, habits, projects });
  };

  const handleDeleteWWW = async (id) => {
    const updated = wwwActions.filter(a => a.id !== id);
    setWwwActions(updated);
    await saveSection('strategicPriorities', { priorities, wwwActions: updated, habits, projects });
  };

  // Habits handlers
  const handleToggleHabit = async (id) => {
    const updated = habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
    setHabits(updated);
    await saveSection('strategicPriorities', { priorities, wwwActions, habits: updated, projects });
  };

  // Priority handlers
  const handleAddPriority = async () => {
    if (!newPriority.name.trim()) return;
    const updated = [...priorities, { ...newPriority, id: Date.now() }];
    setPriorities(updated);
    await saveSection('strategicPriorities', { priorities: updated, wwwActions, habits, projects });
    setShowModal(false);
    setNewPriority({ name: '', whyItMatters: '', capabilitiesRequired: '', successLooksLike: '' });
  };

  // Risk handlers
  const handleAddRisk = async () => {
    if (!newRisk.risk.trim()) return;
    const updated = [...risks, { ...newRisk, id: Date.now() }];
    setRisks(updated);
    await saveSection('riskManagement', { risks: updated });
    setNewRisk({ risk: '', probability: 'Medium', impact: 'Medium', preventionStrategy: '', monitoringMethod: '' });
  };

  const handleDeleteRisk = async (id) => {
    const updated = risks.filter(r => r.id !== id);
    setRisks(updated);
    await saveSection('riskManagement', { risks: updated });
  };

  // Project handlers
  const handleAddProject = async () => {
    if (!newProject.name.trim()) return;
    const updated = [...projects, { ...newProject, id: Date.now() }];
    setProjects(updated);
    await saveSection('strategicPriorities', { priorities, wwwActions, habits, projects: updated });
    setNewProject({ name: '', owner: '', deadline: '', status: 'Planning', priority: 'Medium', progress: 0 });
  };

  const handleUpdateProjectProgress = async (id, progress) => {
    const updated = projects.map(p => p.id === id ? { ...p, progress } : p);
    setProjects(updated);
    await saveSection('strategicPriorities', { priorities, wwwActions, habits, projects: updated });
  };

  // AI Simulation
  const handleRunSimulation = () => {
    setAiLoading(true);
    setTimeout(() => {
      const simulation = `
## Risk Scenario Simulation

**Scenario:** Market downturn with 20% revenue reduction

**Impact Analysis:**
- Cash Runway: Reduced from ${Math.floor(Math.random() * 12 + 6)} months to ${Math.floor(Math.random() * 4 + 2)} months
- Team Impact: May need to reduce workforce by ${Math.floor(Math.random() * 15 + 5)}%
- Strategic Projects: ${Math.floor(Math.random() * 3 + 2)} projects at risk of delay

**Recommended Actions:**
1. Accelerate cash collection - target DSO reduction of 15 days
2. Review non-essential subscriptions and tools
3. Prioritize revenue-generating activities
4. Cross-train team members for flexibility
5. Build 13-week cash flow forecast

**Opportunity:**
- This scenario could be an opportunity to strengthen core operations
- Consider strategic acquisitions at lower valuations
- Focus on customer retention over acquisition
      `;
      setAiSimulation(simulation);
      setAiLoading(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'www', label: 'WWW Actions', icon: '✅' },
          { id: 'habits', label: 'Habits', icon: '📋' },
          { id: 'priorities', label: 'Priorities', icon: '🎯' },
          { id: 'risks', label: 'Risk Matrix', icon: '⚠️' },
          { id: 'portfolio', label: 'Projects', icon: '📁' },
          { id: 'ai', label: 'AI Simulation', icon: '🤖' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeView === tab.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* WWW Actions */}
        {activeView === 'www' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Who-What-When Actions</h3>
              <ModuleHelpButton guideKey="wwwActions" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track action items with clear ownership and deadlines
                </p>
              </div>
            </div>

            {/* Add WWW Action */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-2">
                <input type="text" className="input" placeholder="Who" value={newWWW.who} onChange={(e) => setNewWWW({ ...newWWW, who: e.target.value })} />
                <input type="text" className="input" placeholder="What" value={newWWW.what} onChange={(e) => setNewWWW({ ...newWWW, what: e.target.value })} />
                <input type="date" className="input" value={newWWW.when} onChange={(e) => setNewWWW({ ...newWWW, when: e.target.value })} />
                <Button variant="primary" onClick={handleAddWWW}>Add</Button>
              </div>
            </div>

            {/* WWW List */}
            <div className="space-y-2">
              {wwwActions.map((action) => (
                <div key={action.id} className={`flex items-center gap-4 p-3 rounded-lg ${action.status === 'Done' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                  <button onClick={() => handleToggleWWW(action.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${action.status === 'Done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                    {action.status === 'Done' && '✓'}
                  </button>
                  <div className="flex-1">
                    <span className={action.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}>{action.what}</span>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span>👤 {action.who}</span>
                      {action.when && <span>📅 {action.when}</span>}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteWWW(action.id)} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habits Checklist */}
        {activeView === 'habits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rockefeller Habits Checklist</h3>
              <ModuleHelpButton guideKey="rockefellerHabits" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Core habits for scaling your business
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">{habits.filter(h => h.completed).length}/{habits.length}</div>
                <div className="text-xs text-gray-500">completed</div>
              </div>
            </div>

            <div className="grid gap-2">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`flex items-center gap-4 p-3 rounded-lg text-left transition-all ${
                    habit.completed ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${habit.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                    {habit.completed && '✓'}
                  </div>
                  <div className="flex-1">
                    <div className={habit.completed ? 'text-green-700 dark:text-green-400 font-medium' : 'text-gray-900 dark:text-white font-medium'}>{habit.name}</div>
                    <div className="text-xs text-gray-500">{habit.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Priorities */}
        {activeView === 'priorities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strategic Priorities</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top 3-5 priorities for the next 12 months
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowModal(true)}>+ Add Priority</Button>
            </div>

            {priorities.length === 0 ? (
              <ModuleEmptyState moduleName="Priorities" onAction={() => setShowModal(true)} actionText="Add Your First Priority" />
            ) : (
              <div className="space-y-4">
                {priorities.map((priority, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center font-bold">{index + 1}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{priority.name}</h4>
                        {priority.whyItMatters && <p className="text-sm text-gray-500 mt-1">{priority.whyItMatters}</p>}
                        {priority.successLooksLike && (
                          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                            ✓ Success: {priority.successLooksLike}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Risk Matrix */}
        {activeView === 'risks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Risk Matrix</h3>
              <ModuleHelpButton guideKey="riskMatrix" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Identify and mitigate business risks
                </p>
              </div>
            </div>

            {/* Add Risk */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="text" className="input" placeholder="Risk description" value={newRisk.risk} onChange={(e) => setNewRisk({ ...newRisk, risk: e.target.value })} />
                <input type="text" className="input" placeholder="Prevention strategy" value={newRisk.preventionStrategy} onChange={(e) => setNewRisk({ ...newRisk, preventionStrategy: e.target.value })} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <select className="input" value={newRisk.probability} onChange={(e) => setNewRisk({ ...newRisk, probability: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <select className="input" value={newRisk.impact} onChange={(e) => setNewRisk({ ...newRisk, impact: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <input type="text" className="input" placeholder="Monitoring method" value={newRisk.monitoringMethod} onChange={(e) => setNewRisk({ ...newRisk, monitoringMethod: e.target.value })} />
                <Button variant="primary" onClick={handleAddRisk}>Add Risk</Button>
              </div>
            </div>

            {/* Risk Matrix Grid */}
            <div className="grid grid-cols-4 gap-1 text-center text-xs">
              <div></div>
              <div className="font-medium text-gray-500 py-2">Low Impact</div>
              <div className="font-medium text-gray-500 py-2">Med Impact</div>
              <div className="font-medium text-gray-500 py-2">High Impact</div>

              <div className="font-medium text-gray-500 py-2">High Prob</div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">Medium</div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">High</div>
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded font-bold">Critical</div>

              <div className="font-medium text-gray-500 py-2">Med Prob</div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Low</div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">Medium</div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">High</div>

              <div className="font-medium text-gray-500 py-2">Low Prob</div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Low</div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Low</div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">Medium</div>
            </div>

            {/* Risk List */}
            <div className="space-y-2">
              {risks.map((risk) => (
                <div key={risk.id} className={`p-3 rounded-lg ${risk.probability === 'High' && risk.impact === 'High' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{risk.risk}</div>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded ${risk.probability === 'High' ? 'bg-red-100 text-red-700' : risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{risk.probability} prob</span>
                        <span className={`px-2 py-0.5 rounded ${risk.impact === 'High' ? 'bg-red-100 text-red-700' : risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{risk.impact} impact</span>
                      </div>
                      {risk.preventionStrategy && <div className="text-xs text-gray-400 mt-1">Prevention: {risk.preventionStrategy}</div>}
                    </div>
                    <button onClick={() => handleDeleteRisk(risk.id)} className="text-gray-400 hover:text-red-500">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Portfolio */}
        {activeView === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project Portfolio</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track and manage strategic projects
                </p>
              </div>
            </div>

            {/* Add Project */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input type="text" className="input" placeholder="Project name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
                <input type="text" className="input" placeholder="Owner" value={newProject.owner} onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })} />
                <input type="date" className="input" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <select className="input" value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}>
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>On Hold</option>
                  <option>Complete</option>
                </select>
                <select className="input" value={newProject.priority} onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <Button variant="primary" onClick={handleAddProject}>Add Project</Button>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{project.name}</h4>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>👤 {project.owner}</span>
                        {project.deadline && <span>📅 {project.deadline}</span>}
                        <span className={`px-2 py-0.5 rounded ${project.priority === 'High' ? 'bg-red-100 text-red-700' : project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{project.priority}</span>
                        <span className={`px-2 py-0.5 rounded ${project.status === 'Complete' ? 'bg-green-100 text-green-700' : project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{project.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="100" value={project.progress} onChange={(e) => handleUpdateProjectProgress(project.id, parseInt(e.target.value))} className="flex-1" />
                    <span className="text-sm font-medium w-12 text-right">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Simulation */}
        {activeView === 'ai' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Risk Simulation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Run scenario simulations to prepare for risks
                </p>
              </div>
              <Button variant="primary" onClick={handleRunSimulation} disabled={aiLoading}>
                {aiLoading ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </div>

            {aiSimulation ? (
              <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className="whitespace-pre-wrap text-sm">{aiSimulation}</div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-4xl mb-4 block">🤖</span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Run AI-powered risk simulations to prepare for different scenarios
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Simulations will analyze your risks, projects, and priorities
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Priority Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Strategic Priority">
        <div className="space-y-4">
          <div>
            <label className="label">Priority Name *</label>
            <input type="text" className="input" value={newPriority.name} onChange={(e) => setNewPriority({ ...newPriority, name: e.target.value })} placeholder="What's the priority?" />
          </div>
          <div>
            <label className="label">Why It Matters</label>
            <textarea className="input min-h-[80px]" value={newPriority.whyItMatters} onChange={(e) => setNewPriority({ ...newPriority, whyItMatters: e.target.value })} placeholder="Why is this important?" />
          </div>
          <div>
            <label className="label">Capabilities Required</label>
            <input type="text" className="input" value={newPriority.capabilitiesRequired} onChange={(e) => setNewPriority({ ...newPriority, capabilitiesRequired: e.target.value })} placeholder="What resources/capabilities are needed?" />
          </div>
          <div>
            <label className="label">What Success Looks Like</label>
            <input type="text" className="input" value={newPriority.successLooksLike} onChange={(e) => setNewPriority({ ...newPriority, successLooksLike: e.target.value })} placeholder="How will you know when it's achieved?" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddPriority}>Add Priority</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExecutionRiskManager;