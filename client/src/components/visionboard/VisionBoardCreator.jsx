import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Modal from '../common/Modal';
import ProgressBar from '../common/ProgressBar';
import { industries, sectionNames, systemTypes } from '../../utils/helpers';
import visionBoardService from '../../services/visionBoardService';

const VisionBoardCreator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visionBoardId, setVisionBoardId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sections: {
      businessOverview: { completed: false, data: {} },
      financialGoals: { completed: false, data: {} },
      growthStrategy: { completed: false, data: {} },
      productService: { completed: false, data: {} },
      systemsToBuild: { completed: false, data: { systems: [] } },
      teamPlan: { completed: false, data: { roles: [] } },
      brandGoals: { completed: false, data: {} },
      lifestyleVision: { completed: false, data: {} }
    }
  });

  const steps = [
    { key: 'name', title: 'Board Name', description: 'Give your vision board a name' },
    { key: 'businessOverview', title: 'Business Overview', description: 'Define your business foundation' },
    { key: 'financialGoals', title: 'Financial Goals', description: 'Set your revenue and profit targets' },
    { key: 'growthStrategy', title: 'Growth Strategy', description: 'Plan your growth approach' },
    { key: 'productService', title: 'Product/Service Plan', description: 'Define your offerings' },
    { key: 'systemsToBuild', title: 'Systems to Build', description: 'Plan your operational systems' },
    { key: 'teamPlan', title: 'Team Plan', description: 'Plan your team growth' },
    { key: 'brandGoals', title: 'Brand Goals', description: 'Set your brand targets' },
    { key: 'lifestyleVision', title: 'Lifestyle Vision', description: 'Define your ideal lifestyle' }
  ];

  const progress = Math.round((currentStep / (steps.length - 1)) * 100);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          data: {
            ...prev.sections[section].data,
            [field]: value
          }
        }
      }
    }));
  };

  const handleArrayAdd = (section, field, item) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          data: {
            ...prev.sections[section].data,
            [field]: [...(prev.sections[section].data[field] || []), item]
          }
        }
      }
    }));
  };

  const handleArrayRemove = (section, field, index) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          data: {
            ...prev.sections[section].data,
            [field]: prev.sections[section].data[field].filter((_, i) => i !== index)
          }
        }
      }
    }));
  };

  const handleSystemToggle = (systemId) => {
    const systems = formData.sections.systemsToBuild.data.systems || [];
    const exists = systems.find(s => s.id === systemId);

    if (exists) {
      handleArrayRemove('systemsToBuild', 'systems', systems.findIndex(s => s.id === systemId));
    } else {
      const system = systemTypes.find(s => s.id === systemId);
      handleArrayAdd('systemsToBuild', 'systems', { ...system, status: 'not-started' });
    }
  };

  const updateSystemStatus = (systemId, status) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        systemsToBuild: {
          ...prev.sections.systemsToBuild,
          data: {
            ...prev.sections.systemsToBuild.data,
            systems: prev.sections.systemsToBuild.data.systems.map(s =>
              s.id === systemId ? { ...s, status } : s
            )
          }
        }
      }
    }));
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Create vision board first
      setLoading(true);
      try {
        const response = await visionBoardService.create({ name: formData.name });
        setVisionBoardId(response.data._id);
        setCurrentStep(1);
      } catch (error) {
        alert('Failed to create vision board');
      } finally {
        setLoading(false);
      }
    } else {
      // Save current section
      const sectionKey = steps[currentStep].key;
      await saveSection(sectionKey);

      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        navigate('/visionboards');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveSection = async (sectionKey) => {
    if (!visionBoardId) return;

    const sectionData = formData.sections[sectionKey];
    const hasData = Object.keys(sectionData.data).length > 0;

    try {
      await visionBoardService.updateSection(visionBoardId, sectionKey, {
        completed: hasData,
        data: sectionData.data
      });

      setFormData(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections[sectionKey],
            completed: hasData
          }
        }
      }));
    } catch (error) {
      console.error('Failed to save section:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              label="Vision Board Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., My 2024 Business Vision"
              required
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Business Name"
              value={formData.sections.businessOverview.data.businessName || ''}
              onChange={(e) => handleInputChange('businessOverview', 'businessName', e.target.value)}
              placeholder="Your business name"
            />
            <Select
              label="Industry"
              value={formData.sections.businessOverview.data.industry || ''}
              onChange={(e) => handleInputChange('businessOverview', 'industry', e.target.value)}
              options={industries.map(i => ({ value: i, label: i }))}
            />
            <div>
              <label className="label">Vision Statement (3-5 years)</label>
              <textarea
                className="input min-h-[100px]"
                value={formData.sections.businessOverview.data.visionStatement || ''}
                onChange={(e) => handleInputChange('businessOverview', 'visionStatement', e.target.value)}
                placeholder="Describe your long-term vision for your business..."
              />
            </div>
            <Input
              label="Target Revenue"
              type="number"
              value={formData.sections.businessOverview.data.targetRevenue || ''}
              onChange={(e) => handleInputChange('businessOverview', 'targetRevenue', parseFloat(e.target.value) || 0)}
              placeholder="500000"
            />
            <Input
              label="Target Market/Geography"
              value={formData.sections.businessOverview.data.targetMarket || ''}
              onChange={(e) => handleInputChange('businessOverview', 'targetMarket', e.target.value)}
              placeholder="e.g., North America, Europe, Global"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Input
              label="Annual Revenue Goal"
              type="number"
              value={formData.sections.financialGoals.data.annualRevenue || ''}
              onChange={(e) => handleInputChange('financialGoals', 'annualRevenue', parseFloat(e.target.value) || 0)}
              placeholder="1000000"
            />
            <Input
              label="Monthly Revenue Goal"
              type="number"
              value={formData.sections.financialGoals.data.monthlyRevenue || ''}
              onChange={(e) => handleInputChange('financialGoals', 'monthlyRevenue', parseFloat(e.target.value) || 0)}
              placeholder="83000"
            />
            <div>
              <label className="label">Target Profit Margin (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.sections.financialGoals.data.profitMargin || 20}
                onChange={(e) => handleInputChange('financialGoals', 'profitMargin', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0%</span>
                <span className="font-medium text-primary-600">{formData.sections.financialGoals.data.profitMargin || 20}%</span>
                <span>100%</span>
              </div>
            </div>
            <Input
              label="Personal Income Goal"
              type="number"
              value={formData.sections.financialGoals.data.personalIncome || ''}
              onChange={(e) => handleInputChange('financialGoals', 'personalIncome', parseFloat(e.target.value) || 0)}
              placeholder="200000"
            />
            <Input
              label="Cash Reserve Target"
              type="number"
              value={formData.sections.financialGoals.data.cashReserve || ''}
              onChange={(e) => handleInputChange('financialGoals', 'cashReserve', parseFloat(e.target.value) || 0)}
              placeholder="100000"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Primary Revenue Sources</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="e.g., Consulting, SaaS, Courses"
                  className="flex-1"
                  id="revenueSource"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const input = document.getElementById('revenueSource');
                    if (input.value) {
                      handleArrayAdd('growthStrategy', 'revenueSources', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.sections.growthStrategy.data.revenueSources || []).map((source, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-sm flex items-center gap-1">
                    {source}
                    <button onClick={() => handleArrayRemove('growthStrategy', 'revenueSources', idx)} className="text-primary-400 hover:text-primary-700">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Target Customer Segments</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="e.g., SMBs, Enterprise, Startups"
                  className="flex-1"
                  id="customerSegment"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const input = document.getElementById('customerSegment');
                    if (input.value) {
                      handleArrayAdd('growthStrategy', 'customerSegments', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.sections.growthStrategy.data.customerSegments || []).map((segment, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm flex items-center gap-1">
                    {segment}
                    <button onClick={() => handleArrayRemove('growthStrategy', 'customerSegments', idx)} className="text-green-400 hover:text-green-700">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Top 3 High-Value Clients (Target)</label>
              {(formData.sections.growthStrategy.data.highValueClients || []).map((client, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <span className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                    {client}
                  </span>
                  <button
                    onClick={() => handleArrayRemove('growthStrategy', 'highValueClients', idx)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {(formData.sections.growthStrategy.data.highValueClients || []).length < 3 && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Client name"
                    className="flex-1"
                    id="highValueClient"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const input = document.getElementById('highValueClient');
                      if (input.value) {
                        handleArrayAdd('growthStrategy', 'highValueClients', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Current Services/Products</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="e.g., Consulting, Software Development"
                  className="flex-1"
                  id="currentService"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const input = document.getElementById('currentService');
                    if (input.value) {
                      handleArrayAdd('productService', 'currentServices', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.sections.productService.data.currentServices || []).map((service, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm flex items-center gap-1">
                    {service}
                    <button onClick={() => handleArrayRemove('productService', 'currentServices', idx)} className="text-blue-400 hover:text-blue-700">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Future Products/Services</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="e.g., Online Course, Mobile App"
                  className="flex-1"
                  id="futureProduct"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const input = document.getElementById('futureProduct');
                    if (input.value) {
                      handleArrayAdd('productService', 'futureProducts', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.sections.productService.data.futureProducts || []).map((product, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-full text-sm flex items-center gap-1">
                    {product}
                    <button onClick={() => handleArrayRemove('productService', 'futureProducts', idx)} className="text-purple-400 hover:text-purple-700">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Select the systems you want to build and set their current status.
            </p>
            <div className="grid gap-4">
              {systemTypes.map((system) => {
                const selected = formData.sections.systemsToBuild.data.systems?.find(s => s.id === system.id);
                return (
                  <div
                    key={system.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleSystemToggle(system.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => handleSystemToggle(system.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{system.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{system.description}</p>
                        {selected && (
                          <div className="flex gap-2 mt-2">
                            {['not-started', 'in-progress', 'completed'].map((status) => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSystemStatus(system.id, status);
                                }}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  selected.status === status
                                    ? status === 'completed'
                                      ? 'bg-green-500 text-white'
                                      : status === 'in-progress'
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-gray-500 text-white'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}
                              >
                                {status.replace('-', ' ')}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add team roles you plan to hire and their timeline.
            </p>
            {(formData.sections.teamPlan.data.roles || []).map((role, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{role.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {role.timeline} - {role.status}
                  </p>
                </div>
                <button
                  onClick={() => handleArrayRemove('teamPlan', 'roles', idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Role title"
                id="roleTitle"
              />
              <Select
                placeholder="Timeline"
                id="roleTimeline"
                options={[
                  { value: 'Q1 2024', label: 'Q1 2024' },
                  { value: 'Q2 2024', label: 'Q2 2024' },
                  { value: 'Q3 2024', label: 'Q3 2024' },
                  { value: 'Q4 2024', label: 'Q4 2024' },
                  { value: '2025', label: '2025' }
                ]}
              />
              <Select
                placeholder="Status"
                id="roleStatus"
                options={[
                  { value: 'Planning', label: 'Planning' },
                  { value: 'Hiring', label: 'Hiring' },
                  { value: 'Filled', label: 'Filled' }
                ]}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const titleInput = document.getElementById('roleTitle');
                const timelineSelect = document.getElementById('roleTimeline');
                const statusSelect = document.getElementById('roleStatus');
                if (titleInput.value) {
                  handleArrayAdd('teamPlan', 'roles', {
                    role: titleInput.value,
                    timeline: timelineSelect.value || 'TBD',
                    status: statusSelect.value || 'Planning'
                  });
                  titleInput.value = '';
                  timelineSelect.value = '';
                  statusSelect.value = '';
                }
              }}
            >
              Add Team Role
            </Button>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <Input
              label="Website Leads/Month Target"
              type="number"
              value={formData.sections.brandGoals.data.websiteLeads || ''}
              onChange={(e) => handleInputChange('brandGoals', 'websiteLeads', parseInt(e.target.value) || 0)}
              placeholder="100"
            />
            <Input
              label="Social Media Followers Target"
              type="number"
              value={formData.sections.brandGoals.data.socialFollowers || ''}
              onChange={(e) => handleInputChange('brandGoals', 'socialFollowers', parseInt(e.target.value) || 0)}
              placeholder="10000"
            />
            <Input
              label="Case Studies Target"
              type="number"
              value={formData.sections.brandGoals.data.caseStudies || ''}
              onChange={(e) => handleInputChange('brandGoals', 'caseStudies', parseInt(e.target.value) || 0)}
              placeholder="10"
            />
            <div>
              <label className="label">Speaking/Events Goals</label>
              <textarea
                className="input min-h-[80px]"
                value={formData.sections.brandGoals.data.speakingEvents || ''}
                onChange={(e) => handleInputChange('brandGoals', 'speakingEvents', e.target.value)}
                placeholder="e.g., 2 keynotes per year, 4 webinars per quarter..."
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <Input
              label="Target Working Hours/Day"
              type="number"
              value={formData.sections.lifestyleVision.data.workingHours || ''}
              onChange={(e) => handleInputChange('lifestyleVision', 'workingHours', parseInt(e.target.value) || 0)}
              placeholder="6"
            />
            <Input
              label="Target Free Days/Month"
              type="number"
              value={formData.sections.lifestyleVision.data.freeDays || ''}
              onChange={(e) => handleInputChange('lifestyleVision', 'freeDays', parseInt(e.target.value) || 0)}
              placeholder="8"
            />
            <div>
              <label className="label">Travel Goals</label>
              <textarea
                className="input min-h-[80px]"
                value={formData.sections.lifestyleVision.data.travelGoals || ''}
                onChange={(e) => handleInputChange('lifestyleVision', 'travelGoals', e.target.value)}
                placeholder="e.g., 2 international trips per year, monthly weekend getaways..."
              />
            </div>
            <Input
              label="Net Worth Target"
              type="number"
              value={formData.sections.lifestyleVision.data.netWorth || ''}
              onChange={(e) => handleInputChange('lifestyleVision', 'netWorth', parseFloat(e.target.value) || 0)}
              placeholder="1000000"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Vision Board
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      {/* Progress */}
      <ProgressBar value={progress} label="Overall Progress" />

      {/* Step Content */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {steps[currentStep].description}
        </h2>
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          loading={loading}
          disabled={currentStep === 0 && !formData.name}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default VisionBoardCreator;