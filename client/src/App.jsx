import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/common/Sidebar';

// Auth Components (loaded immediately for login/register pages)
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Lazy load pages for code-splitting
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VisionBoards = lazy(() => import('./pages/VisionBoards'));
const VisionBoardDetail = lazy(() => import('./pages/VisionBoardDetail'));
const Progress = lazy(() => import('./pages/Progress'));
const Admin = lazy(() => import('./pages/Admin'));
const Modules = lazy(() => import('./pages/Modules'));

// Lazy load heavier components
const VisionBoardCreator = lazy(() => import('./components/visionboard/VisionBoardCreator'));
const MonthlyUpdate = lazy(() => import('./components/progress/MonthlyUpdate'));
const Settings = lazy(() => import('./components/settings/Settings'));
const UserManagement = lazy(() => import('./components/admin/UserManagement'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Suspense wrapper for lazy components
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

// Layout Component
const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-72 p-6 md:p-8 transition-all duration-300 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

// User Management Page Component
const UserManagementPage = () => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <UserManagement />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SuspenseWrapper><Home /></SuspenseWrapper>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><Dashboard /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/visionboards"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><VisionBoards /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/visionboards/new"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><VisionBoardCreator /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/visionboards/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><VisionBoardDetail /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><Progress /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress/:id/update"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><MonthlyUpdate /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><Settings /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AppLayout>
                    <SuspenseWrapper><Admin /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AppLayout>
                    <SuspenseWrapper><UserManagementPage /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/visionboards/:id/modules"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SuspenseWrapper><Modules /></SuspenseWrapper>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;