import { formatCurrency, formatNumber, sectionNames } from '../../utils/helpers';

// Section Icons
const SectionIcons = {
  businessOverview: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  financialGoals: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  growthStrategy: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  productService: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  systemsToBuild: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  teamPlan: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  brandGoals: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  lifestyleVision: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
};

// Section color themes
const sectionThemes = {
  businessOverview: {
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/30',
    textAccent: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  financialGoals: {
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
    textAccent: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  growthStrategy: {
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-950/30',
    textAccent: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800'
  },
  productService: {
    gradient: 'from-orange-500 to-amber-600',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-950/30',
    textAccent: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800'
  },
  systemsToBuild: {
    gradient: 'from-cyan-500 to-sky-600',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/30',
    textAccent: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800'
  },
  teamPlan: {
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50',
    bgDark: 'dark:bg-pink-950/30',
    textAccent: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800'
  },
  brandGoals: {
    gradient: 'from-amber-500 to-yellow-600',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/30',
    textAccent: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800'
  },
  lifestyleVision: {
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/30',
    textAccent: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800'
  }
};

const VisualMode = ({ visionBoard }) => {
  if (!visionBoard) return null;

  const { sections, name, overallProgress } = visionBoard;

  const formatFieldValue = (field, value, sectionKey) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return null;

      // Check if it's an array of objects (like systems or roles)
      if (typeof value[0] === 'object' && value[0] !== null) {
        return { type: 'objectArray', data: value };
      }

      // Simple string array
      return { type: 'array', data: value };
    }

    // Handle objects (but not arrays)
    if (typeof value === 'object' && value !== null) {
      return { type: 'object', data: value };
    }

    // Handle numbers with special formatting
    if (typeof value === 'number') {
      const fieldLower = field.toLowerCase();
      if (fieldLower.includes('revenue') || fieldLower.includes('income') ||
          fieldLower.includes('worth') || fieldLower.includes('reserve') ||
          fieldLower.includes('cash')) {
        return { type: 'currency', data: formatCurrency(value) };
      }
      if (fieldLower.includes('margin') || fieldLower.includes('percent')) {
        return { type: 'percent', data: `${value}%` };
      }
      return { type: 'number', data: formatNumber(value) };
    }

    // Handle strings
    if (typeof value === 'string') {
      // Check if it's a long text (like vision statement)
      if (value.length > 100) {
        return { type: 'longText', data: value };
      }
      return { type: 'text', data: value };
    }

    return { type: 'default', data: String(value) };
  };

  const renderFieldItem = (field, formattedValue, sectionKey) => {
    if (!formattedValue) return null;

    const fieldLabel = field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();

    const { type, data } = formattedValue;

    // Render object arrays (systems, roles)
    if (type === 'objectArray') {
      return (
        <div key={field} className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
            {fieldLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {data.map((item, idx) => {
              // Handle systems with status
              if (item.name && item.status) {
                const statusColors = {
                  'completed': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                  'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
                  'not-started': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                };
                return (
                  <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[item.status] || statusColors['not-started']}`}>
                    {item.status === 'completed' && (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {item.status === 'in-progress' && (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {item.name}
                  </span>
                );
              }
              // Handle roles with timeline and status
              if (item.role) {
                const statusColors = {
                  'Filled': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                  'Hiring': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                  'Planning': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                };
                return (
                  <div key={idx} className={`inline-flex flex-col px-3 py-2 rounded-lg text-sm ${statusColors[item.status] || statusColors['Planning']} border border-current/20`}>
                    <span className="font-semibold">{item.role}</span>
                    <span className="text-xs opacity-75">{item.timeline} • {item.status}</span>
                  </div>
                );
              }
              // Generic object
              return (
                <span key={idx} className="inline-block px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {JSON.stringify(item)}
                </span>
              );
            })}
          </div>
        </div>
      );
    }

    // Render simple arrays
    if (type === 'array') {
      return (
        <div key={field} className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
            {fieldLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {data.map((item, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Render long text (vision statements, etc.)
    if (type === 'longText') {
      return (
        <div key={field} className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
            {fieldLabel}
          </span>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-current/30 pl-4">
            "{data}"
          </p>
        </div>
      );
    }

    // Render currency
    if (type === 'currency') {
      return (
        <div key={field} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
          <span className="text-gray-600 dark:text-gray-400">{fieldLabel}</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{data}</span>
        </div>
      );
    }

    // Render percent
    if (type === 'percent') {
      return (
        <div key={field} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
          <span className="text-gray-600 dark:text-gray-400">{fieldLabel}</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{data}</span>
        </div>
      );
    }

    // Default rendering
    return (
      <div key={field} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
        <span className="text-gray-600 dark:text-gray-400">{fieldLabel}</span>
        <span className="font-medium text-gray-900 dark:text-white">{data}</span>
      </div>
    );
  };

  const renderSectionCard = (sectionKey, sectionData) => {
    const data = sectionData?.data || {};
    const isCompleted = sectionData?.completed;
    const theme = sectionThemes[sectionKey] || sectionThemes.businessOverview;
    const Icon = SectionIcons[sectionKey];
    const hasData = Object.keys(data).length > 0;

    return (
      <div
        key={sectionKey}
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          isCompleted
            ? `${theme.bgLight} ${theme.bgDark} border-2 ${theme.border}`
            : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600'
        }`}
      >
        {/* Gradient Header */}
        <div className={`relative bg-gradient-to-r ${theme.gradient} p-4`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <div className="text-white">{Icon}</div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {sectionNames[sectionKey]}
                </h3>
                <p className="text-white/70 text-xs">
                  {isCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>
            </div>
            {isCompleted && (
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {!hasData ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Add details to this section
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {Object.entries(data).map(([field, value]) => {
                const formattedValue = formatFieldValue(field, value, sectionKey);
                return renderFieldItem(field, formattedValue, sectionKey);
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate completion stats
  const completedSections = Object.values(sections || {}).filter(s => s.completed).length;
  const totalSections = Object.keys(sections || {}).length;

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 rounded-3xl p-8 mb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm mb-4">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white/90 text-sm font-medium">CEO Vision Board</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              {name}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Your roadmap to success — track, measure, and achieve your business goals
            </p>
          </div>

          {/* Progress Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {/* Progress Circle */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 4.4} 440`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{overallProgress}%</span>
                <span className="text-white/60 text-sm">Complete</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white">{completedSections}</div>
                <div className="text-white/60 text-sm">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white">{totalSections - completedSections}</div>
                <div className="text-white/60 text-sm">Remaining</div>
              </div>
              <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white">{totalSections}</div>
                <div className="text-white/60 text-sm">Total Sections</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {Object.entries(sections || {}).map(([key, data]) =>
          renderSectionCard(key, data)
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Powered by <span className="text-primary-600 dark:text-primary-400">VisionBoard Pro</span>
          </span>
        </div>
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          Built for entrepreneurs who execute
        </p>
      </div>
    </div>
  );
};

export default VisualMode;