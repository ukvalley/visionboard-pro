import { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Select from '../../common/Select';

const Step3_ProblemValidation = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    interviewsConducted: product.interviewsConducted || '',
    keyInsights: product.keyInsights || '',
    currentlyPaying: product.currentlyPaying || '',
    willingnessToPay: product.willingnessToPay || '',
    validationScore: product.validationScore || 0
  });
  const [errors, setErrors] = useState({});

  // Calculate validation score
  useEffect(() => {
    let score = 0;

    // Interviews conducted (max 30 points)
    const interviews = parseInt(formData.interviewsConducted) || 0;
    if (interviews >= 10) score += 30;
    else if (interviews >= 5) score += 20;
    else if (interviews >= 1) score += 10;

    // Currently paying (max 30 points)
    if (formData.currentlyPaying === 'yes') score += 30;
    else if (formData.currentlyPaying === 'trying') score += 15;

    // Willingness to pay (max 40 points)
    if (formData.willingnessToPay?.includes('paid')) score += 40;
    else if (formData.willingnessToPay?.includes('premium')) score += 25;
    else if (formData.willingnessToPay) score += 10;

    setFormData(prev => ({ ...prev, validationScore: score }));
  }, [formData.interviewsConducted, formData.currentlyPaying, formData.willingnessToPay]);

  const validate = () => {
    const newErrors = {};
    if (!formData.interviewsConducted) {
      newErrors.interviewsConducted = 'Number of interviews is required.';
    }
    if (!formData.keyInsights?.trim()) {
      newErrors.keyInsights = 'Key Insights is required.';
    }
    if (!formData.currentlyPaying) {
      newErrors.currentlyPaying = 'This field is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ problemValidation: formData, ...formData });
  };

  const getValidationStrength = (score) => {
    if (score >= 80) return { label: 'Strong', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' };
    if (score >= 50) return { label: 'Moderate', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { label: 'Weak', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' };
  };

  const strength = getValidationStrength(formData.validationScore);

  const payingOptions = [
    { value: '', label: 'Select an option' },
    { value: 'yes', label: 'Yes, they are paying for solutions' },
    { value: 'trying', label: 'They are trying free alternatives' },
    { value: 'no', label: 'No, they are not actively solving it' }
  ];

  const willingnessOptions = [
    { value: '', label: 'Select willingness to pay' },
    { value: 'would-pay', label: 'Would definitely pay' },
    { value: 'might-pay', label: 'Might pay if it solves their problem' },
    { value: 'premium', label: 'Would pay premium for better solution' },
    { value: 'free-only', label: 'Prefer free solutions only' }
  ];

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 3: Problem Validation
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Validate that the problem is real and worth solving before building.
          </p>
        </div>

        {/* Validation Score Alert */}
        <div className={`p-4 rounded-lg ${strength.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Validation Score: {formData.validationScore}/100</p>
              <p className="text-sm opacity-80">Signal Strength: {strength.label}</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center">
              <span className="text-lg font-bold">{formData.validationScore}</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-current opacity-20 rounded-full">
            <div
              className="h-full bg-current rounded-full transition-all duration-500"
              style={{ width: `${formData.validationScore}%` }}
            />
          </div>
        </div>

        {formData.validationScore < 50 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            ⚠️ Warning: Your validation signal is weak. Consider conducting more interviews before proceeding to build.
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            label="Number of Interviews Conducted"
            type="number"
            value={formData.interviewsConducted}
            onChange={(e) => {
              setFormData({ ...formData, interviewsConducted: e.target.value });
              if (errors.interviewsConducted) setErrors({ ...errors, interviewsConducted: null });
            }}
            error={errors.interviewsConducted}
            placeholder="e.g., 10"
            required
            helperText="Talk to at least 10 potential users for meaningful insights."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Key Insights from Users
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.keyInsights}
              onChange={(e) => {
                setFormData({ ...formData, keyInsights: e.target.value });
                if (errors.keyInsights) setErrors({ ...errors, keyInsights: null });
              }}
              placeholder="e.g., 8 out of 10 users said they would pay for a simpler solution. Most struggle with existing tools being too complex."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
                errors.keyInsights ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              maxLength={500}
            />
            {errors.keyInsights && (
              <p className="mt-1 text-sm text-red-500">{errors.keyInsights}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              💡 Document specific quotes and patterns you observed.
            </p>
          </div>

          <Select
            label="Are users currently paying to solve this problem?"
            value={formData.currentlyPaying}
            onChange={(e) => {
              setFormData({ ...formData, currentlyPaying: e.target.value });
              if (errors.currentlyPaying) setErrors({ ...errors, currentlyPaying: null });
            }}
            options={payingOptions}
            error={errors.currentlyPaying}
            required
          />

          <Select
            label="Willingness to Pay"
            value={formData.willingnessToPay}
            onChange={(e) => setFormData({ ...formData, willingnessToPay: e.target.value })}
            options={willingnessOptions}
          />
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">Validation Guidelines</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Conduct at least 10 interviews for statistical relevance.</li>
            <li>Ask open-ended questions, not leading ones.</li>
            <li>Look for evidence of current spending or effort to solve the problem.</li>
            <li>If users say they "would pay," ask how much specifically.</li>
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

export default Step3_ProblemValidation;
