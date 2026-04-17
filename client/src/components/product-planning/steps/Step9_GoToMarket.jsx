import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';

const Step9_GoToMarket = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    targetChannels: product.targetChannels || [],
    first100UsersPlan: product.first100UsersPlan || '',
    salesFunnel: product.salesFunnel || '',
    budgetAllocation: product.budgetAllocation || ''
  });
  const [errors, setErrors] = useState({});
  const [newChannel, setNewChannel] = useState('');

  const channels = [
    'LinkedIn', 'Facebook Ads', 'Google Ads', 'Instagram', 'Twitter/X',
    'WhatsApp', 'Email Marketing', 'Content Marketing', 'SEO',
    'Referrals', 'Partnerships', 'Events', 'Cold Outreach'
  ];

  const validate = () => {
    const newErrors = {};
    if (formData.targetChannels.length === 0) {
      newErrors.targetChannels = 'At least one target channel is required.';
    }
    if (!formData.first100UsersPlan?.trim()) {
      newErrors.first100UsersPlan = 'First 100 users plan is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ goToMarket: formData, ...formData });
  };

  const toggleChannel = (channel) => {
    setFormData(prev => ({
      ...prev,
      targetChannels: prev.targetChannels.includes(channel)
        ? prev.targetChannels.filter(c => c !== channel)
        : [...prev.targetChannels, channel]
    }));
    if (errors.targetChannels) setErrors({ ...errors, targetChannels: null });
  };

  const addCustomChannel = () => {
    if (newChannel.trim() && !formData.targetChannels.includes(newChannel.trim())) {
      setFormData(prev => ({
        ...prev,
        targetChannels: [...prev.targetChannels, newChannel.trim()]
      }));
      setNewChannel('');
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 9: Go-To-Market Strategy
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Plan how you will acquire your first customers and scale.
          </p>
        </div>

        {/* Target Channels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Channels
            <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {channels.map(channel => (
              <button
                key={channel}
                onClick={() => toggleChannel(channel)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  formData.targetChannels.includes(channel)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-500'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
          {errors.targetChannels && (
            <p className="mt-1 text-sm text-red-500">{errors.targetChannels}</p>
          )}

          {/* Add custom channel */}
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Add custom channel..."
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomChannel()}
            />
            <Button variant="secondary" size="sm" onClick={addCustomChannel}>
              Add
            </Button>
          </div>
        </div>

        {/* First 100 Users Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Plan to Get First 100 Users
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.first100UsersPlan}
            onChange={(e) => {
              setFormData({ ...formData, first100UsersPlan: e.target.value });
              if (errors.first100UsersPlan) setErrors({ ...errors, first100UsersPlan: null });
            }}
            placeholder="e.g., Week 1-2: Launch to personal network (20 users). Week 3-4: Post in 5 relevant LinkedIn groups (30 users). Week 5-6: Run small ad campaign (50 users)."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
              errors.first100UsersPlan ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            maxLength={500}
          />
          {errors.first100UsersPlan && (
            <p className="mt-1 text-sm text-red-500">{errors.first100UsersPlan}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Be specific with timelines and expected results.
          </p>
        </div>

        {/* Sales Funnel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sales Funnel Steps
          </label>
          <textarea
            value={formData.salesFunnel}
            onChange={(e) => setFormData({ ...formData, salesFunnel: e.target.value })}
            placeholder="e.g., 1. Landing page visit → 2. Free trial signup → 3. Onboarding → 4. Paid conversion"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600"
            rows={3}
            maxLength={400}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Map out the customer journey from awareness to purchase.
          </p>
        </div>

        {/* Budget Allocation */}
        <Input
          label="Budget Allocation"
          value={formData.budgetAllocation}
          onChange={(e) => setFormData({ ...formData, budgetAllocation: e.target.value })}
          placeholder="e.g., ₹10,000 - ₹5,000 ads, ₹3,000 content, ₹2,000 tools"
          maxLength={200}
        />

        {/* GTM Strategy Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">GTM Strategy Tips</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Focus on 2-3 channels initially rather than spreading thin.</li>
            <li>Your first 100 users are crucial for feedback and testimonials.</li>
            <li>Document what works and double down on it.</li>
            <li>Don't spend on paid ads until you've validated organic channels.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save & Continue
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Step9_GoToMarket;
