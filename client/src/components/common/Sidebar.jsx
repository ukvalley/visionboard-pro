import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { classNames, getInitials } from '../../utils/helpers';
import visionBoardService from '../../services/visionBoardService';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [activeVisionBoard, setActiveVisionBoard] = useState(null);
  const [visionBoards, setVisionBoards] = useState([]);
  const [showVisionBoardDropdown, setShowVisionBoardDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisionBoards();
  }, []);

  useEffect(() => {
    // Extract vision board ID from URL if present
    const match = location.pathname.match(/\/visionboards\/([^/]+)/);
    if (match) {
      const vbId = match[1];
      if (vbId !== 'new' && !visionBoards.find(vb => vb._id === vbId)) {
        // Fetch the specific vision board if not in list
      }
      setActiveVisionBoard(vbId);
    }
  }, [location.pathname, visionBoards]);

  const fetchVisionBoards = async () => {
    try {
      const response = await visionBoardService.getAll();
      setVisionBoards(response.data || []);
      if (response.data?.length > 0 && !activeVisionBoard) {
        setActiveVisionBoard(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch vision boards:', error);
    }
  };

  // Core navigation items (always visible)
  const coreNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon }
  ];

  // Module navigation items (require active vision board)
  const moduleNavigation = activeVisionBoard ? [
    {
      name: 'Vision Board',
      href: `/visionboards/${activeVisionBoard}`,
      icon: VisionBoardIcon,
      category: 'Planning'
    },
    {
      name: 'Strategy Sheet',
      href: `/visionboards/${activeVisionBoard}?tab=strategy`,
      icon: StrategyIcon,
      category: 'Planning'
    },
    {
      name: 'Target Tracker',
      href: `/visionboards/${activeVisionBoard}/modules?module=targets`,
      icon: ChartIcon,
      category: 'Execution'
    },
    {
      name: 'Resource Management',
      href: `/visionboards/${activeVisionBoard}/modules?module=resources`,
      icon: TeamIcon,
      category: 'People'
    },
    {
      name: 'Execution & Risk',
      href: `/visionboards/${activeVisionBoard}/modules?module=execution`,
      icon: AlertIcon,
      category: 'Execution'
    },
    {
      name: 'Financial Insights',
      href: `/visionboards/${activeVisionBoard}/modules?module=financial`,
      icon: DollarIcon,
      category: 'Analytics'
    },
    {
      name: 'Collaboration Hub',
      href: `/visionboards/${activeVisionBoard}/modules?module=collaboration`,
      icon: UsersIcon,
      category: 'People'
    }
  ] : [];

  // Admin navigation
  const adminNavigation = user?.role === 'admin' ? [
    { name: 'Admin Panel', href: '/admin', icon: AdminIcon },
    { name: 'User Management', href: '/admin/users', icon: UserManageIcon }
  ] : [];

  // Settings
  const settingsNavigation = [
    { name: 'Settings', href: '/settings', icon: SettingsIcon }
  ];

  const handleVisionBoardSelect = (vbId) => {
    setActiveVisionBoard(vbId);
    setShowVisionBoardDropdown(false);
    navigate(`/visionboards/${vbId}`);
  };

  const renderNavSection = (items, title = null) => (
    <div className="space-y-1">
      {title && !collapsed && (
        <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          {title}
        </p>
      )}
      {items.map((item) => {
        // More precise active state checking for query parameter URLs
        let isActive = false;
        if (item.href.includes('?')) {
          // For URLs with query params, match exact URL
          isActive = location.pathname + location.search === item.href;
        } else {
          // For URLs without query params, only match if no query params or tab=vision
          const currentTab = new URLSearchParams(location.search).get('tab');
          isActive = location.pathname === item.href && (!currentTab || currentTab === 'vision');
        }
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={classNames(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
              isActive
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon className={classNames('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300')} />
            {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <aside
      className={classNames(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-72',
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-600 to-indigo-600">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-lg">VisionBoard</span>
              <span className="text-white/70 text-xs block -mt-1">Pro</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className={classNames('w-5 h-5 transition-transform', collapsed && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Vision Board Selector */}
      {!collapsed && visionBoards.length > 0 && (
        <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">Active Vision Board</p>
          <div className="relative">
            <button
              onClick={() => setShowVisionBoardDropdown(!showVisionBoardDropdown)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {visionBoards.find(vb => vb._id === activeVisionBoard)?.name?.charAt(0) || 'V'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {visionBoards.find(vb => vb._id === activeVisionBoard)?.name || 'Select Board'}
                </span>
              </div>
              <svg className={classNames('w-4 h-4 text-gray-400 transition-transform', showVisionBoardDropdown && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showVisionBoardDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                {visionBoards.map(vb => (
                  <button
                    key={vb._id}
                    onClick={() => handleVisionBoardSelect(vb._id)}
                    className={classNames(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                      vb._id === activeVisionBoard && 'bg-primary-50 dark:bg-primary-900/20'
                    )}
                  >
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{vb.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{vb.name}</span>
                    {vb._id === activeVisionBoard && (
                      <svg className="w-4 h-4 text-primary-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <NavLink
                    to="/visionboards/new"
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-primary-600 dark:text-primary-400"
                    onClick={() => setShowVisionBoardDropdown(false)}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">Create New Board</span>
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Core */}
        {renderNavSection(coreNavigation)}

        {/* Modules (grouped by category) */}
        {moduleNavigation.length > 0 && (
          <>
            {!collapsed ? (
              <>
                {renderNavSection(
                  moduleNavigation.filter(m => m.category === 'Planning'),
                  'Planning'
                )}
                {renderNavSection(
                  moduleNavigation.filter(m => m.category === 'Execution'),
                  'Execution'
                )}
                {renderNavSection(
                  moduleNavigation.filter(m => m.category === 'People'),
                  'People'
                )}
                {renderNavSection(
                  moduleNavigation.filter(m => m.category === 'Analytics'),
                  'Analytics'
                )}
              </>
            ) : (
              <div className="space-y-1">
                {moduleNavigation.map((item) => {
                  // More precise active state checking for query parameter URLs
                  let isActive = false;
                  if (item.href.includes('?')) {
                    isActive = location.pathname + location.search === item.href;
                  } else {
                    const currentTab = new URLSearchParams(location.search).get('tab');
                    isActive = location.pathname === item.href && (!currentTab || currentTab === 'vision');
                  }
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        'flex items-center justify-center p-2.5 rounded-xl transition-all group',
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      )}
                      title={item.name}
                    >
                      <item.icon className="w-5 h-5" />
                    </NavLink>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Admin */}
        {adminNavigation.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            {renderNavSection(adminNavigation, collapsed ? null : 'Administration')}
          </div>
        )}
      </nav>

      {/* Quick Stats */}
      {!collapsed && activeVisionBoard && (
        <div className="px-4 py-3 mx-3 mb-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Module Status</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">8</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Modules</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">Active</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
            </div>
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      <div className="px-3 py-2">
        <button
          onClick={toggleTheme}
          className={classNames(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all',
            'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          )}
        >
          {isDark ? (
            <svg className="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          {!collapsed && <span className="font-medium text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>

      {/* Settings */}
      <div className="px-3 pb-2">
        {renderNavSection(settingsNavigation)}
      </div>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
        <div className={classNames('flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <span className="text-sm font-bold text-white">
              {getInitials(user?.name)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

// Icon Components
const HomeIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const VisionBoardIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
);

const StrategyIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const TargetIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChartIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TeamIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AlertIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const DollarIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AdminIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserManageIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const SettingsIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default Sidebar;