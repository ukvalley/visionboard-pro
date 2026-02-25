import { useState, lazy, Suspense, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { moduleConfigs, ModuleInfoBanner, getModuleProgress } from '../components/common/ModuleCard';
import visionBoardService from '../services/visionBoardService';

// Lazy load modules for code-splitting
const VisionStrategyManager = lazy(() => import('../components/vision-strategy/VisionStrategyManager'));
const TargetTracker = lazy(() => import('../components/target-tracker/TargetTracker'));
const ResourceManager = lazy(() => import('../components/resource-management/ResourceManager'));
const ExecutionRiskManager = lazy(() => import('../components/execution-risk/ExecutionRiskManager'));
const FinancialInsights = lazy(() => import('../components/financial-insights/FinancialInsights'));
const CollaborationHub = lazy(() => import('../components/collaboration/CollaborationHub'));

// Loading component for Suspense fallback
const ModuleLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400">Loading module...</p>
    </div>
  </div>
);

const ModulesPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModule, setActiveModule] = useState('vision');
  const [visionBoard, setVisionBoard] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [moduleProgress, setModuleProgress] = useState({});

  // Read module from URL on mount and when URL changes
  useEffect(() => {
    const moduleParam = searchParams.get('module');
    if (moduleParam && moduleConfigs.find(m => m.id === moduleParam)) {
      setActiveModule(moduleParam);
    }
  }, [searchParams]);

  // Fetch vision board data for progress tracking
  useEffect(() => {
    if (id) {
      fetchVisionBoard();
    }
  }, [id]);

  const fetchVisionBoard = async () => {
    try {
      const response = await visionBoardService.getById(id);
      setVisionBoard(response.data);

      // Calculate progress for each module
      const progress = {};
      moduleConfigs.forEach(config => {
        progress[config.id] = getModuleProgress(config.id, response.data);
      });
      setModuleProgress(progress);
    } catch (error) {
      console.error('Failed to fetch vision board:', error);
    }
  };

  // Update URL when module changes
  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    setSearchParams({ module: moduleId });
  };

  // Get current module config
  const currentConfig = moduleConfigs.find(m => m.id === activeModule) || moduleConfigs[0];

  // Group modules by category
  const modulesByCategory = moduleConfigs.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {});

  const renderModule = () => {
    const moduleProps = { visionBoardId: id };

    const moduleComponents = {
      vision: <VisionStrategyManager {...moduleProps} />,
      targets: <TargetTracker {...moduleProps} />,
      resources: <ResourceManager {...moduleProps} />,
      execution: <ExecutionRiskManager {...moduleProps} />,
      financial: <FinancialInsights {...moduleProps} />,
      collaboration: <CollaborationHub {...moduleProps} />
    };

    return (
      <Suspense fallback={<ModuleLoader />}>
        {moduleComponents[activeModule] || <VisionStrategyManager {...moduleProps} />}
      </Suspense>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to={`/visionboards/${id}`} className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Vision Board
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentConfig.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {currentConfig.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Progress:</span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {moduleProgress[activeModule] || 0}%
          </span>
        </div>
      </div>

      {/* Module Navigation - Compact Horizontal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex gap-1 overflow-x-auto">
          {moduleConfigs.map(module => (
            <button
              key={module.id}
              onClick={() => handleModuleChange(module.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                activeModule === module.id
                  ? `bg-gradient-to-r ${module.color} text-white shadow-md`
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{module.icon}</span>
              <span className="font-medium text-sm">{module.shortName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Module Info Banner */}
      {showInfo && (
        <ModuleInfoBanner
          module={activeModule}
          onDismiss={() => setShowInfo(false)}
        />
      )}

      {/* Module Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {renderModule()}
      </div>

      {/* Module Progress Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Module Progress Overview</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(modulesByCategory).map(([category, modules]) => (
            <div key={category} className="min-w-0">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{category}</h4>
              <div className="space-y-2">
                {modules.map(module => (
                  <button
                    key={module.id}
                    onClick={() => handleModuleChange(module.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                      activeModule === module.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{module.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{module.shortName}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {moduleProgress[module.id] || 0}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ModulesPage;