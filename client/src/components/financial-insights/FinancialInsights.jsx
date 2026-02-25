import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState, QuickFillGuide } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const FinancialInsights = ({ visionBoardId }) => {
  const [activeView, setActiveView] = useState('revenue');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Revenue Model
  const [revenueModel, setRevenueModel] = useState({
    revenueStreams: [],
    pricingStructure: '',
    averageDealSize: 0,
    monthlyRevenueTarget: 0,
    annualRevenueTarget: 0,
    leadRequirements: '',
    conversionAssumptions: ''
  });

  // KPI Dashboard
  const [kpiDashboard, setKpiDashboard] = useState({
    financialKpis: [],
    salesKpis: [],
    operationalKpis: [],
    customerKpis: [],
    peopleKpis: []
  });

  const quickStartSteps = ['Revenue Model', 'KPI Dashboard'];

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

      // Load Revenue Model
      if (ss.revenueModel?.data) {
        setRevenueModel({
          revenueStreams: ss.revenueModel.data.revenueStreams || [],
          pricingStructure: ss.revenueModel.data.pricingStructure || '',
          averageDealSize: ss.revenueModel.data.averageDealSize || 0,
          monthlyRevenueTarget: ss.revenueModel.data.monthlyRevenueTarget || 0,
          annualRevenueTarget: ss.revenueModel.data.annualRevenueTarget || 0,
          leadRequirements: ss.revenueModel.data.leadRequirements || '',
          conversionAssumptions: ss.revenueModel.data.conversionAssumptions || ''
        });
      }

      // Load KPI Dashboard
      if (ss.kpiDashboard?.data) {
        setKpiDashboard({
          financialKpis: ss.kpiDashboard.data.financialKpis || [],
          salesKpis: ss.kpiDashboard.data.salesKpis || [],
          operationalKpis: ss.kpiDashboard.data.operationalKpis || [],
          customerKpis: ss.kpiDashboard.data.customerKpis || [],
          peopleKpis: ss.kpiDashboard.data.peopleKpis || []
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

  const handleSaveRevenueModel = async () => {
    await saveSection('revenueModel', revenueModel);
  };

  const handleSaveKPIDashboard = async () => {
    await saveSection('kpiDashboard', kpiDashboard);
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
        currentStep={activeView === 'revenue' ? 0 : 1}
        onStepClick={(idx) => setActiveView(idx === 0 ? 'revenue' : 'kpis')}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'revenue', label: 'Revenue Model', icon: '💰' },
          { id: 'kpis', label: 'KPI Dashboard', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeView === tab.id
                ? 'bg-teal-500 text-white shadow-md'
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
        {/* Revenue Model */}
        {activeView === 'revenue' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Model & Targets</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define how your business makes money
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveRevenueModel} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Revenue Streams */}
              <div className="md:col-span-2">
                <label className="label">Revenue Streams</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {revenueModel.revenueStreams.map((stream, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-full"
                    >
                      {stream}
                      <button
                        onClick={() => setRevenueModel({
                          ...revenueModel,
                          revenueStreams: revenueModel.revenueStreams.filter((_, i) => i !== index)
                        })}
                        className="ml-1 hover:text-teal-900 dark:hover:text-teal-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Add revenue stream..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        setRevenueModel({
                          ...revenueModel,
                          revenueStreams: [...revenueModel.revenueStreams, e.target.value.trim()]
                        });
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="label">Pricing Structure</label>
                <input
                  type="text"
                  className="input"
                  value={revenueModel.pricingStructure}
                  onChange={(e) => setRevenueModel({ ...revenueModel, pricingStructure: e.target.value })}
                  placeholder="e.g., Subscription, Per-seat, Usage-based"
                />
              </div>

              <div>
                <label className="label">Average Deal Size ($)</label>
                <input
                  type="number"
                  className="input"
                  value={revenueModel.averageDealSize}
                  onChange={(e) => setRevenueModel({ ...revenueModel, averageDealSize: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 5000"
                />
              </div>

              <div>
                <label className="label">Monthly Revenue Target ($)</label>
                <input
                  type="number"
                  className="input"
                  value={revenueModel.monthlyRevenueTarget}
                  onChange={(e) => setRevenueModel({ ...revenueModel, monthlyRevenueTarget: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 50000"
                />
              </div>

              <div>
                <label className="label">Annual Revenue Target ($)</label>
                <input
                  type="number"
                  className="input"
                  value={revenueModel.annualRevenueTarget}
                  onChange={(e) => setRevenueModel({ ...revenueModel, annualRevenueTarget: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 600000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Lead Requirements</label>
                <textarea
                  className="input min-h-[80px]"
                  value={revenueModel.leadRequirements}
                  onChange={(e) => setRevenueModel({ ...revenueModel, leadRequirements: e.target.value })}
                  placeholder="How many leads do you need per month to hit targets?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Conversion Assumptions</label>
                <textarea
                  className="input min-h-[80px]"
                  value={revenueModel.conversionAssumptions}
                  onChange={(e) => setRevenueModel({ ...revenueModel, conversionAssumptions: e.target.value })}
                  placeholder="What are your conversion rate assumptions?"
                />
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Revenue Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    ${revenueModel.annualRevenueTarget.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Annual Target</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${revenueModel.monthlyRevenueTarget.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Target</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${revenueModel.averageDealSize.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Deal Size</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Dashboard */}
        {activeView === 'kpis' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">KPI Dashboard</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define key performance indicators to track
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveKPIDashboard} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Financial KPIs */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">💰 Financial KPIs</h4>
                <div className="space-y-2">
                  {kpiDashboard.financialKpis.map((kpi, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        value={kpi}
                        onChange={(e) => {
                          const updated = kpiDashboard.financialKpis.map((k, i) => i === index ? e.target.value : k);
                          setKpiDashboard({ ...kpiDashboard, financialKpis: updated });
                        }}
                      />
                      <button
                        onClick={() => setKpiDashboard({
                          ...kpiDashboard,
                          financialKpis: kpiDashboard.financialKpis.filter((_, i) => i !== index)
                        })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setKpiDashboard({
                      ...kpiDashboard,
                      financialKpis: [...kpiDashboard.financialKpis, '']
                    })}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    + Add KPI
                  </button>
                </div>
              </div>

              {/* Sales KPIs */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📈 Sales KPIs</h4>
                <div className="space-y-2">
                  {kpiDashboard.salesKpis.map((kpi, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        value={kpi}
                        onChange={(e) => {
                          const updated = kpiDashboard.salesKpis.map((k, i) => i === index ? e.target.value : k);
                          setKpiDashboard({ ...kpiDashboard, salesKpis: updated });
                        }}
                      />
                      <button
                        onClick={() => setKpiDashboard({
                          ...kpiDashboard,
                          salesKpis: kpiDashboard.salesKpis.filter((_, i) => i !== index)
                        })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setKpiDashboard({
                      ...kpiDashboard,
                      salesKpis: [...kpiDashboard.salesKpis, '']
                    })}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    + Add KPI
                  </button>
                </div>
              </div>

              {/* Operational KPIs */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">⚙️ Operational KPIs</h4>
                <div className="space-y-2">
                  {kpiDashboard.operationalKpis.map((kpi, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        value={kpi}
                        onChange={(e) => {
                          const updated = kpiDashboard.operationalKpis.map((k, i) => i === index ? e.target.value : k);
                          setKpiDashboard({ ...kpiDashboard, operationalKpis: updated });
                        }}
                      />
                      <button
                        onClick={() => setKpiDashboard({
                          ...kpiDashboard,
                          operationalKpis: kpiDashboard.operationalKpis.filter((_, i) => i !== index)
                        })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setKpiDashboard({
                      ...kpiDashboard,
                      operationalKpis: [...kpiDashboard.operationalKpis, '']
                    })}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    + Add KPI
                  </button>
                </div>
              </div>

              {/* Customer KPIs */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">👥 Customer KPIs</h4>
                <div className="space-y-2">
                  {kpiDashboard.customerKpis.map((kpi, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        value={kpi}
                        onChange={(e) => {
                          const updated = kpiDashboard.customerKpis.map((k, i) => i === index ? e.target.value : k);
                          setKpiDashboard({ ...kpiDashboard, customerKpis: updated });
                        }}
                      />
                      <button
                        onClick={() => setKpiDashboard({
                          ...kpiDashboard,
                          customerKpis: kpiDashboard.customerKpis.filter((_, i) => i !== index)
                        })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setKpiDashboard({
                      ...kpiDashboard,
                      customerKpis: [...kpiDashboard.customerKpis, '']
                    })}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    + Add KPI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;