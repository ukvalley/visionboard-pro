import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import strategySheetService from '../../services/strategySheetService';

// Section definitions
const SECTIONS = [
  { id: 'companyOverview', name: 'Company Overview', icon: '🏢' },
  { id: 'corePurpose', name: 'Core Purpose', icon: '🎯' },
  { id: 'vision', name: 'Vision', icon: '🔭' },
  { id: 'mission', name: 'Mission', icon: '📍' },
  { id: 'brandPromise', name: 'Brand Promise', icon: '💎' },
  { id: 'coreValues', name: 'Core Values', icon: '⚖️' },
  { id: 'bhag', name: 'BHAG', icon: '🚀' },
  { id: 'vividDescription', name: 'Vivid Description', icon: '🎨' },
  { id: 'swotAnalysis', name: 'SWOT Analysis', icon: '📊' },
  { id: 'strategicPriorities', name: 'Strategic Priorities', icon: '🎯' },
  { id: 'threeYearStrategy', name: '3-Year Strategy', icon: '📅' },
  { id: 'smartGoals', name: 'SMART Goals', icon: '✅' },
  { id: 'quarterlyPlan', name: 'Quarterly Plan', icon: '📆' },
  { id: 'revenueModel', name: 'Revenue Model', icon: '💰' },
  { id: 'organizationalStructure', name: 'Org Structure', icon: '👥' },
  { id: 'sopRoadmap', name: 'SOP Roadmap', icon: '📋' },
  { id: 'automationSystems', name: 'Automation & Systems', icon: '⚙️' },
  { id: 'kpiDashboard', name: 'KPI Dashboard', icon: '📈' },
  { id: 'riskManagement', name: 'Risk Management', icon: '🛡️' },
  { id: 'strategySummary', name: 'Strategy Summary', icon: '📝' }
];

const StrategySheetManager = () => {
  const { id } = useParams();
  const [strategySheet, setStrategySheet] = useState({});
  const [progress, setProgress] = useState({ overallProgress: 0, sections: [] });
  const [activeSection, setActiveSection] = useState('companyOverview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [sheetRes, progressRes] = await Promise.all([
        strategySheetService.getStrategySheet(id),
        strategySheetService.getProgress(id)
      ]);
      setStrategySheet(sheetRes.data || {});
      setProgress(progressRes.data || { overallProgress: 0, sections: [] });
    } catch (error) {
      console.error('Failed to fetch strategy sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (sectionId, data) => {
    setSaving(true);
    try {
      const response = await strategySheetService.updateSection(id, sectionId, {
        completed: true,
        data
      });
      setStrategySheet(response.data.strategySheet || {});
      await fetchData(); // Refresh progress
    } catch (error) {
      console.error('Failed to save section:', error);
      alert('Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  const currentSectionData = strategySheet[activeSection]?.data || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Sidebar Navigation */}
      <div className="w-72 flex-shrink-0">
        <Card className="h-full overflow-hidden flex flex-col" padding={false}>
          {/* Progress Header */}
          <div className="p-4 bg-gradient-to-r from-primary-600 to-indigo-700">
            <h3 className="text-white font-bold text-lg mb-2">Strategy Sheet</h3>
            <ProgressBar
              value={progress.overallProgress}
              showLabel={false}
              size="sm"
            />
            <p className="text-white/80 text-sm mt-2">
              {progress.overallProgress}% Complete
            </p>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-2">
            {SECTIONS.map((section, index) => {
              const isCompleted = strategySheet[section.id]?.completed;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all mb-1 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="flex-1 text-sm font-medium truncate">
                    {index + 1}. {section.name}
                  </span>
                  {isCompleted && (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderSection(activeSection, currentSectionData, handleSaveSection, saving)}
      </div>
    </div>
  );
};

// Render the appropriate section form
const renderSection = (sectionId, data, onSave, saving) => {
  const sectionProps = { data, onSave, saving };

  switch (sectionId) {
    case 'companyOverview':
      return <CompanyOverviewSection {...sectionProps} />;
    case 'corePurpose':
      return <CorePurposeSection {...sectionProps} />;
    case 'vision':
      return <VisionSection {...sectionProps} />;
    case 'mission':
      return <MissionSection {...sectionProps} />;
    case 'brandPromise':
      return <BrandPromiseSection {...sectionProps} />;
    case 'coreValues':
      return <CoreValuesSection {...sectionProps} />;
    case 'bhag':
      return <BHAGSection {...sectionProps} />;
    case 'vividDescription':
      return <VividDescriptionSection {...sectionProps} />;
    case 'swotAnalysis':
      return <SWOTAnalysisSection {...sectionProps} />;
    case 'strategicPriorities':
      return <StrategicPrioritiesSection {...sectionProps} />;
    case 'threeYearStrategy':
      return <ThreeYearStrategySection {...sectionProps} />;
    case 'smartGoals':
      return <SmartGoalsSection {...sectionProps} />;
    case 'quarterlyPlan':
      return <QuarterlyPlanSection {...sectionProps} />;
    case 'revenueModel':
      return <RevenueModelSection {...sectionProps} />;
    case 'organizationalStructure':
      return <OrganizationalStructureSection {...sectionProps} />;
    case 'sopRoadmap':
      return <SOPRoadmapSection {...sectionProps} />;
    case 'automationSystems':
      return <AutomationSystemsSection {...sectionProps} />;
    case 'kpiDashboard':
      return <KPIDashboardSection {...sectionProps} />;
    case 'riskManagement':
      return <RiskManagementSection {...sectionProps} />;
    case 'strategySummary':
      return <StrategySummarySection {...sectionProps} />;
    default:
      return null;
  }
};

// ============================================
// SECTION COMPONENTS
// ============================================

// Generic form components
const FormInput = ({ label, value, onChange, placeholder, type = 'text', helperText }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white min-h-[100px]"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);

const FormSelect = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <select
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const SectionWrapper = ({ title, description, icon, children, onSave, saving }) => (
  <Card>
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
    </div>

    <div className="space-y-6">
      {children}
    </div>

    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
      <Button variant="primary" onClick={onSave} loading={saving}>
        Save Section
      </Button>
    </div>
  </Card>
);

// Section 1: Company Overview
const CompanyOverviewSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNested = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev[parent] || {}), [field]: value }
    }));
  };

  const handleSave = () => {
    onSave('companyOverview', formData);
  };

  return (
    <SectionWrapper
      title="Company Overview"
      description="Define your company's fundamental identity and positioning"
      icon="🏢"
      onSave={handleSave}
      saving={saving}
    >
      <FormInput
        label="Company Name"
        value={formData.companyName}
        onChange={(v) => updateField('companyName', v)}
        placeholder="Your company's brand or legal name"
        helperText="Write the final brand or legal name. Avoid temporary names."
      />

      <FormInput
        label="Industry / Category"
        value={formData.industry}
        onChange={(v) => updateField('industry', v)}
        placeholder="e.g., B2B SaaS, E-commerce, Consulting"
        helperText="Be specific. Narrow categories create clarity."
      />

      <FormInput
        label="Core Offering"
        value={formData.coreOffering}
        onChange={(v) => updateField('coreOffering', v)}
        placeholder="What you actually sell in simple words"
        type="textarea"
      />

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Target Customer Profile</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Who Buys?"
            value={formData.targetCustomerProfile?.whoBuys}
            onChange={(v) => updateNested('targetCustomerProfile', 'whoBuys', v)}
            placeholder="Role/designation of buyers"
          />
          <FormInput
            label="Company Size"
            value={formData.targetCustomerProfile?.companySize}
            onChange={(v) => updateNested('targetCustomerProfile', 'companySize', v)}
            placeholder="e.g., 10-50, 50-200, Enterprise"
          />
          <FormInput
            label="Industry Type"
            value={formData.targetCustomerProfile?.industryType}
            onChange={(v) => updateNested('targetCustomerProfile', 'industryType', v)}
            placeholder="Target industry sectors"
          />
          <FormInput
            label="Geography"
            value={formData.targetCustomerProfile?.geography}
            onChange={(v) => updateNested('targetCustomerProfile', 'geography', v)}
            placeholder="e.g., North America, Global"
          />
        </div>
      </div>

      <FormInput
        label="Primary Problem You Solve"
        value={formData.primaryProblem}
        onChange={(v) => updateField('primaryProblem', v)}
        placeholder="Describe the pain in practical terms—time loss, money loss, risk, confusion, inefficiency."
        type="textarea"
      />

      <FormSelect
        label="Current Business Stage"
        value={formData.businessStage}
        onChange={(v) => updateField('businessStage', v)}
        options={[
          { value: 'Idea', label: 'Idea' },
          { value: 'Validation', label: 'Validation' },
          { value: 'Early Revenue', label: 'Early Revenue' },
          { value: 'Scaling', label: 'Scaling' }
        ]}
      />

      <FormInput
        label="Unique Differentiation"
        value={formData.uniqueDifferentiation}
        onChange={(v) => updateField('uniqueDifferentiation', v)}
        placeholder="Why someone should choose you over existing alternatives. Be honest."
        type="textarea"
      />

      <FormInput
        label="Business Model"
        value={formData.businessModel}
        onChange={(v) => updateField('businessModel', v)}
        placeholder="e.g., Subscription, Project-based, Licensing, Hybrid"
        helperText="How money comes in"
      />
    </SectionWrapper>
  );
};

// Section 2: Core Purpose
const CorePurposeSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {});

  const handleSave = () => {
    onSave('corePurpose', formData);
  };

  return (
    <SectionWrapper
      title="Core Purpose"
      description="Why this business exists beyond profit"
      icon="🎯"
      onSave={handleSave}
      saving={saving}
    >
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Guiding Questions</h4>
        <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>• What broken situation are we trying to fix?</li>
          <li>• Who benefits most if we succeed?</li>
        </ul>
      </div>

      <FormInput
        label="What broken situation are we trying to fix?"
        value={formData.brokenSituation}
        onChange={(v) => setFormData(prev => ({ ...prev, brokenSituation: v }))}
        placeholder="Describe the problem you're addressing..."
        type="textarea"
      />

      <FormInput
        label="Who benefits most if we succeed?"
        value={formData.whoBenefits}
        onChange={(v) => setFormData(prev => ({ ...prev, whoBenefits: v }))}
        placeholder="Describe who gains the most from your success..."
        type="textarea"
      />

      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
        <FormInput
          label="Core Purpose Statement (1 sentence)"
          value={formData.purposeStatement}
          onChange={(v) => setFormData(prev => ({ ...prev, purposeStatement: v }))}
          placeholder="Why this business exists beyond profit."
          helperText="Keep it clear, concise, and memorable"
        />
      </div>
    </SectionWrapper>
  );
};

// Section 3: Vision
const VisionSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {});

  const handleSave = () => {
    onSave('vision', formData);
  };

  return (
    <SectionWrapper
      title="Vision (Long-Term Direction)"
      description="Time Horizon: 10+ years"
      icon="🔭"
      onSave={handleSave}
      saving={saving}
    >
      <FormInput
        label="Desired Market Position"
        value={formData.desiredMarketPosition}
        onChange={(v) => setFormData(prev => ({ ...prev, desiredMarketPosition: v }))}
        placeholder="Where do you want to be in the market?"
        type="textarea"
      />

      <FormInput
        label="Scale (Revenue/Customers/Geography)"
        value={formData.scale}
        onChange={(v) => setFormData(prev => ({ ...prev, scale: v }))}
        placeholder="e.g., $100M ARR, 10,000 customers, Global presence"
      />

      <FormInput
        label="Type of Impact Created"
        value={formData.impactType}
        onChange={(v) => setFormData(prev => ({ ...prev, impactType: v }))}
        placeholder="What positive change will you create?"
        type="textarea"
      />

      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-lg p-4">
        <FormInput
          label="Vision Statement"
          value={formData.visionStatement}
          onChange={(v) => setFormData(prev => ({ ...prev, visionStatement: v }))}
          placeholder="Aspirational but believable future state..."
          type="textarea"
          helperText="This should inspire and guide long-term decisions"
        />
      </div>
    </SectionWrapper>
  );
};

// Section 4: Mission
const MissionSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {});

  const handleSave = () => {
    onSave('mission', formData);
  };

  return (
    <SectionWrapper
      title="Mission"
      description="How the vision is achieved"
      icon="📍"
      onSave={handleSave}
      saving={saving}
    >
      <FormInput
        label="What you do daily"
        value={formData.dailyActions}
        onChange={(v) => setFormData(prev => ({ ...prev, dailyActions: v }))}
        placeholder="Your day-to-day activities and focus"
        type="textarea"
      />

      <FormInput
        label="How you deliver value"
        value={formData.valueDelivery}
        onChange={(v) => setFormData(prev => ({ ...prev, valueDelivery: v }))}
        placeholder="Your value delivery mechanism"
        type="textarea"
      />

      <FormInput
        label="Who you focus on first"
        value={formData.primaryFocus}
        onChange={(v) => setFormData(prev => ({ ...prev, primaryFocus: v }))}
        placeholder="Your primary customer segment"
      />

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <FormInput
          label="Mission Statement"
          value={formData.missionStatement}
          onChange={(v) => setFormData(prev => ({ ...prev, missionStatement: v }))}
          placeholder="Execution-focused and action-oriented..."
          type="textarea"
          helperText="Should be clear enough to guide daily decisions"
        />
      </div>
    </SectionWrapper>
  );
};

// Section 5: Brand Promise
const BrandPromiseSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {});

  const handleSave = () => {
    onSave('brandPromise', formData);
  };

  return (
    <SectionWrapper
      title="Brand Promise"
      description="What customers can expect from you"
      icon="💎"
      onSave={handleSave}
      saving={saving}
    >
      <FormInput
        label="What You Promise"
        value={formData.promisedOutcome}
        onChange={(v) => setFormData(prev => ({ ...prev, promisedOutcome: v }))}
        placeholder="Outcome or result the customer can expect"
        type="textarea"
      />

      <FormInput
        label="Timeframe / Scope"
        value={formData.timeframe}
        onChange={(v) => setFormData(prev => ({ ...prev, timeframe: v }))}
        placeholder="How fast or under what conditions"
      />

      <FormInput
        label="Risk Reduction"
        value={formData.riskReduction}
        onChange={(v) => setFormData(prev => ({ ...prev, riskReduction: v }))}
        placeholder="Guarantees, clarity, support, predictability"
        type="textarea"
      />

      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <FormInput
          label="Brand Promise Statement"
          value={formData.promiseStatement}
          onChange={(v) => setFormData(prev => ({ ...prev, promiseStatement: v }))}
          placeholder="Short, bold, and outcome-based..."
          type="textarea"
        />
      </div>
    </SectionWrapper>
  );
};

// Section 6: Core Values
const CoreValuesSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { values: [] });

  const addValue = () => {
    setFormData(prev => ({
      ...prev,
      values: [...(prev.values || []), { value: '', behavior: '' }]
    }));
  };

  const updateValue = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const removeValue = (index) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave('coreValues', formData);
  };

  return (
    <SectionWrapper
      title="Core Values"
      description="Values must drive decisions and behavior"
      icon="⚖️"
      onSave={handleSave}
      saving={saving}
    >
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-orange-700 dark:text-orange-400">
          Values must drive decisions and behavior. If a value does not change actions, remove it.
        </p>
      </div>

      <div className="space-y-4">
        {(formData.values || []).map((item, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                {index + 1}
              </span>
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Core Value"
                  value={item.value}
                  onChange={(v) => updateValue(index, 'value', v)}
                  placeholder="e.g., Integrity"
                />
                <FormInput
                  label="What This Means in Daily Behavior"
                  value={item.behavior}
                  onChange={(v) => updateValue(index, 'behavior', v)}
                  placeholder="How this value guides actions"
                />
              </div>
              <button
                onClick={() => removeValue(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addValue} className="w-full">
          + Add Core Value
        </Button>
      </div>
    </SectionWrapper>
  );
};

// Section 7: BHAG
const BHAGSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {});

  const handleSave = () => {
    onSave('bhag', formData);
  };

  return (
    <SectionWrapper
      title="BHAG (Big Hairy Audacious Goal)"
      description="Time Horizon: 10 years"
      icon="🚀"
      onSave={handleSave}
      saving={saving}
    >
      <FormInput
        label="Revenue Goal"
        value={formData.revenueGoal}
        onChange={(v) => setFormData(prev => ({ ...prev, revenueGoal: v }))}
        placeholder="e.g., $100M ARR"
      />

      <FormInput
        label="Customer Scale"
        value={formData.customerScale}
        onChange={(v) => setFormData(prev => ({ ...prev, customerScale: v }))}
        placeholder="e.g., 100,000 customers"
      />

      <FormInput
        label="Market Position"
        value={formData.marketPosition}
        onChange={(v) => setFormData(prev => ({ ...prev, marketPosition: v }))}
        placeholder="e.g., #1 in North America"
      />

      <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg p-4">
        <FormInput
          label="BHAG Statement"
          value={formData.bhagStatement}
          onChange={(v) => setFormData(prev => ({ ...prev, bhagStatement: v }))}
          placeholder="One bold, measurable long-term goal..."
          type="textarea"
          helperText="This should be ambitious but achievable with focused effort"
        />
      </div>
    </SectionWrapper>
  );
};

// Section 8: Vivid Description
const VividDescriptionSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { additionalPoints: [] });

  const handleSave = () => {
    onSave('vividDescription', formData);
  };

  const addPoint = () => {
    setFormData(prev => ({
      ...prev,
      additionalPoints: [...(prev.additionalPoints || []), '']
    }));
  };

  const updatePoint = (index, value) => {
    setFormData(prev => ({
      ...prev,
      additionalPoints: prev.additionalPoints.map((p, i) => i === index ? value : p)
    }));
  };

  const removePoint = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalPoints: prev.additionalPoints.filter((_, i) => i !== index)
    }));
  };

  return (
    <SectionWrapper
      title="Vivid Description"
      description="What the company looks like when the BHAG is achieved"
      icon="🎨"
      onSave={handleSave}
      saving={saving}
    >
      <FormInput
        label="How customers experience the business"
        value={formData.customerExperience}
        onChange={(v) => setFormData(prev => ({ ...prev, customerExperience: v }))}
        type="textarea"
      />

      <FormInput
        label="How teams work internally"
        value={formData.internalOperations}
        onChange={(v) => setFormData(prev => ({ ...prev, internalOperations: v }))}
        type="textarea"
      />

      <FormInput
        label="How systems and processes run"
        value={formData.systemsProcesses}
        onChange={(v) => setFormData(prev => ({ ...prev, systemsProcesses: v }))}
        type="textarea"
      />

      <FormInput
        label="How decisions are made"
        value={formData.decisionMaking}
        onChange={(v) => setFormData(prev => ({ ...prev, decisionMaking: v }))}
        type="textarea"
      />

      <FormInput
        label="How the market perceives the company"
        value={formData.marketPerception}
        onChange={(v) => setFormData(prev => ({ ...prev, marketPerception: v }))}
        type="textarea"
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Additional Points
        </label>
        {(formData.additionalPoints || []).map((point, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              value={point}
              onChange={(e) => updatePoint(index, e.target.value)}
              placeholder="Additional vivid description point..."
            />
            <button
              onClick={() => removePoint(index)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              ×
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addPoint}>
          + Add Point
        </Button>
      </div>
    </SectionWrapper>
  );
};

// Section 9: SWOT Analysis
const SWOTAnalysisSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });

  const addItem = (category) => {
    setFormData(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), '']
    }));
  };

  const updateItem = (category, index, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => i === index ? value : item)
    }));
  };

  const removeItem = (category, index) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave('swotAnalysis', formData);
  };

  const categories = [
    { key: 'strengths', label: 'Strengths (Internal)', color: 'green', placeholder: 'Internal positive factor...' },
    { key: 'weaknesses', label: 'Weaknesses (Internal)', color: 'red', placeholder: 'Internal negative factor...' },
    { key: 'opportunities', label: 'Opportunities (External)', color: 'blue', placeholder: 'External positive factor...' },
    { key: 'threats', label: 'Threats (External)', color: 'orange', placeholder: 'External negative factor...' }
  ];

  return (
    <SectionWrapper
      title="SWOT Analysis"
      description="Be factual and brutally honest. Avoid marketing language."
      icon="📊"
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map(({ key, label, color, placeholder }) => (
          <div key={key} className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-lg p-4`}>
            <h4 className={`font-semibold text-${color}-700 dark:text-${color}-400 mb-3`}>{label}</h4>
            <div className="space-y-2">
              {(formData[key] || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className={`flex-1 px-3 py-2 border border-${color}-200 dark:border-${color}-800 rounded-lg dark:bg-gray-800 dark:text-white text-sm`}
                    value={item}
                    onChange={(e) => updateItem(key, index, e.target.value)}
                    placeholder={placeholder}
                  />
                  <button
                    onClick={() => removeItem(key, index)}
                    className="text-gray-400 hover:text-red-500 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem(key)}
                className={`text-sm text-${color}-600 hover:text-${color}-700`}
              >
                + Add {key.slice(0, -1)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

// Section 10: Strategic Priorities
const StrategicPrioritiesSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { priorities: [] });

  const addPriority = () => {
    setFormData(prev => ({
      ...prev,
      priorities: [...(prev.priorities || []), { name: '', whyItMatters: '', capabilitiesRequired: '', successLooksLike: '' }]
    }));
  };

  const updatePriority = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const removePriority = (index) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave('strategicPriorities', formData);
  };

  return (
    <SectionWrapper
      title="Strategic Priorities (Next 3 Years)"
      description="Choose only the most critical priorities. Too many priorities kill execution."
      icon="🎯"
      onSave={handleSave}
      saving={saving}
    >
      <div className="space-y-6">
        {(formData.priorities || []).map((priority, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-primary-500">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Priority #{index + 1}</h4>
              <button onClick={() => removePriority(index)} className="text-red-500 hover:text-red-700">Remove</button>
            </div>
            <div className="space-y-4">
              <FormInput
                label="Priority Name"
                value={priority.name}
                onChange={(v) => updatePriority(index, 'name', v)}
                placeholder="e.g., Expand to Enterprise Market"
              />
              <FormInput
                label="Why It Matters"
                value={priority.whyItMatters}
                onChange={(v) => updatePriority(index, 'whyItMatters', v)}
                placeholder="Direct connection to growth or survival"
                type="textarea"
              />
              <FormInput
                label="Capabilities Required"
                value={priority.capabilitiesRequired}
                onChange={(v) => updatePriority(index, 'capabilitiesRequired', v)}
                placeholder="People, systems, skills, tools"
                type="textarea"
              />
              <FormInput
                label="What Success Looks Like"
                value={priority.successLooksLike}
                onChange={(v) => updatePriority(index, 'successLooksLike', v)}
                placeholder="Measurable outcome"
                type="textarea"
              />
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addPriority} className="w-full">
          + Add Strategic Priority
        </Button>
      </div>
    </SectionWrapper>
  );
};

// Section 11: 3-Year Strategy Map
const ThreeYearStrategySection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {
    year1: { objectives: [], initiatives: [], outcomes: [] },
    year2: { objectives: [], initiatives: [], outcomes: [] },
    year3: { objectives: [], initiatives: [], outcomes: [] }
  });

  const updateYear = (year, field, value) => {
    setFormData(prev => ({
      ...prev,
      [year]: { ...prev[year], [field]: value }
    }));
  };

  const addArrayItem = (year, field) => {
    setFormData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [field]: [...(prev[year]?.[field] || []), '']
      }
    }));
  };

  const updateArrayItem = (year, field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [field]: prev[year][field].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const handleSave = () => {
    onSave('threeYearStrategy', formData);
  };

  const years = [
    { key: 'year1', label: 'Year 1 – Foundation', color: 'blue' },
    { key: 'year2', label: 'Year 2 – Scale', color: 'green' },
    { key: 'year3', label: 'Year 3 – Optimization / Leadership', color: 'purple' }
  ];

  return (
    <SectionWrapper
      title="3-Year Strategy Map"
      description="Your roadmap for the next three years"
      icon="📅"
      onSave={handleSave}
      saving={saving}
    >
      <div className="space-y-8">
        {years.map(({ key, label, color }) => (
          <div key={key} className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-lg p-6`}>
            <h4 className={`text-lg font-bold text-${color}-700 dark:text-${color}-400 mb-4`}>{label}</h4>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Objectives</label>
                {(formData[key]?.objectives || []).map((item, i) => (
                  <input
                    key={i}
                    className="w-full px-3 py-2 mb-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm"
                    value={item}
                    onChange={(e) => updateArrayItem(key, 'objectives', i, e.target.value)}
                    placeholder="Objective..."
                  />
                ))}
                <button onClick={() => addArrayItem(key, 'objectives')} className="text-sm text-primary-600">+ Add</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Key Initiatives</label>
                {(formData[key]?.initiatives || []).map((item, i) => (
                  <input
                    key={i}
                    className="w-full px-3 py-2 mb-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm"
                    value={item}
                    onChange={(e) => updateArrayItem(key, 'initiatives', i, e.target.value)}
                    placeholder="Initiative..."
                  />
                ))}
                <button onClick={() => addArrayItem(key, 'initiatives')} className="text-sm text-primary-600">+ Add</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Measurable Outcomes</label>
                {(formData[key]?.outcomes || []).map((item, i) => (
                  <input
                    key={i}
                    className="w-full px-3 py-2 mb-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm"
                    value={item}
                    onChange={(e) => updateArrayItem(key, 'outcomes', i, e.target.value)}
                    placeholder="Outcome..."
                  />
                ))}
                <button onClick={() => addArrayItem(key, 'outcomes')} className="text-sm text-primary-600">+ Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

// Section 12: SMART Goals
const SmartGoalsSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { goals: [] });

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...(prev.goals || []), { goal: '', metric: '', target: '', deadline: '', owner: '' }]
    }));
  };

  const updateGoal = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((g, i) => i === index ? { ...g, [field]: value } : g)
    }));
  };

  const removeGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave('smartGoals', formData);
  };

  return (
    <SectionWrapper
      title="1-Year SMART Goals"
      description="Minimum 10 goals. Each must be measurable and time-bound."
      icon="✅"
      onSave={handleSave}
      saving={saving}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-2 font-medium text-gray-500">Goal</th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">Metric</th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">Target</th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">Deadline</th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">Owner</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {(formData.goals || []).map((goal, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-1">
                  <input className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={goal.goal} onChange={(e) => updateGoal(index, 'goal', e.target.value)} placeholder="Goal..." />
                </td>
                <td className="py-2 px-1">
                  <input className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={goal.metric} onChange={(e) => updateGoal(index, 'metric', e.target.value)} placeholder="Metric..." />
                </td>
                <td className="py-2 px-1">
                  <input className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={goal.target} onChange={(e) => updateGoal(index, 'target', e.target.value)} placeholder="Target..." />
                </td>
                <td className="py-2 px-1">
                  <input type="date" className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={goal.deadline ? goal.deadline.slice(0, 10) : ''} onChange={(e) => updateGoal(index, 'deadline', e.target.value)} />
                </td>
                <td className="py-2 px-1">
                  <input className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={goal.owner} onChange={(e) => updateGoal(index, 'owner', e.target.value)} placeholder="Owner..." />
                </td>
                <td className="py-2 px-1">
                  <button onClick={() => removeGoal(index)} className="text-red-500 hover:text-red-700">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" onClick={addGoal} className="mt-4">
        + Add Goal
      </Button>
    </SectionWrapper>
  );
};

// Section 13: Quarterly Plan
const QuarterlyPlanSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { quarters: [] });

  const addQuarter = () => {
    setFormData(prev => ({
      ...prev,
      quarters: [...(prev.quarters || []), { quarter: 'Q1', focusTheme: '', keyActions: [], kpis: [], owner: '' }]
    }));
  };

  const handleSave = () => {
    onSave('quarterlyPlan', formData);
  };

  return (
    <SectionWrapper
      title="Quarterly Execution Plan"
      description="Break the year into execution cycles"
      icon="📆"
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => {
          const quarterData = (formData.quarters || []).find(item => item.quarter === q) || { quarter: q, focusTheme: '', keyActions: [], kpis: [], owner: '' };

          return (
            <div key={q} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">{q}</h4>
              <div className="space-y-3">
                <FormInput
                  label="Focus Theme"
                  value={quarterData.focusTheme}
                  onChange={(v) => {
                    const updated = formData.quarters.map(item =>
                      item.quarter === q ? { ...item, focusTheme: v } : item
                    );
                    if (!formData.quarters.find(item => item.quarter === q)) {
                      setFormData(prev => ({
                        ...prev,
                        quarters: [...(prev.quarters || []), { ...quarterData, focusTheme: v }]
                      }));
                    } else {
                      setFormData(prev => ({ ...prev, quarters: updated }));
                    }
                  }}
                  placeholder="Main focus for this quarter"
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

// Section 14: Revenue Model
const RevenueModelSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { revenueStreams: [] });

  const handleSave = () => {
    onSave('revenueModel', formData);
  };

  return (
    <SectionWrapper
      title="Revenue Model & Targets"
      description="How money comes in"
      icon="💰"
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormInput
          label="Average Deal Size"
          type="number"
          value={formData.averageDealSize}
          onChange={(v) => setFormData(prev => ({ ...prev, averageDealSize: parseFloat(v) || 0 }))}
          placeholder="5000"
        />
        <FormInput
          label="Monthly Revenue Target"
          type="number"
          value={formData.monthlyRevenueTarget}
          onChange={(v) => setFormData(prev => ({ ...prev, monthlyRevenueTarget: parseFloat(v) || 0 }))}
          placeholder="50000"
        />
        <FormInput
          label="Annual Revenue Target"
          type="number"
          value={formData.annualRevenueTarget}
          onChange={(v) => setFormData(prev => ({ ...prev, annualRevenueTarget: parseFloat(v) || 0 }))}
          placeholder="600000"
        />
      </div>

      <FormInput
        label="Revenue Streams"
        value={(formData.revenueStreams || []).join(', ')}
        onChange={(v) => setFormData(prev => ({ ...prev, revenueStreams: v.split(',').map(s => s.trim()).filter(Boolean) }))}
        placeholder="Comma-separated: Consulting, SaaS, Courses"
        helperText="Enter streams separated by commas"
      />

      <FormInput
        label="Pricing Structure"
        value={formData.pricingStructure}
        onChange={(v) => setFormData(prev => ({ ...prev, pricingStructure: v }))}
        type="textarea"
        placeholder="Describe your pricing model..."
      />

      <FormInput
        label="Lead Requirements"
        value={formData.leadRequirements}
        onChange={(v) => setFormData(prev => ({ ...prev, leadRequirements: v }))}
        type="textarea"
        placeholder="How many leads do you need per month?"
      />

      <FormInput
        label="Conversion Assumptions"
        value={formData.conversionAssumptions}
        onChange={(v) => setFormData(prev => ({ ...prev, conversionAssumptions: v }))}
        type="textarea"
        placeholder="Expected conversion rates..."
      />
    </SectionWrapper>
  );
};

// Section 15: Organizational Structure
const OrganizationalStructureSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { roles: [] });

  const addRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [...(prev.roles || []), { role: '', responsibility: '', successMeasure: '' }]
    }));
  };

  const updateRole = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const removeRole = (index) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave('organizationalStructure', formData);
  };

  return (
    <SectionWrapper
      title="Organizational Structure (Ideal State)"
      description="List roles, not names"
      icon="👥"
      onSave={handleSave}
      saving={saving}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-2 font-medium text-gray-500">Role</th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">Core Responsibility</th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">Success Measure</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {(formData.roles || []).map((role, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-1">
                  <input className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={role.role} onChange={(e) => updateRole(index, 'role', e.target.value)} placeholder="Role title..." />
                </td>
                <td className="py-2 px-1">
                  <input className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={role.responsibility} onChange={(e) => updateRole(index, 'responsibility', e.target.value)} placeholder="Core responsibility..." />
                </td>
                <td className="py-2 px-1">
                  <input className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white" value={role.successMeasure} onChange={(e) => updateRole(index, 'successMeasure', e.target.value)} placeholder="Success measure..." />
                </td>
                <td className="py-2 px-1">
                  <button onClick={() => removeRole(index)} className="text-red-500 hover:text-red-700">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" onClick={addRole} className="mt-4">
        + Add Role
      </Button>
    </SectionWrapper>
  );
};

// Section 16: SOP Roadmap
const SOPRoadmapSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { sops: [] });

  const addSOP = () => {
    setFormData(prev => ({
      ...prev,
      sops: [...(prev.sops || []), { order: (prev.sops?.length || 0) + 1, name: '', description: '' }]
    }));
  };

  const handleSave = () => {
    onSave('sopRoadmap', formData);
  };

  return (
    <SectionWrapper
      title="SOP Roadmap"
      description="SOPs are built in order of operational risk"
      icon="📋"
      onSave={handleSave}
      saving={saving}
    >
      <div className="space-y-3">
        {(formData.sops || []).map((sop, index) => (
          <div key={index} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
              {index + 1}
            </span>
            <input
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              value={sop.name}
              onChange={(e) => {
                const updated = formData.sops.map((s, i) => i === index ? { ...s, name: e.target.value } : s);
                setFormData(prev => ({ ...prev, sops: updated }));
              }}
              placeholder="SOP name..."
            />
          </div>
        ))}

        <Button variant="outline" onClick={addSOP} className="w-full">
          + Add SOP
        </Button>
      </div>
    </SectionWrapper>
  );
};

// Section 17: Automation & Systems
const AutomationSystemsSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {
    coreTools: [],
    keyAutomations: [],
    dashboardsNeeded: []
  });

  const handleSave = () => {
    onSave('automationSystems', formData);
  };

  return (
    <SectionWrapper
      title="Automation & Systems"
      description="Tools, automations, and dashboards"
      icon="⚙️"
      onSave={handleSave}
      saving={saving}
    >
      <FormInput
        label="Core Tools"
        value={(formData.coreTools || []).join(', ')}
        onChange={(v) => setFormData(prev => ({ ...prev, coreTools: v.split(',').map(s => s.trim()).filter(Boolean) }))}
        placeholder="Comma-separated: HubSpot, Slack, Notion"
        helperText="Enter tools separated by commas"
      />

      <FormInput
        label="Key Automations Required"
        value={(formData.keyAutomations || []).join('\n')}
        onChange={(v) => setFormData(prev => ({ ...prev, keyAutomations: v.split('\n').map(s => s.trim()).filter(Boolean) }))}
        type="textarea"
        placeholder="One automation per line..."
        helperText="Enter one automation per line"
      />

      <FormInput
        label="Dashboards Needed"
        value={(formData.dashboardsNeeded || []).join('\n')}
        onChange={(v) => setFormData(prev => ({ ...prev, dashboardsNeeded: v.split('\n').map(s => s.trim()).filter(Boolean) }))}
        type="textarea"
        placeholder="One dashboard per line..."
        helperText="Enter one dashboard per line"
      />
    </SectionWrapper>
  );
};

// Section 18: KPI Dashboard
const KPIDashboardSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {
    financialKpis: [],
    salesKpis: [],
    operationalKpis: [],
    customerKpis: [],
    peopleKpis: []
  });

  const handleSave = () => {
    onSave('kpiDashboard', formData);
  };

  const categories = [
    { key: 'financialKpis', label: 'Financial KPIs', color: 'green' },
    { key: 'salesKpis', label: 'Sales KPIs', color: 'blue' },
    { key: 'operationalKpis', label: 'Operational KPIs', color: 'orange' },
    { key: 'customerKpis', label: 'Customer KPIs', color: 'purple' },
    { key: 'peopleKpis', label: 'People KPIs', color: 'pink' }
  ];

  return (
    <SectionWrapper
      title="KPI Dashboard"
      description="Key Performance Indicators across all areas"
      icon="📈"
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map(({ key, label, color }) => (
          <div key={key} className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-lg p-4`}>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm min-h-[100px]"
              value={(formData[key] || []).join('\n')}
              onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
              placeholder="One KPI per line..."
            />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

// Section 19: Risk Management
const RiskManagementSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || { risks: [] });

  const addRisk = () => {
    setFormData(prev => ({
      ...prev,
      risks: [...(prev.risks || []), { risk: '', probability: '', impact: '', preventionStrategy: '', monitoringMethod: '' }]
    }));
  };

  const updateRisk = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const removeRisk = (index) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave('riskManagement', formData);
  };

  return (
    <SectionWrapper
      title="Risk Management"
      description="Identify and plan for potential risks"
      icon="🛡️"
      onSave={handleSave}
      saving={saving}
    >
      <div className="space-y-4">
        {(formData.risks || []).map((risk, index) => (
          <div key={index} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="font-medium text-red-700 dark:text-red-400">Risk #{index + 1}</span>
              <button onClick={() => removeRisk(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Risk"
                value={risk.risk}
                onChange={(v) => updateRisk(index, 'risk', v)}
                placeholder="Describe the risk..."
              />
              <div className="grid grid-cols-2 gap-2">
                <FormSelect
                  label="Probability"
                  value={risk.probability}
                  onChange={(v) => updateRisk(index, 'probability', v)}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' }
                  ]}
                />
                <FormSelect
                  label="Impact"
                  value={risk.impact}
                  onChange={(v) => updateRisk(index, 'impact', v)}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' }
                  ]}
                />
              </div>
              <FormInput
                label="Prevention Strategy"
                value={risk.preventionStrategy}
                onChange={(v) => updateRisk(index, 'preventionStrategy', v)}
                type="textarea"
              />
              <FormInput
                label="Monitoring Method"
                value={risk.monitoringMethod}
                onChange={(v) => updateRisk(index, 'monitoringMethod', v)}
                type="textarea"
              />
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addRisk} className="w-full">
          + Add Risk
        </Button>
      </div>
    </SectionWrapper>
  );
};

// Section 20: Strategy Summary
const StrategySummarySection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data || {});

  const handleSave = () => {
    onSave('strategySummary', formData);
  };

  return (
    <SectionWrapper
      title="Final Strategy Summary (One Page)"
      description="Your complete strategy in brief"
      icon="📝"
      onSave={handleSave}
      saving={saving}
    >
      <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-bold text-primary-800 dark:text-primary-300 mb-4">Quick Reference</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Who We Serve"
            value={formData.whoWeServe}
            onChange={(v) => setFormData(prev => ({ ...prev, whoWeServe: v }))}
            type="textarea"
          />
          <FormInput
            label="What Problem We Solve"
            value={formData.problemWeSolve}
            onChange={(v) => setFormData(prev => ({ ...prev, problemWeSolve: v }))}
            type="textarea"
          />
          <FormInput
            label="How We Make Money"
            value={formData.howWeMakeMoney}
            onChange={(v) => setFormData(prev => ({ ...prev, howWeMakeMoney: v }))}
            type="textarea"
          />
          <FormInput
            label="Why We Win"
            value={formData.whyWeWin}
            onChange={(v) => setFormData(prev => ({ ...prev, whyWeWin: v }))}
            type="textarea"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <FormInput
            label="Year-1 Focus"
            value={formData.year1Focus}
            onChange={(v) => setFormData(prev => ({ ...prev, year1Focus: v }))}
            type="textarea"
          />
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <FormInput
            label="3-Year Direction"
            value={formData.threeYearDirection}
            onChange={(v) => setFormData(prev => ({ ...prev, threeYearDirection: v }))}
            type="textarea"
          />
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <FormInput
            label="10-Year Ambition"
            value={formData.tenYearAmbition}
            onChange={(v) => setFormData(prev => ({ ...prev, tenYearAmbition: v }))}
            type="textarea"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-3">Final Guidelines</h4>
        <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>• Strategy is about <strong>choices</strong>, not options</li>
          <li>• If everything is important, nothing is</li>
          <li>• If it cannot be measured, it cannot be managed</li>
          <li>• If it sounds impressive but unclear, rewrite it</li>
          <li>• This document should guide daily decisions</li>
        </ul>
      </div>
    </SectionWrapper>
  );
};

export default StrategySheetManager;