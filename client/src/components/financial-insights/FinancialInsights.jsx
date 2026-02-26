import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState, QuickFillGuide } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const FinancialInsights = ({ visionBoardId }) => {
  const [activeView, setActiveView] = useState('fpa');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FP&A Dashboard
  const [fpaData, setFpaData] = useState({
    currentRevenue: 0,
    currentExpenses: 0,
    grossMargin: 0,
    netMargin: 0,
    cashOnHand: 0,
    monthlyBurn: 0,
    runway: 0
  });

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

  // CASh Strategies (Cash Acceleration Strategies)
  const [cashStrategies, setCashStrategies] = useState([]);

  // Forecasting
  const [forecast, setForecast] = useState({
    year1Revenue: 0,
    year2Revenue: 0,
    year3Revenue: 0,
    growthRate: 0,
    assumptions: ''
  });

  // ROI Calculator
  const [roiCalculations, setRoiCalculations] = useState([]);

  // KPI Dashboard
  const [kpiDashboard, setKpiDashboard] = useState({
    financialKpis: [],
    salesKpis: [],
    operationalKpis: [],
    customerKpis: [],
    peopleKpis: []
  });

  // AI Analysis
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const views = ['fpa', 'cash', 'forecast', 'roi', 'revenue', 'kpis', 'ai'];
  const quickStartSteps = ['FP&A Dashboard', 'CASh', 'Forecasting', 'ROI', 'Revenue', 'KPIs', 'AI Analysis'];

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

        // Load FP&A from revenue model
        setFpaData({
          currentRevenue: ss.revenueModel.data.currentRevenue || 0,
          currentExpenses: ss.revenueModel.data.currentExpenses || 0,
          grossMargin: ss.revenueModel.data.grossMargin || 0,
          netMargin: ss.revenueModel.data.netMargin || 0,
          cashOnHand: ss.revenueModel.data.cashOnHand || 0,
          monthlyBurn: ss.revenueModel.data.monthlyBurn || 0,
          runway: ss.revenueModel.data.runway || 0
        });

        // Load CASh strategies
        setCashStrategies(ss.revenueModel.data.cashStrategies || []);

        // Load forecast
        setForecast(ss.revenueModel.data.forecast || {
          year1Revenue: 0,
          year2Revenue: 0,
          year3Revenue: 0,
          growthRate: 0,
          assumptions: ''
        });

        // Load ROI calculations
        setRoiCalculations(ss.revenueModel.data.roiCalculations || []);
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
    await saveSection('revenueModel', {
      ...revenueModel,
      ...fpaData,
      cashStrategies,
      forecast,
      roiCalculations
    });
  };

  const handleSaveKPIDashboard = async () => {
    await saveSection('kpiDashboard', kpiDashboard);
  };

  const handleRunAIAnalysis = () => {
    setAiLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = `
## Financial Health Analysis

**Strengths:**
- Revenue target of $${revenueModel.annualRevenueTarget?.toLocaleString() || 0} shows ambitious growth
- Average deal size of $${revenueModel.averageDealSize?.toLocaleString() || 0} indicates healthy unit economics

**Recommendations:**
1. **Cash Flow:** Focus on reducing DSO (Days Sales Outstanding) to improve cash conversion
2. **Pricing:** Consider value-based pricing to increase margins
3. **Forecasting:** Build 13-week cash flow forecast for better visibility

**Key Metrics to Watch:**
- Gross Margin: Target 60%+ for SaaS businesses
- LTV/CAC Ratio: Aim for 3:1 or higher
- Monthly Recurring Revenue (MRR) growth rate
      `;
      setAiAnalysis(analysis);
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
      {/* Quick Start Guide */}
      <QuickFillGuide
        steps={quickStartSteps}
        currentStep={views.indexOf(activeView)}
        onStepClick={(idx) => setActiveView(views[idx])}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'fpa', label: 'FP&A Dashboard', icon: '📈' },
          { id: 'cash', label: 'CASh Strategies', icon: '💵' },
          { id: 'forecast', label: 'Forecasting', icon: '🔮' },
          { id: 'roi', label: 'ROI Calculator', icon: '🧮' },
          { id: 'revenue', label: 'Revenue Model', icon: '💰' },
          { id: 'kpis', label: 'KPI Dashboard', icon: '📊' },
          { id: 'ai', label: 'AI Analysis', icon: '🤖' }
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
        {/* FP&A Dashboard */}
        {activeView === 'fpa' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">FP&A Dashboard</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Financial Planning & Analysis - Your financial health at a glance
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveRevenueModel} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Monthly Revenue', key: 'currentRevenue', prefix: '$', color: 'green' },
                { label: 'Monthly Expenses', key: 'currentExpenses', prefix: '$', color: 'red' },
                { label: 'Gross Margin', key: 'grossMargin', suffix: '%', color: 'blue' },
                { label: 'Net Margin', key: 'netMargin', suffix: '%', color: 'purple' },
                { label: 'Cash on Hand', key: 'cashOnHand', prefix: '$', color: 'teal' },
                { label: 'Monthly Burn', key: 'monthlyBurn', prefix: '$', color: 'orange' },
                { label: 'Runway (months)', key: 'runway', suffix: ' mo', color: 'indigo' },
              ].map((item) => (
                <div key={item.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <label className="text-xs text-gray-500 dark:text-gray-400">{item.label}</label>
                  <div className="flex items-center gap-1 mt-1">
                    {item.prefix && <span className="text-gray-500">{item.prefix}</span>}
                    <input
                      type="number"
                      className="input text-lg font-bold flex-1"
                      value={fpaData[item.key] || 0}
                      onChange={(e) => setFpaData({ ...fpaData, [item.key]: parseFloat(e.target.value) || 0 })}
                    />
                    {item.suffix && <span className="text-gray-500">{item.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASh Strategies */}
        {activeView === 'cash' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">CASh Strategies</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cash Acceleration Strategies to improve your cash flow
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveRevenueModel} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="space-y-3">
              {cashStrategies.map((strategy, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    className="input flex-1"
                    value={strategy.name || strategy}
                    onChange={(e) => {
                      const updated = cashStrategies.map((s, i) => i === index ? { name: e.target.value, impact: s.impact || '' } : s);
                      setCashStrategies(updated);
                    }}
                    placeholder="Strategy name..."
                  />
                  <select
                    className="input w-32"
                    value={strategy.impact || 'Medium'}
                    onChange={(e) => {
                      const updated = cashStrategies.map((s, i) => i === index ? { ...s, impact: e.target.value } : s);
                      setCashStrategies(updated);
                    }}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <button onClick={() => setCashStrategies(cashStrategies.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              ))}
              <button
                onClick={() => setCashStrategies([...cashStrategies, { name: '', impact: 'Medium' }])}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                <span className="w-8 h-8 rounded-full border-2 border-dashed border-teal-300 flex items-center justify-center">+</span>
                Add Strategy
              </button>
            </div>
          </div>
        )}

        {/* Forecasting */}
        {activeView === 'forecast' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Forecasting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Project your revenue growth over the next 3 years
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveRevenueModel} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Year 1 Revenue', key: 'year1Revenue' },
                { label: 'Year 2 Revenue', key: 'year2Revenue' },
                { label: 'Year 3 Revenue', key: 'year3Revenue' },
              ].map((item) => (
                <div key={item.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <label className="text-xs text-gray-500 dark:text-gray-400">{item.label}</label>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      className="input text-lg font-bold flex-1"
                      value={forecast[item.key] || 0}
                      onChange={(e) => setForecast({ ...forecast, [item.key]: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label className="text-xs text-gray-500 dark:text-gray-400">Growth Rate & Assumptions</label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="input w-20"
                    value={forecast.growthRate || 0}
                    onChange={(e) => setForecast({ ...forecast, growthRate: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-gray-500">% YoY Growth</span>
                </div>
              </div>
              <textarea
                className="input mt-2 min-h-[80px]"
                value={forecast.assumptions}
                onChange={(e) => setForecast({ ...forecast, assumptions: e.target.value })}
                placeholder="Key assumptions behind your forecast..."
              />
            </div>
          </div>
        )}

        {/* ROI Calculator */}
        {activeView === 'roi' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">ROI Calculator</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Calculate return on investment for initiatives
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveRevenueModel} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="space-y-3">
              {roiCalculations.map((calc, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <input
                      type="text"
                      className="input flex-1 font-medium"
                      value={calc.name}
                      onChange={(e) => {
                        const updated = roiCalculations.map((c, i) => i === index ? { ...c, name: e.target.value } : c);
                        setRoiCalculations(updated);
                      }}
                      placeholder="Initiative name..."
                    />
                    <button onClick={() => setRoiCalculations(roiCalculations.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500">✕</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Investment ($)</label>
                      <input type="number" className="input" value={calc.investment || 0} onChange={(e) => {
                        const updated = roiCalculations.map((c, i) => i === index ? { ...c, investment: parseFloat(e.target.value) || 0 } : c);
                        setRoiCalculations(updated);
                      }} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Expected Return ($)</label>
                      <input type="number" className="input" value={calc.return || 0} onChange={(e) => {
                        const updated = roiCalculations.map((c, i) => i === index ? { ...c, return: parseFloat(e.target.value) || 0 } : c);
                        setRoiCalculations(updated);
                      }} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Timeframe (months)</label>
                      <input type="number" className="input" value={calc.timeframe || 12} onChange={(e) => {
                        const updated = roiCalculations.map((c, i) => i === index ? { ...c, timeframe: parseInt(e.target.value) || 12 } : c);
                        setRoiCalculations(updated);
                      }} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">ROI</label>
                      <div className="input bg-gray-100 dark:bg-gray-600 font-bold text-center">
                        {calc.investment > 0 ? Math.round(((calc.return || 0) - calc.investment) / calc.investment * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setRoiCalculations([...roiCalculations, { name: '', investment: 0, return: 0, timeframe: 12 }])}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                <span className="w-8 h-8 rounded-full border-2 border-dashed border-teal-300 flex items-center justify-center">+</span>
                Add Initiative
              </button>
            </div>
          </div>
        )}

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
              <div className="md:col-span-2">
                <label className="label">Revenue Streams</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {revenueModel.revenueStreams.map((stream, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-full">
                      {stream}
                      <button onClick={() => setRevenueModel({
                        ...revenueModel,
                        revenueStreams: revenueModel.revenueStreams.filter((_, i) => i !== index)
                      })} className="ml-1 hover:text-teal-900 dark:hover:text-teal-100">×</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="input"
                  placeholder="Add revenue stream (press Enter)..."
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

              <div>
                <label className="label">Pricing Structure</label>
                <input
                  type="text"
                  className="input"
                  value={revenueModel.pricingStructure}
                  onChange={(e) => setRevenueModel({ ...revenueModel, pricingStructure: e.target.value })}
                  placeholder="e.g., Tiered SaaS, Usage-based..."
                />
              </div>

              <div>
                <label className="label">Average Deal Size ($)</label>
                <input
                  type="number"
                  className="input"
                  value={revenueModel.averageDealSize}
                  onChange={(e) => setRevenueModel({ ...revenueModel, averageDealSize: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="label">Monthly Revenue Target ($)</label>
                <input
                  type="number"
                  className="input"
                  value={revenueModel.monthlyRevenueTarget}
                  onChange={(e) => setRevenueModel({ ...revenueModel, monthlyRevenueTarget: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="label">Annual Revenue Target ($)</label>
                <input
                  type="number"
                  className="input"
                  value={revenueModel.annualRevenueTarget}
                  onChange={(e) => setRevenueModel({ ...revenueModel, annualRevenueTarget: parseFloat(e.target.value) || 0 })}
                />
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
                  Track key performance indicators across all areas
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveKPIDashboard} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { key: 'financialKpis', label: 'Financial KPIs', icon: '💰', color: 'green' },
                { key: 'salesKpis', label: 'Sales KPIs', icon: '📈', color: 'blue' },
                { key: 'operationalKpis', label: 'Operational KPIs', icon: '⚙️', color: 'purple' },
                { key: 'customerKpis', label: 'Customer KPIs', icon: '👥', color: 'yellow' },
                { key: 'peopleKpis', label: 'People KPIs', icon: '🤝', color: 'pink' }
              ].map((category) => (
                <div key={category.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span>{category.icon}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{category.label}</h4>
                  </div>
                  <div className="space-y-2">
                    {(kpiDashboard[category.key] || []).map((kpi, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="input flex-1 text-sm"
                          value={kpi}
                          onChange={(e) => {
                            const updated = kpiDashboard[category.key].map((k, i) => i === index ? e.target.value : k);
                            setKpiDashboard({ ...kpiDashboard, [category.key]: updated });
                          }}
                        />
                        <button
                          onClick={() => setKpiDashboard({
                            ...kpiDashboard,
                            [category.key]: kpiDashboard[category.key].filter((_, i) => i !== index)
                          })}
                          className="text-gray-400 hover:text-red-500"
                        >✕</button>
                      </div>
                    ))}
                    <button
                      onClick={() => setKpiDashboard({
                        ...kpiDashboard,
                        [category.key]: [...(kpiDashboard[category.key] || []), '']
                      })}
                      className={`text-sm text-${category.color}-600 hover:text-${category.color}-700`}
                    >
                      + Add KPI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {activeView === 'ai' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Financial Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get AI-powered insights on your financial health
                </p>
              </div>
              <Button variant="primary" onClick={handleRunAIAnalysis} disabled={aiLoading}>
                {aiLoading ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            </div>

            {aiAnalysis ? (
              <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className="whitespace-pre-wrap text-sm">{aiAnalysis}</div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-4xl mb-4 block">🤖</span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Click "Run Analysis" to get AI-powered financial insights
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Analysis will review your revenue model, cash flow, and KPIs
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;