// Module Card - Unified component for displaying modules across the app

export const moduleConfigs = [
  {
    id: 'targets',
    name: 'Target Tracker',
    shortName: 'Targets',
    icon: '📊',
    description: 'Set OKRs and SMART goals, track milestones, map dependencies, and monitor KPIs',
    info: 'Create Objectives with Key Results, set SMART goals with AI assistance, and track milestones with a visual timeline. Use dependency mapping to see what needs to happen first.',
    color: 'from-green-500 to-emerald-600',
    hrefBase: 'modules',
    category: 'Execution',
    features: ['OKRs', 'SMART Goals', 'Milestones', 'Dependencies', 'KPI Dashboard']
  },
  {
    id: 'resources',
    name: 'Resource Management',
    shortName: 'Resources',
    icon: '👥',
    description: 'FACe and PACe charts, talent assessment with 9-box grid, organizational structure',
    info: 'Use the Functional Accountability Chart (FACe) to clarify who owns what, and Process Accountability Chart (PACe) to define process ownership. Assess talent using the 9-box grid.',
    color: 'from-purple-500 to-violet-600',
    hrefBase: 'modules',
    category: 'People',
    features: ['FACe Chart', 'PACe Chart', 'Talent Assessment', 'Org Chart', 'Team Directory']
  },
  {
    id: 'execution',
    name: 'Execution & Risk',
    shortName: 'Execution',
    icon: '⚡',
    description: 'Who-What-When action lists, Rockefeller Habits checklist, risk management with AI simulation',
    info: 'Track action items with WWW (Who-What-When), maintain habits with the Rockefeller checklist, and manage risks with the AI-powered scenario simulator.',
    color: 'from-orange-500 to-amber-600',
    hrefBase: 'modules',
    category: 'Execution',
    features: ['WWW Actions', 'Habits Checklist', 'Risk Matrix', 'Project Portfolio', 'AI Simulation']
  },
  {
    id: 'financial',
    name: 'Financial Insights',
    shortName: 'Financial',
    icon: '💰',
    description: 'FP&A dashboard, cash acceleration strategies, forecasting models, and ROI calculators',
    info: 'Monitor your financial health with the FP&A dashboard. Use CASh strategies to accelerate cash flow, create financial forecasts, and calculate ROI for initiatives.',
    color: 'from-teal-500 to-cyan-600',
    hrefBase: 'modules',
    category: 'Analytics',
    features: ['FP&A Dashboard', 'CASh Strategies', 'Forecasting', 'ROI Calculator', 'AI Analysis']
  },
  {
    id: 'collaboration',
    name: 'Collaboration Hub',
    shortName: 'Collaboration',
    icon: '🤝',
    description: 'Shared workspaces, guided discussions, reverse mentoring, and AI coaching',
    info: 'Create shared workspaces for team collaboration, set up mentoring relationships, and use the AI coach "Ask Patrick" for on-demand business guidance.',
    color: 'from-pink-500 to-rose-600',
    hrefBase: 'modules',
    category: 'People',
    features: ['Workspaces', 'Discussions', 'Mentorship', 'Knowledge Base', 'AI Coach']
  }
];

// Get progress for a module based on vision board data
// Calculates progress based on actual data presence, not just completed flags
export const getModuleProgress = (moduleId, visionBoard) => {
  if (!visionBoard) return 0;

  // Helper to check if data has meaningful content
  const hasContent = (data) => {
    if (!data) return false;
    if (typeof data === 'string') return data.trim().length > 0;
    if (typeof data === 'number') return data > 0;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object') {
      return Object.values(data).some(v => hasContent(v));
    }
    return false;
  };

  // Helper to check if a section has meaningful data
  const sectionHasData = (sectionName) => {
    // Check strategySheet first
    if (visionBoard.strategySheet?.[sectionName]) {
      const section = visionBoard.strategySheet[sectionName];
      // If explicitly marked complete, count it
      if (section.completed) return true;
      // Otherwise check if data has content
      if (section.data && hasContent(section.data)) return true;
    }
    // Check legacy sections
    if (visionBoard.sections?.[sectionName]) {
      const section = visionBoard.sections[sectionName];
      if (section.completed) return true;
      if (section.data && hasContent(section.data)) return true;
    }
    return false;
  };

  // Module to strategySheet section mapping
  const moduleSectionMap = {
    targets: {
      sections: ['smartGoals', 'quarterlyPlan']
    },
    resources: {
      sections: ['organizationalStructure', 'sopRoadmap', 'automationSystems']
    },
    execution: {
      sections: ['strategicPriorities', 'threeYearStrategy', 'riskManagement']
    },
    financial: {
      sections: ['revenueModel', 'kpiDashboard']
    },
    collaboration: {
      sections: ['collaboration']
    }
  };

  const moduleConfig = moduleSectionMap[moduleId];
  if (!moduleConfig) return 0;

  // For collaboration, use overall progress
  if (moduleConfig.sections.length === 0) {
    return visionBoard.overallProgress || 0;
  }

  // Calculate based on sections with actual data
  const completedCount = moduleConfig.sections.filter(s => sectionHasData(s)).length;
  return Math.round((completedCount / moduleConfig.sections.length) * 100);
};

// Module Card Component
export const ModuleCard = ({
  module,
  progress = 0,
  visionBoardId,
  onClick,
  showInfo = true,
  compact = false
}) => {
  const config = moduleConfigs.find(m => m.id === module) || module;

  return (
    <div
      onClick={onClick}
      className={`${compact ? 'p-3' : 'p-4'} bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`${compact ? 'w-8 h-8 text-base' : 'w-10 h-10 text-lg'} rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-md`}>
          {config.icon}
        </div>
        {!compact && (
          <span className="text-lg font-bold text-gray-900 dark:text-white">{progress}%</span>
        )}
      </div>
      <h3 className={`font-semibold text-gray-900 dark:text-white ${compact ? 'text-sm' : 'text-base'} mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors`}>
        {config.name}
      </h3>
      {!compact && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {config.description}
        </p>
      )}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${config.color} transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Module Info Banner Component
export const ModuleInfoBanner = ({ module, onDismiss }) => {
  const config = moduleConfigs.find(m => m.id === module) || module;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white text-lg flex-shrink-0`}>
            {config.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{config.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{config.info}</p>
            <div className="flex flex-wrap gap-1.5">
              {config.features?.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white dark:bg-gray-800 text-xs rounded-full text-gray-600 dark:text-gray-400"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Quick Fill Guide Component
export const QuickFillGuide = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Start Guide</h4>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => onStepClick?.(idx)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
              idx === currentStep
                ? 'bg-primary-500 text-white'
                : idx < currentStep
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {idx < currentStep ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span>{idx + 1}</span>
            )}
            <span>{step}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Empty State Component for Modules
export const ModuleEmptyState = ({ moduleName, onAction, actionText = 'Get Started' }) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No {moduleName} data yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Start by adding your first entry to begin tracking your progress
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default moduleConfigs;