import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState, QuickFillGuide } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const TargetTracker = ({ visionBoardId }) => {
  const [activeView, setActiveView] = useState('smart');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // SMART Goals state
  const [smartGoals, setSmartGoals] = useState([]);

  // Quarterly Plan state
  const [quarterlyPlan, setQuarterlyPlan] = useState([]);

  // New goal form
  const [newGoal, setNewGoal] = useState({
    goal: '',
    metric: '',
    target: '',
    deadline: '',
    owner: ''
  });

  const quickStartSteps = ['SMART Goals', 'Quarterly Plan'];

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

      // Load SMART Goals
      if (ss.smartGoals?.data?.goals) {
        setSmartGoals(ss.smartGoals.data.goals);
      }

      // Load Quarterly Plan
      if (ss.quarterlyPlan?.data?.quarters) {
        setQuarterlyPlan(ss.quarterlyPlan.data.quarters);
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

  const handleAddSmartGoal = async () => {
    if (!newGoal.goal.trim()) return;

    const goals = [...smartGoals, { ...newGoal, progress: 0 }];
    setSmartGoals(goals);
    await saveSection('smartGoals', { goals });
    setShowGoalModal(false);
    setNewGoal({ goal: '', metric: '', target: '', deadline: '', owner: '' });
  };

  const handleUpdateGoalProgress = async (index, progress) => {
    const goals = smartGoals.map((g, i) => i === index ? { ...g, progress } : g);
    setSmartGoals(goals);
    await saveSection('smartGoals', { goals });
  };

  const handleDeleteGoal = async (index) => {
    const goals = smartGoals.filter((_, i) => i !== index);
    setSmartGoals(goals);
    await saveSection('smartGoals', { goals });
  };

  const handleSaveQuarterlyPlan = async () => {
    await saveSection('quarterlyPlan', { quarters: quarterlyPlan });
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
      {/* Quick Start Guide */}
      <QuickFillGuide
        steps={quickStartSteps}
        currentStep={activeView === 'smart' ? 0 : 1}
        onStepClick={(idx) => setActiveView(idx === 0 ? 'smart' : 'quarterly')}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'smart', label: 'SMART Goals', icon: '🎯' },
          { id: 'quarterly', label: 'Quarterly Plan', icon: '📅' },
          { id: 'milestones', label: 'Milestones', icon: '🏁' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeView === tab.id
                ? 'bg-green-500 text-white shadow-md'
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
        {/* SMART Goals */}
        {activeView === 'smart' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">SMART Goals</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Specific, Measurable, Achievable, Relevant, Time-bound goals
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowGoalModal(true)}>
                + Add Goal
              </Button>
            </div>

            {smartGoals.length === 0 ? (
              <ModuleEmptyState
                moduleName="SMART Goals"
                onAction={() => setShowGoalModal(true)}
                actionText="Create Your First Goal"
              />
            ) : (
              <div className="space-y-4">
                {smartGoals.map((goal, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{goal.goal}</h4>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {goal.metric && <span>📊 Metric: {goal.metric}</span>}
                          {goal.target && <span>🎯 Target: {goal.target}</span>}
                          {goal.deadline && <span>📅 Due: {goal.deadline}</span>}
                          {goal.owner && <span>👤 Owner: {goal.owner}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          goal.progress >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          goal.progress >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {goal.progress || 0}%
                        </span>
                        <button
                          onClick={() => handleDeleteGoal(index)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${goal.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress || 0}
                        onChange={(e) => handleUpdateGoalProgress(index, parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quarterly Plan */}
        {activeView === 'quarterly' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quarterly Execution Plan</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define your focus themes and key actions for each quarter
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveQuarterlyPlan} disabled={saving}>
                {saving ? 'Saving...' : 'Save Plan'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, idx) => {
                const quarterData = quarterlyPlan.find(q => q.quarter === quarter) || {
                  quarter,
                  focusTheme: '',
                  keyActions: [],
                  owner: ''
                };

                return (
                  <div key={quarter} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                        idx === 0 ? 'bg-green-500' :
                        idx === 1 ? 'bg-blue-500' :
                        idx === 2 ? 'bg-orange-500' : 'bg-purple-500'
                      }`}>
                        {quarter}
                      </span>
                      <input
                        type="text"
                        className="input flex-1"
                        value={quarterData.focusTheme || ''}
                        onChange={(e) => {
                          const existing = quarterlyPlan.findIndex(q => q.quarter === quarter);
                          let updated;
                          if (existing >= 0) {
                            updated = quarterlyPlan.map((q, i) => i === existing ? { ...q, focusTheme: e.target.value } : q);
                          } else {
                            updated = [...quarterlyPlan, { ...quarterData, focusTheme: e.target.value }];
                          }
                          setQuarterlyPlan(updated);
                        }}
                        placeholder="Focus theme..."
                      />
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Key Actions</label>
                        <textarea
                          className="input text-sm min-h-[60px] mt-1"
                          value={quarterData.keyActions?.join('\n') || ''}
                          onChange={(e) => {
                            const existing = quarterlyPlan.findIndex(q => q.quarter === quarter);
                            let updated;
                            const newActions = e.target.value.split('\n').filter(a => a.trim());
                            if (existing >= 0) {
                              updated = quarterlyPlan.map((q, i) => i === existing ? { ...q, keyActions: newActions } : q);
                            } else {
                              updated = [...quarterlyPlan, { ...quarterData, keyActions: newActions }];
                            }
                            setQuarterlyPlan(updated);
                          }}
                          placeholder="One action per line..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Owner</label>
                        <input
                          type="text"
                          className="input text-sm mt-1"
                          value={quarterData.owner || ''}
                          onChange={(e) => {
                            const existing = quarterlyPlan.findIndex(q => q.quarter === quarter);
                            let updated;
                            if (existing >= 0) {
                              updated = quarterlyPlan.map((q, i) => i === existing ? { ...q, owner: e.target.value } : q);
                            } else {
                              updated = [...quarterlyPlan, { ...quarterData, owner: e.target.value }];
                            }
                            setQuarterlyPlan(updated);
                          }}
                          placeholder="Who's responsible?"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Milestones */}
        {activeView === 'milestones' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Key Milestones</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track major milestones on your path to achieving goals
              </p>
            </div>

            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-4xl mb-4 block">🏁</span>
              <p className="text-gray-500 dark:text-gray-400">
                Milestones are automatically created from your SMART Goals and Quarterly Plan.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Add goals above to see milestones here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title="Add SMART Goal"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Goal *</label>
            <input
              type="text"
              className="input"
              value={newGoal.goal}
              onChange={(e) => setNewGoal(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="What do you want to achieve?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Metric</label>
              <input
                type="text"
                className="input"
                value={newGoal.metric}
                onChange={(e) => setNewGoal(prev => ({ ...prev, metric: e.target.value }))}
                placeholder="e.g., Revenue, Users"
              />
            </div>
            <div>
              <label className="label">Target</label>
              <input
                type="text"
                className="input"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                placeholder="e.g., $100K, 1000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Deadline</label>
              <input
                type="date"
                className="input"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Owner</label>
              <input
                type="text"
                className="input"
                value={newGoal.owner}
                onChange={(e) => setNewGoal(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="Who's responsible?"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowGoalModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddSmartGoal}>Add Goal</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TargetTracker;