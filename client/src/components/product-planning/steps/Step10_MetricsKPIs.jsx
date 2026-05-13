import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import ProgressBar from '../../common/ProgressBar';

const Step10_MetricsKPIs = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    conversionRate: product.conversionRate || '',
    retentionRate: product.retentionRate || '',
    revenueTarget: product.revenueTarget || '',
    growthTarget: product.growthTarget || '',
    otherMetrics: product.otherMetrics || ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.conversionRate && !formData.revenueTarget) {
      newErrors.general = 'Please set at least one key metric (Conversion Rate or Revenue Target).';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ metrics: formData, ...formData });
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 10: Metrics & KPIs
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Define the key metrics that will measure your product's success.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Conversion Rate */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Conversion Rate (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={formData.conversionRate}
                onChange={(e) => setFormData({ ...formData, conversionRate: e.target.value })}
                placeholder="e.g., 2.5"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Industry average: 2-5% for SaaS
            </p>
          </div>

          {/* Retention Rate */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Retention Rate (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={formData.retentionRate}
                onChange={(e) => setFormData({ ...formData, retentionRate: e.target.value })}
                placeholder="e.g., 80"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              % of users retained after 30 days
            </p>
          </div>

          {/* Revenue Target */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Revenue Target (₹)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={formData.revenueTarget}
                onChange={(e) => setFormData({ ...formData, revenueTarget: e.target.value })}
                placeholder="e.g., 100000"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Monthly recurring revenue goal
            </p>
          </div>

          {/* Growth Target */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Growth Target (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={formData.growthTarget}
                onChange={(e) => setFormData({ ...formData, growthTarget: e.target.value })}
                placeholder="e.g., 15"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Month-over-month growth rate
            </p>
          </div>
        </div>

        {/* Other Metrics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Other Important Metrics
          </label>
          <textarea
            value={formData.otherMetrics}
            onChange={(e) => setFormData({ ...formData, otherMetrics: e.target.value })}
            placeholder="e.g., NPS score > 40, Support response time < 2 hours, Daily active users > 100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600"
            rows={3}
            maxLength={300}
          />
        </div>

        {/* Metrics Dashboard Preview */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
          <h4 className="font-medium text-indigo-900 dark:text-indigo-400 mb-4">Metrics Dashboard Preview</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formData.conversionRate || '--'}%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Retention Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formData.retentionRate || '--'}%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Revenue Target</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹{formData.revenueTarget ? parseInt(formData.revenueTarget).toLocaleString() : '--'}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Growth Target</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formData.growthTarget || '--'}%</p>
            </div>
          </div>
        </div>

        {/* Metrics Guidelines */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h4 className="font-medium text-green-900 dark:text-green-400 mb-2">Success Metrics Guidelines</h4>
          <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 list-disc list-inside">
            <li>Track metrics weekly from day one of your launch.</li>
            <li>Focus on leading indicators (activation) not just lagging ones (revenue).</li>
            <li>Set realistic targets based on industry benchmarks.</li>
            <li>Review and adjust targets based on actual performance.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Complete Planning
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Step10_MetricsKPIs;
