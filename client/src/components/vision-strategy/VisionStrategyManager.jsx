import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const VisionStrategyManager = ({ visionBoardId }) => {
  const [activeView, setActiveView] = useState('mission');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states for each section
  const [missionVisionData, setMissionVisionData] = useState({
    mission: '',
    vision: ''
  });
  const [companyData, setCompanyData] = useState({
    companyName: '',
    industry: '',
    coreOffering: '',
    targetCustomer: '',
    primaryProblem: ''
  });
  const [swotData, setSwotData] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });
  const [bhagData, setBhagData] = useState({
    bhagStatement: '',
    revenueGoal: '',
    timeHorizon: '10 years'
  });
  const [coreValuesData, setCoreValuesData] = useState([]);
  const [brandPromiseData, setBrandPromiseData] = useState({
    promiseStatement: '',
    promisedOutcome: '',
    timeframe: ''
  });

  useEffect(() => {
    if (visionBoardId) {
      fetchVisionBoard();
    }
  }, [visionBoardId]);

  const fetchVisionBoard = async () => {
    try {
      const response = await visionBoardService.getById(visionBoardId);
      setVisionBoard(response.data);

      // Load data from strategySheet sections
      const ss = response.data.strategySheet || {};

      // Company Overview
      if (ss.companyOverview?.data) {
        setCompanyData({
          companyName: ss.companyOverview.data.companyName || '',
          industry: ss.companyOverview.data.industry || '',
          coreOffering: ss.companyOverview.data.coreOffering || '',
          targetCustomer: ss.companyOverview.data.targetCustomerProfile?.whoBuys || '',
          primaryProblem: ss.companyOverview.data.primaryProblem || ''
        });
      }

      // Mission
      if (ss.mission?.data) {
        setMissionVisionData(prev => ({
          ...prev,
          mission: ss.mission.data.missionStatement || ''
        }));
      }

      // Vision
      if (ss.vision?.data) {
        setMissionVisionData(prev => ({
          ...prev,
          vision: ss.vision.data.visionStatement || ''
        }));
      }

      // Core Values
      if (ss.coreValues?.data?.values) {
        setCoreValuesData(ss.coreValues.data.values.map(v => v.value || v));
      }

      // Brand Promise
      if (ss.brandPromise?.data) {
        setBrandPromiseData({
          promiseStatement: ss.brandPromise.data.promiseStatement || '',
          promisedOutcome: ss.brandPromise.data.promisedOutcome || '',
          timeframe: ss.brandPromise.data.timeframe || ''
        });
      }

      // BHAG
      if (ss.bhag?.data) {
        setBhagData({
          bhagStatement: ss.bhag.data.bhagStatement || '',
          revenueGoal: ss.bhag.data.revenueGoal || '',
          timeHorizon: ss.bhag.data.timeHorizon || '10 years'
        });
      }

      // SWOT
      if (ss.swotAnalysis?.data) {
        setSwotData({
          strengths: ss.swotAnalysis.data.strengths || [],
          weaknesses: ss.swotAnalysis.data.weaknesses || [],
          opportunities: ss.swotAnalysis.data.opportunities || [],
          threats: ss.swotAnalysis.data.threats || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch vision board:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generic save function for any section
  const saveSection = async (sectionName, data, markComplete = true) => {
    setSaving(true);
    try {
      const response = await visionBoardService.updateSection(visionBoardId, sectionName, {
        completed: markComplete,
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

  // Save handlers
  const handleSaveCompanyOverview = () => {
    saveSection('companyOverview', {
      companyName: companyData.companyName,
      industry: companyData.industry,
      coreOffering: companyData.coreOffering,
      targetCustomerProfile: { whoBuys: companyData.targetCustomer },
      primaryProblem: companyData.primaryProblem
    });
  };

  const handleSaveMissionVision = async () => {
    await saveSection('mission', { missionStatement: missionVisionData.mission });
    await saveSection('vision', { visionStatement: missionVisionData.vision });
  };

  const handleSaveCoreValues = () => {
    saveSection('coreValues', {
      values: coreValuesData.map(v => ({ value: v, behavior: '' }))
    });
  };

  const handleSaveBrandPromise = () => {
    saveSection('brandPromise', brandPromiseData);
  };

  const handleSaveBhag = () => {
    saveSection('bhag', bhagData);
  };

  const handleSaveSwot = () => {
    saveSection('swotAnalysis', swotData);
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
          { id: 'mission', label: 'Mission & Vision', icon: '🌟' },
          { id: 'company', label: 'Company Overview', icon: '🏢' },
          { id: 'values', label: 'Core Values', icon: '💎' },
          { id: 'brand', label: 'Brand Promise', icon: '🤝' },
          { id: 'bhag', label: 'BHAG', icon: '🎯' },
          { id: 'swot', label: 'SWOT Analysis', icon: '🔍' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeView === tab.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Mission & Vision */}
        {activeView === 'mission' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mission & Vision Statements</h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mission Statement
                </label>
                <textarea
                  className="input min-h-[150px]"
                  value={missionVisionData.mission}
                  onChange={(e) => setMissionVisionData(prev => ({ ...prev, mission: e.target.value }))}
                  placeholder="Why does your organization exist? What do you do every day?"
                />
                <p className="text-xs text-gray-500 mt-1">Your mission is your daily purpose - what you do and for whom.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vision Statement
                </label>
                <textarea
                  className="input min-h-[150px]"
                  value={missionVisionData.vision}
                  onChange={(e) => setMissionVisionData(prev => ({ ...prev, vision: e.target.value }))}
                  placeholder="Where do you see your organization in 3-10 years?"
                />
                <p className="text-xs text-gray-500 mt-1">Your vision is your destination - where you're heading.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveMissionVision} disabled={saving}>
                {saving ? 'Saving...' : 'Save Mission & Vision'}
              </Button>
            </div>
          </div>
        )}

        {/* Company Overview */}
        {activeView === 'company' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Company Overview</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Company Name</label>
                <input
                  type="text"
                  className="input"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="label">Industry</label>
                <input
                  type="text"
                  className="input"
                  value={companyData.industry}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., SaaS, E-commerce, Consulting"
                />
              </div>

              <div>
                <label className="label">Core Offering</label>
                <input
                  type="text"
                  className="input"
                  value={companyData.coreOffering}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, coreOffering: e.target.value }))}
                  placeholder="What is your main product/service?"
                />
              </div>

              <div>
                <label className="label">Target Customer</label>
                <input
                  type="text"
                  className="input"
                  value={companyData.targetCustomer}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, targetCustomer: e.target.value }))}
                  placeholder="Who is your ideal customer?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Primary Problem You Solve</label>
                <textarea
                  className="input min-h-[100px]"
                  value={companyData.primaryProblem}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, primaryProblem: e.target.value }))}
                  placeholder="What is the main pain point your customers have?"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveCompanyOverview} disabled={saving}>
                {saving ? 'Saving...' : 'Save Company Overview'}
              </Button>
            </div>
          </div>
        )}

        {/* Core Values */}
        {activeView === 'values' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Core Values</h3>
            <p className="text-gray-500 dark:text-gray-400">Define 3-7 core values that guide your organization's behavior.</p>

            <div className="space-y-3">
              {coreValuesData.map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    className="input flex-1"
                    value={value}
                    onChange={(e) => {
                      const newValues = [...coreValuesData];
                      newValues[index] = e.target.value;
                      setCoreValuesData(newValues);
                    }}
                    placeholder={`Value ${index + 1}`}
                  />
                  <button
                    onClick={() => setCoreValuesData(prev => prev.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {coreValuesData.length < 7 && (
                <button
                  onClick={() => setCoreValuesData(prev => [...prev, ''])}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span className="w-8 h-8 rounded-full border-2 border-dashed border-primary-300 flex items-center justify-center">
                    +
                  </span>
                  Add Core Value
                </button>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveCoreValues} disabled={saving}>
                {saving ? 'Saving...' : 'Save Core Values'}
              </Button>
            </div>
          </div>
        )}

        {/* Brand Promise */}
        {activeView === 'brand' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Brand Promise</h3>
            <p className="text-gray-500 dark:text-gray-400">What do you promise to deliver to every customer, every time?</p>

            <div className="space-y-4">
              <div>
                <label className="label">Brand Promise Statement</label>
                <textarea
                  className="input min-h-[100px]"
                  value={brandPromiseData.promiseStatement}
                  onChange={(e) => setBrandPromiseData(prev => ({ ...prev, promiseStatement: e.target.value }))}
                  placeholder="e.g., We guarantee your project delivered on time and on budget, or we pay the difference."
                />
              </div>

              <div>
                <label className="label">Promised Outcome</label>
                <input
                  type="text"
                  className="input"
                  value={brandPromiseData.promisedOutcome}
                  onChange={(e) => setBrandPromiseData(prev => ({ ...prev, promisedOutcome: e.target.value }))}
                  placeholder="What specific outcome do you promise?"
                />
              </div>

              <div>
                <label className="label">Timeframe</label>
                <input
                  type="text"
                  className="input"
                  value={brandPromiseData.timeframe}
                  onChange={(e) => setBrandPromiseData(prev => ({ ...prev, timeframe: e.target.value }))}
                  placeholder="e.g., Within 30 days, Same day, etc."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveBrandPromise} disabled={saving}>
                {saving ? 'Saving...' : 'Save Brand Promise'}
              </Button>
            </div>
          </div>
        )}

        {/* BHAG */}
        {activeView === 'bhag' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Big Hairy Audacious Goal (BHAG)
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              A 10-25 year goal that is so ambitious it transforms your company.
            </p>

            <div className="space-y-4">
              <div>
                <label className="label">Time Horizon</label>
                <select
                  className="input"
                  value={bhagData.timeHorizon}
                  onChange={(e) => setBhagData(prev => ({ ...prev, timeHorizon: e.target.value }))}
                >
                  <option value="10 years">10 Years</option>
                  <option value="15 years">15 Years</option>
                  <option value="20 years">20 Years</option>
                  <option value="25 years">25 Years</option>
                </select>
              </div>

              <div>
                <label className="label">Revenue Goal</label>
                <input
                  type="text"
                  className="input"
                  value={bhagData.revenueGoal}
                  onChange={(e) => setBhagData(prev => ({ ...prev, revenueGoal: e.target.value }))}
                  placeholder="e.g., $100M annual revenue"
                />
              </div>

              <div>
                <label className="label">BHAG Statement</label>
                <textarea
                  className="input min-h-[150px]"
                  value={bhagData.bhagStatement}
                  onChange={(e) => setBhagData(prev => ({ ...prev, bhagStatement: e.target.value }))}
                  placeholder="Describe your transformational goal that will take 10-25 years to achieve..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveBhag} disabled={saving}>
                {saving ? 'Saving...' : 'Save BHAG'}
              </Button>
            </div>
          </div>
        )}

        {/* SWOT Analysis */}
        {activeView === 'swot' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">SWOT Analysis</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <SWOTCategory
                title="Strengths"
                icon="💪"
                color="green"
                items={swotData.strengths}
                onAdd={(item) => setSwotData(prev => ({ ...prev, strengths: [...prev.strengths, item] }))}
                onRemove={(idx) => setSwotData(prev => ({ ...prev, strengths: prev.strengths.filter((_, i) => i !== idx) }))}
              />

              <SWOTCategory
                title="Weaknesses"
                icon="⚠️"
                color="red"
                items={swotData.weaknesses}
                onAdd={(item) => setSwotData(prev => ({ ...prev, weaknesses: [...prev.weaknesses, item] }))}
                onRemove={(idx) => setSwotData(prev => ({ ...prev, weaknesses: prev.weaknesses.filter((_, i) => i !== idx) }))}
              />

              <SWOTCategory
                title="Opportunities"
                icon="🚀"
                color="blue"
                items={swotData.opportunities}
                onAdd={(item) => setSwotData(prev => ({ ...prev, opportunities: [...prev.opportunities, item] }))}
                onRemove={(idx) => setSwotData(prev => ({ ...prev, opportunities: prev.opportunities.filter((_, i) => i !== idx) }))}
              />

              <SWOTCategory
                title="Threats"
                icon="⛔"
                color="orange"
                items={swotData.threats}
                onAdd={(item) => setSwotData(prev => ({ ...prev, threats: [...prev.threats, item] }))}
                onRemove={(idx) => setSwotData(prev => ({ ...prev, threats: prev.threats.filter((_, i) => i !== idx) }))}
              />
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveSwot} disabled={saving}>
                {saving ? 'Saving...' : 'Save SWOT Analysis'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// SWOT Category Component
const SWOTCategory = ({ title, icon, color, items, onAdd, onRemove }) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  const colorClasses = {
    green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
    red: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    orange: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      </div>

      <div className="space-y-2 mb-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2">
            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item}</span>
            <button
              onClick={() => onRemove(index)}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="input flex-1 text-sm"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Add ${title.toLowerCase()}...`}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button variant="secondary" size="sm" onClick={handleAdd}>+</Button>
      </div>
    </div>
  );
};

export default VisionStrategyManager;