import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/helpers';

const ComparisonChart = ({ visionBoardId, targets }) => {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, [visionBoardId]);

  const fetchComparison = async () => {
    try {
      // This would normally call the API
      // For now, we'll use mock data
      setComparisonData([]);
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (comparisonData.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Add monthly updates to see comparison charts
        </p>
      </Card>
    );
  }

  const maxRevenue = Math.max(
    ...comparisonData.map(d => Math.max(d.actual.revenue, d.target.revenue)),
    targets?.annualRevenue / 12 || 0
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Actual vs Target
      </h3>

      {/* Simple Bar Chart */}
      <div className="space-y-4">
        {comparisonData.slice(-6).map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {data.month} {data.year}
              </span>
              <span className={data.variance.revenue >= 0 ? 'text-green-600' : 'text-red-600'}>
                {data.variance.revenue >= 0 ? '+' : ''}{formatCurrency(data.variance.revenue)}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-12">Actual</span>
                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(data.actual.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 w-20 text-right">
                  {formatCurrency(data.actual.revenue)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-12">Target</span>
                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-300 dark:bg-gray-600 rounded-full"
                    style={{ width: `${(data.target.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 w-20 text-right">
                  {formatCurrency(data.target.revenue)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Target</span>
        </div>
      </div>
    </Card>
  );
};

export default ComparisonChart;