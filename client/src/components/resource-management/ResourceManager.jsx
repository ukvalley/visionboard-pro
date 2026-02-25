import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState, QuickFillGuide } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const ResourceManager = ({ visionBoardId }) => {
  const [activeView, setActiveView] = useState('face');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // FACe Chart - Functional Accountability Chart
  const [faceChart, setFaceChart] = useState([]);

  // PACe Chart - Process Accountability Chart
  const [paceChart, setPaceChart] = useState([]);

  // Organization Structure (roles)
  const [roles, setRoles] = useState([]);

  // SOP Roadmap
  const [sops, setSops] = useState([]);

  // Automation Systems
  const [automation, setAutomation] = useState({
    coreTools: [],
    keyAutomations: [],
    dashboardsNeeded: []
  });

  // 9-Box Grid for Talent Assessment
  const [talentAssessment, setTalentAssessment] = useState([]);

  // New forms
  const [newRole, setNewRole] = useState({ role: '', responsibility: '', successMeasure: '' });
  const [newFACE, setNewFACE] = useState({ function: '', owner: '', accountable: '', consulted: '', informed: '' });
  const [newPACE, setNewPACE] = useState({ process: '', owner: '', frequency: '', status: 'Not Started' });
  const [newTalent, setNewTalent] = useState({ name: '', role: '', performance: 'Medium', potential: 'Medium', notes: '' });

  const quickStartSteps = ['FACe Chart', 'PACe Chart', 'Org Structure', 'Talent', 'SOPs', 'Automation'];

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

      // Load FACe Chart
      if (ss.organizationalStructure?.data?.faceChart) {
        setFaceChart(ss.organizationalStructure.data.faceChart);
      }

      // Load PACe Chart
      if (ss.sopRoadmap?.data?.paceChart) {
        setPaceChart(ss.sopRoadmap.data.paceChart);
      }

      // Load Org Structure
      if (ss.organizationalStructure?.data?.roles) {
        setRoles(ss.organizationalStructure.data.roles);
      }

      // Load Talent Assessment
      if (ss.organizationalStructure?.data?.talentAssessment) {
        setTalentAssessment(ss.organizationalStructure.data.talentAssessment);
      }

      // Load SOP Roadmap
      if (ss.sopRoadmap?.data?.sops) {
        setSops(ss.sopRoadmap.data.sops);
      }

      // Load Automation Systems
      if (ss.automationSystems?.data) {
        setAutomation({
          coreTools: ss.automationSystems.data.coreTools || [],
          keyAutomations: ss.automationSystems.data.keyAutomations || [],
          dashboardsNeeded: ss.automationSystems.data.dashboardsNeeded || []
        });
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

  const handleAddRole = async () => {
    if (!newRole.role.trim()) return;
    const updatedRoles = [...roles, { ...newRole }];
    setRoles(updatedRoles);
    await saveSection('organizationalStructure', { roles: updatedRoles, faceChart, talentAssessment });
    setShowRoleModal(false);
    setNewRole({ role: '', responsibility: '', successMeasure: '' });
  };

  const handleDeleteRole = async (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
    await saveSection('organizationalStructure', { roles: updatedRoles, faceChart, talentAssessment });
  };

  // FACe Chart handlers
  const handleAddFACE = async () => {
    if (!newFACE.function.trim()) return;
    const updated = [...faceChart, { ...newFACE, id: Date.now() }];
    setFaceChart(updated);
    await saveSection('organizationalStructure', { roles, faceChart: updated, talentAssessment });
    setNewFACE({ function: '', owner: '', accountable: '', consulted: '', informed: '' });
  };

  const handleDeleteFACE = async (index) => {
    const updated = faceChart.filter((_, i) => i !== index);
    setFaceChart(updated);
    await saveSection('organizationalStructure', { roles, faceChart: updated, talentAssessment });
  };

  // PACe Chart handlers
  const handleAddPACE = async () => {
    if (!newPACE.process.trim()) return;
    const updated = [...paceChart, { ...newPACE, id: Date.now() }];
    setPaceChart(updated);
    await saveSection('sopRoadmap', { sops, paceChart: updated });
    setNewPACE({ process: '', owner: '', frequency: '', status: 'Not Started' });
  };

  const handleDeletePACE = async (index) => {
    const updated = paceChart.filter((_, i) => i !== index);
    setPaceChart(updated);
    await saveSection('sopRoadmap', { sops, paceChart: updated });
  };

  // Talent Assessment handlers
  const handleAddTalent = async () => {
    if (!newTalent.name.trim()) return;
    const updated = [...talentAssessment, { ...newTalent, id: Date.now() }];
    setTalentAssessment(updated);
    await saveSection('organizationalStructure', { roles, faceChart, talentAssessment: updated });
    setNewTalent({ name: '', role: '', performance: 'Medium', potential: 'Medium', notes: '' });
  };

  const handleDeleteTalent = async (index) => {
    const updated = talentAssessment.filter((_, i) => i !== index);
    setTalentAssessment(updated);
    await saveSection('organizationalStructure', { roles, faceChart, talentAssessment: updated });
  };

  const handleSaveSOPs = async () => {
    await saveSection('sopRoadmap', { sops, paceChart });
  };

  const handleSaveAutomation = async () => {
    await saveSection('automationSystems', automation);
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
        currentStep={activeView === 'org' ? 0 : activeView === 'sop' ? 1 : 2}
        onStepClick={(idx) => setActiveView(idx === 0 ? 'org' : idx === 1 ? 'sop' : 'automation')}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'face', label: 'FACe Chart', icon: '📊' },
          { id: 'pace', label: 'PACe Chart', icon: '🔄' },
          { id: 'org', label: 'Org Structure', icon: '🏢' },
          { id: 'talent', label: '9-Box Grid', icon: '👥' },
          { id: 'sop', label: 'SOP Roadmap', icon: '📋' },
          { id: 'automation', label: 'Automation', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeView === tab.id
                ? 'bg-purple-500 text-white shadow-md'
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
        {/* FACe Chart - Functional Accountability Chart */}
        {activeView === 'face' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">FACe Chart</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Functional Accountability Chart - Clarify who owns what function
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
                    <th className="py-2 px-3 text-left font-semibold">Function</th>
                    <th className="py-2 px-3 text-center font-semibold text-green-600">Owner (O)</th>
                    <th className="py-2 px-3 text-center font-semibold text-blue-600">Accountable (A)</th>
                    <th className="py-2 px-3 text-center font-semibold text-yellow-600">Consulted (C)</th>
                    <th className="py-2 px-3 text-center font-semibold text-gray-500">Informed (I)</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {faceChart.map((row, index) => (
                    <tr key={row.id || index} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="py-2 px-3 font-medium">{row.function}</td>
                      <td className="py-2 px-3 text-center text-green-600 font-medium">{row.owner || '-'}</td>
                      <td className="py-2 px-3 text-center text-blue-600">{row.accountable || '-'}</td>
                      <td className="py-2 px-3 text-center text-yellow-600">{row.consulted || '-'}</td>
                      <td className="py-2 px-3 text-center text-gray-500">{row.informed || '-'}</td>
                      <td className="py-2 px-3">
                        <button onClick={() => handleDeleteFACE(index)} className="text-gray-400 hover:text-red-500">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add new FACe row */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-6 gap-2">
                <input type="text" className="input text-sm" placeholder="Function" value={newFACE.function} onChange={(e) => setNewFACE(prev => ({ ...prev, function: e.target.value }))} />
                <input type="text" className="input text-sm" placeholder="Owner" value={newFACE.owner} onChange={(e) => setNewFACE(prev => ({ ...prev, owner: e.target.value }))} />
                <input type="text" className="input text-sm" placeholder="Accountable" value={newFACE.accountable} onChange={(e) => setNewFACE(prev => ({ ...prev, accountable: e.target.value }))} />
                <input type="text" className="input text-sm" placeholder="Consulted" value={newFACE.consulted} onChange={(e) => setNewFACE(prev => ({ ...prev, consulted: e.target.value }))} />
                <input type="text" className="input text-sm" placeholder="Informed" value={newFACE.informed} onChange={(e) => setNewFACE(prev => ({ ...prev, informed: e.target.value }))} />
                <Button variant="primary" size="sm" onClick={handleAddFACE}>Add</Button>
              </div>
            </div>
          </div>
        )}

        {/* PACe Chart - Process Accountability Chart */}
        {activeView === 'pace' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">PACe Chart</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Process Accountability Chart - Define who owns each process
                </p>
              </div>
            </div>

            {paceChart.length === 0 ? (
              <ModuleEmptyState moduleName="PACe Chart" onAction={() => {}} actionText="Add Your First Process" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                      <th className="py-2 px-3 text-left font-semibold">Process</th>
                      <th className="py-2 px-3 text-left font-semibold">Owner</th>
                      <th className="py-2 px-3 text-left font-semibold">Frequency</th>
                      <th className="py-2 px-3 text-left font-semibold">Status</th>
                      <th className="w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paceChart.map((row, index) => (
                      <tr key={row.id || index} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 px-3 font-medium">{row.process}</td>
                        <td className="py-2 px-3">{row.owner || '-'}</td>
                        <td className="py-2 px-3">{row.frequency || '-'}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            row.status === 'Complete' ? 'bg-green-100 text-green-700' :
                            row.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>{row.status}</span>
                        </td>
                        <td className="py-2 px-3">
                          <button onClick={() => handleDeletePACE(index)} className="text-gray-400 hover:text-red-500">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add new PACe row */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-5 gap-2">
                <input type="text" className="input text-sm" placeholder="Process" value={newPACE.process} onChange={(e) => setNewPACE(prev => ({ ...prev, process: e.target.value }))} />
                <input type="text" className="input text-sm" placeholder="Owner" value={newPACE.owner} onChange={(e) => setNewPACE(prev => ({ ...prev, owner: e.target.value }))} />
                <input type="text" className="input text-sm" placeholder="Frequency" value={newPACE.frequency} onChange={(e) => setNewPACE(prev => ({ ...prev, frequency: e.target.value }))} />
                <select className="input text-sm" value={newPACE.status} onChange={(e) => setNewPACE(prev => ({ ...prev, status: e.target.value }))}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Complete</option>
                </select>
                <Button variant="primary" size="sm" onClick={handleAddPACE}>Add</Button>
              </div>
            </div>
          </div>
        )}

        {/* Org Structure */}
        {activeView === 'org' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Organizational Structure</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define roles, responsibilities, and accountability
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowRoleModal(true)}>
                + Add Role
              </Button>
            </div>

            {roles.length === 0 ? (
              <ModuleEmptyState
                moduleName="Organizational Structure"
                onAction={() => setShowRoleModal(true)}
                actionText="Define Your First Role"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Responsibility</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Success Measure</th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900 dark:text-white">{role.role}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{role.responsibility}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{role.successMeasure}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteRole(index)}
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

        {/* 9-Box Grid - Talent Assessment */}
        {activeView === 'talent' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">9-Box Grid - Talent Assessment</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Assess team members on performance and potential
                </p>
              </div>
            </div>

            {/* 9-Box Grid Visual */}
            <div className="grid grid-cols-3 gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1 text-center text-xs">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">High Potential<br/>Low Performance</div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">High Potential<br/>Med Performance</div>
              <div className="bg-green-200 dark:bg-green-800/30 p-2 rounded font-bold">Star<br/>High/High</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">Low Potential<br/>Low Performance</div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Core Player<br/>Med/Med</div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">High Performer<br/>Med Potential</div>
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">Underperformer</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">Solid Performer<br/>Low Potential</div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Expert<br/>High/Low</div>
            </div>

            {/* Talent List */}
            <div className="space-y-3">
              {talentAssessment.map((person, index) => (
                <div key={person.id || index} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">
                    {person.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.role}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Performance</div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        person.performance === 'High' ? 'bg-green-100 text-green-700' :
                        person.performance === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{person.performance}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Potential</div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        person.potential === 'High' ? 'bg-green-100 text-green-700' :
                        person.potential === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{person.potential}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTalent(index)} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              ))}
            </div>

            {/* Add Talent Form */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-5 gap-2">
                <input type="text" className="input text-sm" placeholder="Name" value={newTalent.name} onChange={(e) => setNewTalent(prev => ({ ...prev, name: e.target.value }))} />
                <input type="text" className="input text-sm" placeholder="Role" value={newTalent.role} onChange={(e) => setNewTalent(prev => ({ ...prev, role: e.target.value }))} />
                <select className="input text-sm" value={newTalent.performance} onChange={(e) => setNewTalent(prev => ({ ...prev, performance: e.target.value }))}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <select className="input text-sm" value={newTalent.potential} onChange={(e) => setNewTalent(prev => ({ ...prev, potential: e.target.value }))}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <Button variant="primary" size="sm" onClick={handleAddTalent}>Add</Button>
              </div>
            </div>
          </div>
        )}

        {/* SOP Roadmap */}
        {activeView === 'sop' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">SOP Roadmap</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Standard Operating Procedures to document and systemize
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveSOPs} disabled={saving}>
                {saving ? 'Saving...' : 'Save SOPs'}
              </Button>
            </div>

            <div className="space-y-3">
              {sops.map((sop, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                    {sop.order || index + 1}
                  </span>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="input mb-2"
                      value={sop.name}
                      onChange={(e) => {
                        const updated = sops.map((s, i) => i === index ? { ...s, name: e.target.value } : s);
                        setSops(updated);
                      }}
                      placeholder="SOP Name"
                    />
                    <input
                      type="text"
                      className="input text-sm"
                      value={sop.description}
                      onChange={(e) => {
                        const updated = sops.map((s, i) => i === index ? { ...s, description: e.target.value } : s);
                        setSops(updated);
                      }}
                      placeholder="Description"
                    />
                  </div>
                  <button
                    onClick={() => setSops(sops.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() => setSops([...sops, { order: sops.length + 1, name: '', description: '' }])}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span className="w-8 h-8 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center">
                  +
                </span>
                Add SOP
              </button>
            </div>
          </div>
        )}

        {/* Automation */}
        {activeView === 'automation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Automation & Systems</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tools, automations, and dashboards to build
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveAutomation} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Core Tools */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🛠️ Core Tools</h4>
                <div className="space-y-2">
                  {automation.coreTools.map((tool, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        value={tool}
                        onChange={(e) => {
                          const updated = automation.coreTools.map((t, i) => i === index ? e.target.value : t);
                          setAutomation({ ...automation, coreTools: updated });
                        }}
                      />
                      <button
                        onClick={() => setAutomation({
                          ...automation,
                          coreTools: automation.coreTools.filter((_, i) => i !== index)
                        })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setAutomation({ ...automation, coreTools: [...automation.coreTools, ''] })}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    + Add Tool
                  </button>
                </div>
              </div>

              {/* Key Automations */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">⚡ Key Automations</h4>
                <div className="space-y-2">
                  {automation.keyAutomations.map((auto, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        value={auto}
                        onChange={(e) => {
                          const updated = automation.keyAutomations.map((a, i) => i === index ? e.target.value : a);
                          setAutomation({ ...automation, keyAutomations: updated });
                        }}
                      />
                      <button
                        onClick={() => setAutomation({
                          ...automation,
                          keyAutomations: automation.keyAutomations.filter((_, i) => i !== index)
                        })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setAutomation({ ...automation, keyAutomations: [...automation.keyAutomations, ''] })}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    + Add Automation
                  </button>
                </div>
              </div>

              {/* Dashboards */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📊 Dashboards Needed</h4>
                <div className="space-y-2">
                  {automation.dashboardsNeeded.map((dash, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        value={dash}
                        onChange={(e) => {
                          const updated = automation.dashboardsNeeded.map((d, i) => i === index ? e.target.value : d);
                          setAutomation({ ...automation, dashboardsNeeded: updated });
                        }}
                      />
                      <button
                        onClick={() => setAutomation({
                          ...automation,
                          dashboardsNeeded: automation.dashboardsNeeded.filter((_, i) => i !== index)
                        })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setAutomation({ ...automation, dashboardsNeeded: [...automation.dashboardsNeeded, ''] })}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    + Add Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Add Role"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Role Title *</label>
            <input
              type="text"
              className="input"
              value={newRole.role}
              onChange={(e) => setNewRole(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., CEO, VP Sales, Account Manager"
            />
          </div>

          <div>
            <label className="label">Responsibility</label>
            <textarea
              className="input min-h-[80px]"
              value={newRole.responsibility}
              onChange={(e) => setNewRole(prev => ({ ...prev, responsibility: e.target.value }))}
              placeholder="What are they accountable for?"
            />
          </div>

          <div>
            <label className="label">Success Measure</label>
            <input
              type="text"
              className="input"
              value={newRole.successMeasure}
              onChange={(e) => setNewRole(prev => ({ ...prev, successMeasure: e.target.value }))}
              placeholder="How do you measure success?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddRole}>Add Role</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResourceManager;