import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState, QuickFillGuide } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const ExecutionRiskManager = ({ visionBoardId }) => {
  const [activeView, setActiveView] = useState('priorities');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Strategic Priorities
  const [priorities, setPriorities] = useState([]);

  // 3-Year Strategy
  const [threeYearStrategy, setThreeYearStrategy] = useState({
    year1: { objectives: [], initiatives: [], outcomes: [] },
    year2: { objectives: [], initiatives: [], outcomes: [] },
    year3: { objectives: [], initiatives: [], outcomes: [] }
  });

  // Risks
  const [risks, setRisks] = useState([]);

  // New item forms
  const [newPriority, setNewPriority] = useState({ name: '', whyItMatters: '', capabilitiesRequired: '', successLooksLike: '' });
  const [newRisk, setNewRisk] = useState({ risk: '', probability: 'Medium', impact: 'Medium', preventionStrategy: '', monitoringMethod: '' });

  const quickStartSteps = ['Strategic Priorities', '3-Year Strategy', 'Risk Management'];

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
      if (ss.strategicPriorities?.data?.priorities) {
        setPriorities(ss.strategicPriorities.data.priorities);
      }

      // Load 3-Year Strategy
      if (ss.threeYearStrategy?.data) {
        setThreeYearStrategy({
          year1: ss.threeYearStrategy.data.year1 || { objectives: [], initiatives: [], outcomes: [] },
          year2: ss.threeYearStrategy.data.year2 || { objectives: [], initiatives: [], outcomes: [] },
          year3: ss.threeYearStrategy.data.year3 || { objectives: [], initiatives: [], outcomes: [] }
        });
      }

      // Load Risks
      if (ss.riskManagement?.data?.risks) {
        setRisks(ss.riskManagement.data.risks);
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

  const handleAddPriority = async () => {
    if (!newPriority.name.trim()) return;

    const updated = [...priorities, { ...newPriority }];
    setPriorities(updated);
    await saveSection('strategicPriorities', { priorities: updated });
    setShowModal(false);
    setNewPriority({ name: '', whyItMatters: '', capabilitiesRequired: '', successLooksLike: '' });
  };

  const handleDeletePriority = async (index) => {
    const updated = priorities.filter((_, i) => i !== index);
    setPriorities(updated);
    await saveSection('strategicPriorities', { priorities: updated });
  };

  const handleAddRisk = async () => {
    if (!newRisk.risk.trim()) return;

    const updated = [...risks, { ...newRisk }];
    setRisks(updated);
    await saveSection('riskManagement', { risks: updated });
    setShowModal(false);
    setNewRisk({ risk: '', probability: 'Medium', impact: 'Medium', preventionStrategy: '', monitoringMethod: '' });
  };

  const handleDeleteRisk = async (index) => {
    const updated = risks.filter((_, i) => i !== index);
    setRisks(updated);
    await saveSection('riskManagement', { risks: updated });
  };

  const handleSaveThreeYearStrategy = async () => {
    await saveSection('threeYearStrategy', threeYearStrategy);
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
        currentStep={activeView === 'priorities' ? 0 : activeView === 'strategy' ? 1 : 2}
        onStepClick={(idx) => setActiveView(idx === 0 ? 'priorities' : idx === 1 ? 'strategy' : 'risks')}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'priorities', label: 'Strategic Priorities', icon: '🎯' },
          { id: 'strategy', label: '3-Year Strategy', icon: '📅' },
          { id: 'risks', label: 'Risk Management', icon: '⚠️' }
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
        {/* Strategic Priorities */}
        {activeView === 'priorities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strategic Priorities</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top 3-5 priorities that will drive your success
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                + Add Priority
              </Button>
            </div>

            {priorities.length === 0 ? (
              <ModuleEmptyState
                moduleName="Strategic Priorities"
                onAction={() => setShowModal(true)}
                actionText="Define Your First Priority"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {priorities.map((priority, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{priority.name}</h4>
                      </div>
                      <button
                        onClick={() => handleDeletePriority(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      {priority.whyItMatters && (
                        <p><span className="text-gray-500 dark:text-gray-400">Why it matters:</span> <span className="text-gray-700 dark:text-gray-300">{priority.whyItMatters}</span></p>
                      )}
                      {priority.capabilitiesRequired && (
                        <p><span className="text-gray-500 dark:text-gray-400">Capabilities:</span> <span className="text-gray-700 dark:text-gray-300">{priority.capabilitiesRequired}</span></p>
                      )}
                      {priority.successLooksLike && (
                        <p><span className="text-gray-500 dark:text-gray-400">Success:</span> <span className="text-gray-700 dark:text-gray-300">{priority.successLooksLike}</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3-Year Strategy */}
        {activeView === 'strategy' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">3-Year Strategy Map</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define objectives, initiatives, and outcomes for each year
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveThreeYearStrategy} disabled={saving}>
                {saving ? 'Saving...' : 'Save Strategy'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {['year1', 'year2', 'year3'].map((year, idx) => (
                <div key={year} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                      idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      Y{idx + 1}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">Year {idx + 1}</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Objectives</label>
                      <textarea
                        className="input text-sm min-h-[60px] mt-1"
                        value={threeYearStrategy[year]?.objectives?.join('\n') || ''}
                        onChange={(e) => {
                          setThreeYearStrategy(prev => ({
                            ...prev,
                            [year]: {
                              ...prev[year],
                              objectives: e.target.value.split('\n').filter(o => o.trim())
                            }
                          }));
                        }}
                        placeholder="One objective per line..."
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Initiatives</label>
                      <textarea
                        className="input text-sm min-h-[60px] mt-1"
                        value={threeYearStrategy[year]?.initiatives?.join('\n') || ''}
                        onChange={(e) => {
                          setThreeYearStrategy(prev => ({
                            ...prev,
                            [year]: {
                              ...prev[year],
                              initiatives: e.target.value.split('\n').filter(i => i.trim())
                            }
                          }));
                        }}
                        placeholder="One initiative per line..."
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Outcomes</label>
                      <textarea
                        className="input text-sm min-h-[60px] mt-1"
                        value={threeYearStrategy[year]?.outcomes?.join('\n') || ''}
                        onChange={(e) => {
                          setThreeYearStrategy(prev => ({
                            ...prev,
                            [year]: {
                              ...prev[year],
                              outcomes: e.target.value.split('\n').filter(o => o.trim())
                            }
                          }));
                        }}
                        placeholder="One outcome per line..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Management */}
        {activeView === 'risks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Risk Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Identify and mitigate potential risks to your business
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                + Add Risk
              </Button>
            </div>

            {risks.length === 0 ? (
              <ModuleEmptyState
                moduleName="Risks"
                onAction={() => setShowModal(true)}
                actionText="Identify Your First Risk"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Risk</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Probability</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Impact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Prevention</th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {risks.map((risk, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{risk.risk}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            risk.probability === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {risk.probability}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            risk.impact === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {risk.impact}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{risk.preventionStrategy}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteRisk(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={activeView === 'priorities' ? 'Add Strategic Priority' : 'Add Risk'}
      >
        {activeView === 'priorities' ? (
          <div className="space-y-4">
            <div>
              <label className="label">Priority Name *</label>
              <input
                type="text"
                className="input"
                value={newPriority.name}
                onChange={(e) => setNewPriority(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Expand into new markets"
              />
            </div>
            <div>
              <label className="label">Why It Matters</label>
              <textarea
                className="input min-h-[80px]"
                value={newPriority.whyItMatters}
                onChange={(e) => setNewPriority(prev => ({ ...prev, whyItMatters: e.target.value }))}
                placeholder="Why is this priority important?"
              />
            </div>
            <div>
              <label className="label">Capabilities Required</label>
              <input
                type="text"
                className="input"
                value={newPriority.capabilitiesRequired}
                onChange={(e) => setNewPriority(prev => ({ ...prev, capabilitiesRequired: e.target.value }))}
                placeholder="What capabilities do you need?"
              />
            </div>
            <div>
              <label className="label">What Success Looks Like</label>
              <input
                type="text"
                className="input"
                value={newPriority.successLooksLike}
                onChange={(e) => setNewPriority(prev => ({ ...prev, successLooksLike: e.target.value }))}
                placeholder="How will you know you succeeded?"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddPriority}>Add Priority</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="label">Risk *</label>
              <input
                type="text"
                className="input"
                value={newRisk.risk}
                onChange={(e) => setNewRisk(prev => ({ ...prev, risk: e.target.value }))}
                placeholder="What could go wrong?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Probability</label>
                <select
                  className="input"
                  value={newRisk.probability}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, probability: e.target.value }))}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="label">Impact</label>
                <select
                  className="input"
                  value={newRisk.impact}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, impact: e.target.value }))}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Prevention Strategy</label>
              <textarea
                className="input min-h-[80px]"
                value={newRisk.preventionStrategy}
                onChange={(e) => setNewRisk(prev => ({ ...prev, preventionStrategy: e.target.value }))}
                placeholder="How will you prevent or mitigate this risk?"
              />
            </div>
            <div>
              <label className="label">Monitoring Method</label>
              <input
                type="text"
                className="input"
                value={newRisk.monitoringMethod}
                onChange={(e) => setNewRisk(prev => ({ ...prev, monitoringMethod: e.target.value }))}
                placeholder="How will you monitor this risk?"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddRisk}>Add Risk</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExecutionRiskManager;