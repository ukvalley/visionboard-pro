import Card from '../common/Card';
import { formatCurrency, formatNumber } from '../../utils/helpers';

const MetricsCard = ({ title, value, change, changeType, icon, format = 'number' }) => {
  const formatValue = (val) => {
    if (format === 'currency') return formatCurrency(val);
    if (format === 'percent') return `${val}%`;
    return formatNumber(val);
  };

  const changeColorClass = changeType === 'positive'
    ? 'text-green-600 dark:text-green-400'
    : changeType === 'negative'
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-500 dark:text-gray-400';

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {formatValue(value)}
          </p>
          {change !== undefined && (
            <p className={`mt-2 text-sm ${changeColorClass}`}>
              {changeType === 'positive' && '+'}
              {change}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricsCard;