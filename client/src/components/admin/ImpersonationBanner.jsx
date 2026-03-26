import { useAuth } from '../../context/AuthContext';

const ImpersonationBanner = () => {
  const { isImpersonating, impersonation, restoreAdminAccess, user } = useAuth();

  if (!isImpersonating) return null;

  const handleRestore = () => {
    if (window.confirm('Return to your admin account?')) {
      restoreAdminAccess();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm font-medium">
            Viewing as: <strong>{user?.name}</strong>
          </span>
          <span className="text-amber-200 text-sm hidden sm:inline">
            (Admin: {impersonation?.adminName})
          </span>
        </div>
        <button
          onClick={handleRestore}
          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span className="hidden sm:inline">Back to Admin</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;