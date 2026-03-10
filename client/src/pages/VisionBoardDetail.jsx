import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import VisualMode from '../components/visionboard/VisualMode';
import ExportOptions from '../components/visionboard/ExportOptions';
import StrategySheetManager from '../components/strategy/StrategySheetManager';
import { formatDate, sectionNames } from '../utils/helpers';
import visionBoardService from '../services/visionBoardService';
import { moduleConfigs, getModuleProgress, ModuleCard } from '../components/common/ModuleCard';

// Field definitions for each section (used when section.data is empty)
const sectionFieldDefs = {
  businessOverview: {
    businessName: { type: 'text', label: 'Business Name' },
    industry: { type: 'text', label: 'Industry' },
    targetMarket: { type: 'text', label: 'Target Market' },
    visionStatement: { type: 'textarea', label: 'Vision Statement' },
    missionStatement: { type: 'textarea', label: 'Mission Statement' }
  },
  financialGoals: {
    annualRevenue: { type: 'number', label: 'Annual Revenue Target' },
    monthlyRevenue: { type: 'number', label: 'Monthly Revenue Target' },
    profitMargin: { type: 'number', label: 'Profit Margin %' },
    personalIncome: { type: 'number', label: 'Personal Income Goal' },
    cashReserve: { type: 'number', label: 'Cash Reserve Target' }
  },
  growthStrategy: {
    primaryRevenueSources: { type: 'text', label: 'Primary Revenue Sources' },
    targetCustomerSegments: { type: 'text', label: 'Target Customer Segments' },
    highValueClients: { type: 'text', label: 'High-Value Clients' },
    growthChannels: { type: 'text', label: 'Growth Channels' }
  },
  productService: {
    currentServices: { type: 'textarea', label: 'Current Services/Products' },
    futureProducts: { type: 'textarea', label: 'Future Products/Services' },
    pricingStrategy: { type: 'text', label: 'Pricing Strategy' },
    competitiveAdvantage: { type: 'textarea', label: 'Competitive Advantage' }
  },
  systemsToBuild: {
    crmSystem: { type: 'text', label: 'CRM System Status' },
    salesFunnel: { type: 'text', label: 'Sales Funnel Status' },
    operations: { type: 'text', label: 'Operations System Status' },
    financialTracking: { type: 'text', label: 'Financial Tracking Status' },
    marketingAutomation: { type: 'text', label: 'Marketing Automation Status' }
  },
  teamPlan: {
    currentTeam: { type: 'textarea', label: 'Current Team Members' },
    futureHires: { type: 'textarea', label: 'Future Hires Needed' },
    organizationalStructure: { type: 'textarea', label: 'Organizational Structure' },
    teamCulture: { type: 'text', label: 'Team Culture Values' }
  },
  brandGoals: {
    websiteLeads: { type: 'number', label: 'Website Leads/Month' },
    socialFollowers: { type: 'number', label: 'Social Media Followers' },
    caseStudies: { type: 'number', label: 'Case Studies Goal' },
    speakingEvents: { type: 'text', label: 'Speaking/Events Goals' },
    brandAwareness: { type: 'text', label: 'Brand Awareness Goals' }
  },
  lifestyleVision: {
    workingHours: { type: 'number', label: 'Working Hours/Day' },
    freeDays: { type: 'number', label: 'Free Days/Month' },
    travelGoals: { type: 'textarea', label: 'Travel Goals' },
    netWorthTarget: { type: 'number', label: 'Net Worth Target' },
    personalGoals: { type: 'textarea', label: 'Personal Goals' }
  }
};

const VisionBoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [activeTab, setActiveTab] = useState('vision');
  const [suggestions, setSuggestions] = useState([]);

  // Update activeTab when URL query parameter changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'strategy' || tabParam === 'visual') {
      setActiveTab(tabParam);
    } else {
      setActiveTab('vision');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchVisionBoard();
    fetchSuggestions();
  }, [id]);

  const fetchVisionBoard = async () => {
    try {
      const response = await visionBoardService.getById(id);
      setVisionBoard(response.data);
    } catch (error) {
      console.error('Failed to fetch vision board:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await visionBoardService.getAISuggestions(id);
      setSuggestions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSectionUpdate = async (sectionName, data) => {
    try {
      const response = await visionBoardService.updateSection(id, sectionName, {
        completed: true,
        data
      });
      setVisionBoard(response.data);
      setEditingSection(null);
    } catch (error) {
      alert('Failed to update section');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this vision board?')) return;

    try {
      await visionBoardService.delete(id);
      navigate('/visionboards');
    } catch (error) {
      alert('Failed to delete vision board');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!visionBoard) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Vision board not found</p>
        <Link to="/visionboards">
          <Button variant="primary" className="mt-4">Back to Vision Boards</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link to="/visionboards" className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block">
            &larr; Back to Vision Boards
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {visionBoard.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Created {formatDate(visionBoard.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportOptions visionBoard={visionBoard} />
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar value={visionBoard.overallProgress} label="Overall Progress" size="lg" />

      {/* Modules Quick Access */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Modules</h2>
          <Link to={`/visionboards/${id}/modules`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Modules →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {moduleConfigs.map(module => (
            <ModuleCard
              key={module.id}
              module={module.id}
              progress={getModuleProgress(module.id, visionBoard)}
              visionBoardId={id}
              onClick={() => {
                // Vision Board module goes to Strategy Sheet tab
                if (module.id === 'vision') {
                  navigate(`/visionboards/${id}?tab=strategy`);
                } else {
                  navigate(`/visionboards/${id}/modules?module=${module.id}`);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {[
            { id: 'vision', label: 'Vision Board Sections', icon: '🎯' },
            { id: 'strategy', label: 'Strategy Sheet', icon: '📋' },
            { id: 'visual', label: 'Visual Mode', icon: '👁️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Update URL with tab parameter
                const url = tab.id === 'vision'
                  ? `/visionboards/${id}`
                  : `/visionboards/${id}?tab=${tab.id}`;
                navigate(url, { replace: true });
              }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'vision' && (
        <>
          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <Card className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Suggestions
              </h3>
              <div className="space-y-3">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-xl">{suggestion.icon === 'users' ? '👥' : suggestion.icon === 'dollar-sign' ? '💵' : '💡'}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Sections Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(visionBoard.sections || {}).map(([key, section]) => (
              <SectionCard
                key={key}
                sectionKey={key}
                section={section}
                onEdit={() => setEditingSection(key)}
                onSave={(data) => handleSectionUpdate(key, data)}
                isEditing={editingSection === key}
                onCancel={() => setEditingSection(null)}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === 'strategy' && (
        <StrategySheetManager />
      )}

      {activeTab === 'visual' && (
        <VisualMode visionBoard={visionBoard} />
      )}
    </div>
  );
};

// Section Card Component
const SectionCard = ({ sectionKey, section, onEdit, onSave, isEditing, onCancel }) => {
  // Get field definitions for this section, or use section.data if available
  const fieldDefs = sectionFieldDefs[sectionKey] || {};
  const hasData = section.data && Object.keys(section.data).length > 0;

  // Merge field definitions with actual data (field defs as fallback)
  const fieldsToShow = hasData
    ? section.data
    : Object.keys(fieldDefs).reduce((acc, key) => {
        acc[key] = fieldDefs[key].type === 'number' ? 0 : '';
        return acc;
      }, {});

  const [editData, setEditData] = useState(hasData ? (section.data || {}) : fieldsToShow);

  // Reset editData when entering edit mode with empty data
  useEffect(() => {
    if (isEditing && !hasData) {
      setEditData(fieldsToShow);
    }
  }, [isEditing, hasData]);

  const renderFieldValue = (value) => {
    if (!value && value !== 0) return <span className="text-gray-400">Not set</span>;
    if (typeof value === 'number') {
      if (sectionKey === 'financialGoals') {
        return `$${value.toLocaleString()}`;
      }
      return value.toLocaleString();
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">None</span>;
      return value.map((item, idx) => (
        <span key={idx} className="inline-block px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full mr-1 mb-1">
          {typeof item === 'object' ? item.name || item.role : item}
        </span>
      ));
    }
    return String(value);
  };

  const getFieldLabel = (field) => {
    if (fieldDefs[field]?.label) {
      return fieldDefs[field].label;
    }
    return field.replace(/([A-Z])/g, ' $1').trim();
  };

  const getFieldType = (field) => {
    if (fieldDefs[field]?.type) {
      return fieldDefs[field].type;
    }
    // Infer type from value
    const value = editData[field];
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string' && value.length > 50) return 'textarea';
    return 'text';
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {section.completed ? (
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {sectionNames[sectionKey]}
          </h3>
        </div>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {Object.entries(fieldsToShow).map(([field, defaultValue]) => {
            const fieldType = getFieldType(field);
            const value = editData[field] ?? (fieldType === 'number' ? 0 : '');

            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {getFieldLabel(field)}
                </label>
                {fieldType === 'textarea' ? (
                  <textarea
                    className="input min-h-[80px]"
                    value={value}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={`Enter ${getFieldLabel(field).toLowerCase()}...`}
                  />
                ) : fieldType === 'number' ? (
                  <input
                    type="number"
                    className="input"
                    value={value}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                ) : (
                  <input
                    type="text"
                    className="input"
                    value={value}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={`Enter ${getFieldLabel(field).toLowerCase()}...`}
                  />
                )}
              </div>
            );
          })}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => onSave(editData)}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(fieldsToShow).slice(0, 4).map(([field, value]) => (
            <div key={field} className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getFieldLabel(field)}:
              </span>
              <span className="text-sm text-gray-900 dark:text-white text-right max-w-[60%]">
                {hasData ? renderFieldValue(value) : <span className="text-gray-400">Not set</span>}
              </span>
            </div>
          ))}
          {!hasData && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              No data yet. Click edit to add information.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default VisionBoardDetail;