import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;