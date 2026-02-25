import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { formatDate, formatNumber } from '../../utils/helpers';
import api from '../../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await api.get('/admin/analytics', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Platform performance metrics
          </p>
        </div>
        <select
          className="input max-w-xs"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Users"
          value={formatNumber(overview?.totalUsers || 0)}
        />
        <MetricCard
          label="Active Users"
          value={formatNumber(overview?.activeUsers || 0)}
        />
        <MetricCard
          label="Vision Boards"
          value={formatNumber(overview?.totalVisionBoards || 0)}
        />
        <MetricCard
          label="Avg Progress"
          value={`${overview?.averageProgress || 0}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <div className="h-64 flex items-end gap-2">
            {(userGrowth || []).map((item, index) => {
              const maxCount = Math.max(...(userGrowth || []).map(u => u.count), 1);
              const height = (item.count / maxCount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-500 rounded-t-lg"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {item._id?.month}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Completion Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completion Distribution
          </h3>
          <div className="space-y-4">
            {(completionDistribution || []).map((item, index) => {
              const total = (completionDistribution || []).reduce((sum, i) => sum + i.count, 0);
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-600 dark:text-gray-400">
                    {item._id === 'other' ? '0%' : `${item._id}%`}
                  </span>
                  <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-sm text-gray-900 dark:text-white text-right">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <Card>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
      {value}
    </p>
  </Card>
);

export default Analytics;