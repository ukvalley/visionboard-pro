import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { formatCurrency, formatNumber, formatDate } from '../../utils/helpers';
import api from '../../services/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { overview, userGrowth, completionDistribution } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Platform analytics and user management
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={overview?.totalUsers || 0}
          change={`+${overview?.recentSignups || 0} this week`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Active Users"
          value={overview?.activeUsers || 0}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Vision Boards"
          value={overview?.totalVisionBoards || 0}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          }
        />
        <StatsCard
          title="Avg Progress"
          value={`${overview?.averageProgress || 0}%`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth (Last 6 Months)
          </h3>
          <div className="space-y-3">
            {(userGrowth || []).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-24">
                  {item._id?.month}/{item._id?.year}
                </span>
                <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(item.count * 10, 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!userGrowth || userGrowth.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No user growth data available
              </p>
            )}
          </div>
        </Card>

        {/* Completion Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vision Board Completion
          </h3>
          <div className="space-y-4">
            {(completionDistribution || []).map((item, index) => {
              let label = '';
              let color = '';
              if (item._id === 'other') {
                label = 'Not Started';
                color = 'bg-gray-400';
              } else if (item._id >= 100) {
                label = '100% Complete';
                color = 'bg-green-500';
              } else if (item._id >= 75) {
                label = '75-99%';
                color = 'bg-primary-500';
              } else if (item._id >= 50) {
                label = '50-74%';
                color = 'bg-yellow-500';
              } else if (item._id >= 25) {
                label = '25-49%';
                color = 'bg-orange-500';
              } else {
                label = '0-24%';
                color = 'bg-red-500';
              }
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                    {label}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full flex items-center justify-end pr-2`}
                      style={{ width: `${Math.min(item.count * 5, 100)}%` }}
                    >
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!completionDistribution || completionDistribution.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No completion data available
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Platform Health
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Active Vision Boards</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {overview?.activeVisionBoards || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total Monthly Updates</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {overview?.totalMonthlyUpdates || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Admin Users</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {overview?.adminUsers || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">New Users (7 days)</span>
              <span className="font-medium text-green-600">
                +{overview?.recentSignups || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Active Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {overview?.totalUsers > 0
                  ? Math.round((overview?.activeUsers / overview?.totalUsers) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/admin/users'}>
              Manage Users
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/admin/visionboards'}>
              View All Boards
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, change, icon }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">{change}</p>
        )}
      </div>
      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg">
        {icon}
      </div>
    </div>
  </Card>
);

export default AdminDashboard;