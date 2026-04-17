import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Select from '../../common/Select';

const Step5_MarketValidation = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    landingPageCreated: product.landingPageCreated || '',
    adSpend: product.adSpend || '',
    ctr: product.ctr || '',
    leadsCollected: product.leadsCollected || '',
    preOrders: product.preOrders || '',
    validationStrength: product.validationStrength || 0
  });
  const [errors, setErrors] = useState({});

  const calculateStrength = () => {
    let strength = 0;
    if (formData.landingPageCreated === 'yes') strength += 20;
    if (parseFloat(formData.ctr) > 2) strength += 30;
    else if (parseFloat(formData.ctr) > 1) strength += 15;
    if (parseInt(formData.leadsCollected) > 50) strength += 25;
    else if (parseInt(formData.leadsCollected) > 10) strength += 10;
    if (parseInt(formData.preOrders) > 0) strength += 25;
    return Math.min(strength, 100);
  };

  const strength = calculateStrength();
  const strengthLabel = strength >= 70 ? 'Strong' : strength >= 40 ? 'Moderate' : 'Weak';
  const strengthColor = strength >= 70 ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' :
                        strength >= 40 ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';

  const validate = () => {
    const newErrors = {};
    if (!formData.landingPageCreated) {
      newErrors.landingPageCreated = 'This field is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ marketValidation: { ...formData, validationStrength: strength }, ...formData, validationStrength: strength });
  };

  const yesNoOptions = [
    { value: '', label: 'Select an option' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 5: Market Validation
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Test market demand before building your product.
          </p>
        </div>

        {/* Validation Strength Indicator */}
        <div className={`p-4 rounded-lg ${strengthColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Market Validation Strength: {strength}%</p>
              <p className="text-sm opacity-80">{strengthLabel} market signal</p>
            </div>
          </div>
          <div className="mt-2 h-2 bg-current opacity-20 rounded-full">
            <div className="h-full bg-current rounded-full transition-all duration-500" style={{ width: `${strength}%` }} />
          </div>
        </div>

        {strength < 40 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            ⚠️ Warning: You are building without strong market validation. Consider running ads or collecting leads first.
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <Select
            label="Have you created a landing page?"
            value={formData.landingPageCreated}
            onChange={(e) => {
              setFormData({ ...formData, landingPageCreated: e.target.value });
              if (errors.landingPageCreated) setErrors({ ...errors, landingPageCreated: null });
            }}
            options={yesNoOptions}
            error={errors.landingPageCreated}
            required
          />

          <Input
            label="Ad Spend (₹)"
            type="number"
            value={formData.adSpend}
            onChange={(e) => setFormData({ ...formData, adSpend: e.target.value })}
            placeholder="e.g., 5000"
            helperText="Total spent on ads to validate interest."
          />

          <Input
            label="Click-Through Rate (CTR %)"
            type="number"
            step="0.1"
            value={formData.ctr}
            onChange={(e) => setFormData({ ...formData, ctr: e.target.value })}
            placeholder="e.g., 2.5"
            helperText="CTR above 2% is considered good for validation."
          />

          <Input
            label="Leads Collected"
            type="number"
            value={formData.leadsCollected}
            onChange={(e) => setFormData({ ...formData, leadsCollected: e.target.value })}
            placeholder="e.g., 25"
            helperText="Email signups from interested users."
          />

          <Input
            label="Pre-orders / Signups"
            type="number"
            value={formData.preOrders}
            onChange={(e) => setFormData({ ...formData, preOrders: e.target.value })}
            placeholder="e.g., 5"
            helperText="Users who committed to pay or signed up for early access."
          />
        </div>

        {/* Validation Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">Market Validation Tips</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Create a simple landing page with a "Coming Soon" or "Join Waitlist" CTA.</li>
            <li>Run targeted ads to your defined audience for 1-2 weeks.</li>
            <li>CTR above 2% indicates genuine interest.</li>
            <li>Collect emails and follow up with a survey or interview request.</li>
            <li>Pre-orders are the strongest validation signal.</li>
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

export default Step5_MarketValidation;
