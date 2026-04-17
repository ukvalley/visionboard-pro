import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Select from '../../common/Select';

const Step8_BusinessModel = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    revenueModel: product.revenueModel || '',
    pricing: product.pricing || '',
    cac: product.cac || '',
    ltv: product.ltv || ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.revenueModel) {
      newErrors.revenueModel = 'Revenue Model is required.';
    }
    if (!formData.pricing?.trim()) {
      newErrors.pricing = 'Pricing is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ businessModel: formData, ...formData });
  };

  const revenueModelOptions = [
    { value: '', label: 'Select revenue model' },
    { value: 'subscription', label: 'Subscription (SaaS)' },
    { value: 'one-time', label: 'One-time Purchase' },
    { value: 'commission', label: 'Commission/Fee-based' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'usage', label: 'Pay-per-use' },
    { value: 'advertising', label: 'Advertising' },
    { value: 'other', label: 'Other' }
  ];

  const cac = parseFloat(formData.cac) || 0;
  const ltv = parseFloat(formData.ltv) || 0;
  const unitEconomics = ltv > 0 && cac > 0 ? (ltv / cac).toFixed(2) : 0;

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 8: Business Model
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Define how you will make money and your unit economics.
          </p>
        </div>

        {/* Revenue Model */}
        <Select
          label="Revenue Model"
          value={formData.revenueModel}
          onChange={(e) => {
            setFormData({ ...formData, revenueModel: e.target.value });
            if (errors.revenueModel) setErrors({ ...errors, revenueModel: null });
          }}
          options={revenueModelOptions}
          error={errors.revenueModel}
          required
        />

        {/* Pricing */}
        <Input
          label="Pricing Structure"
          value={formData.pricing}
          onChange={(e) => {
            setFormData({ ...formData, pricing: e.target.value });
            if (errors.pricing) setErrors({ ...errors, pricing: null });
          }}
          error={errors.pricing}
          placeholder="e.g., ₹999/month for Pro, ₹499/month for Basic"
          required
          maxLength={200}
        />

        {/* CAC and LTV */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Customer Acquisition Cost (CAC) (₹)"
            type="number"
            value={formData.cac}
            onChange={(e) => setFormData({ ...formData, cac: e.target.value })}
            placeholder="e.g., 500"
            helperText="Cost to acquire one customer."
          />

          <Input
            label="Lifetime Value (LTV) (₹)"
            type="number"
            value={formData.ltv}
            onChange={(e) => setFormData({ ...formData, ltv: e.target.value })}
            placeholder="e.g., 5000"
            helperText="Total revenue from a customer over their lifetime."
          />
        </div>

        {/* Unit Economics Visualization */}
        {(cac > 0 || ltv > 0) && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-3">Unit Economics</h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{cac}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">CAC</p>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{ltv}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">LTV</p>
              </div>
              <div className="text-2xl text-gray-400">=</div>
              <div className={`text-center p-3 rounded-lg ${parseFloat(unitEconomics) >= 3 ? 'bg-green-100 dark:bg-green-900/20' : parseFloat(unitEconomics) >= 1 ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                <p className="text-2xl font-bold">{unitEconomics}x</p>
                <p className="text-sm">LTV:CAC Ratio</p>
              </div>
            </div>
            {parseFloat(unitEconomics) > 0 && (
              <p className={`mt-2 text-sm text-center ${parseFloat(unitEconomics) >= 3 ? 'text-green-600 dark:text-green-400' : parseFloat(unitEconomics) >= 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {parseFloat(unitEconomics) >= 3 ? '✅ Healthy unit economics (target: 3x+)' :
                 parseFloat(unitEconomics) >= 1 ? '⚠️ Break-even or low margin' : '❌ Unsustainable unit economics'}
              </p>
            )}
          </div>
        )}

        {/* Business Model Guidelines */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <h4 className="font-medium text-amber-900 dark:text-amber-400 mb-2">Business Model Guidelines</h4>
          <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
            <li>LTV:CAC ratio should ideally be 3:1 or higher for sustainable growth.</li>
            <li>Choose a pricing model that aligns with customer expectations in your market.</li>
            <li>Consider starting with a lower price and increasing as you add value.</li>
            <li>Document assumptions and validate them with early customers.</li>
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

export default Step8_BusinessModel;
