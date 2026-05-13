import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Select from '../../common/Select';

const Step1_ProblemDefinition = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    problemDescription: product.problemDescription || '',
    whoFacingProblem: product.whoFacingProblem || '',
    frequency: product.frequency || '',
    currentSolutions: product.currentSolutions || '',
    painLevel: product.painLevel || 5
  });
  const [errors, setErrors] = useState({});

  const frequencyOptions = [
    { value: '', label: 'Select frequency' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'occasionally', label: 'Occasionally' },
    { value: 'rarely', label: 'Rarely' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.problemDescription?.trim()) {
      newErrors.problemDescription = 'Problem Description is required.';
    }
    if (!formData.whoFacingProblem?.trim()) {
      newErrors.whoFacingProblem = 'Who is facing this problem is required.';
    }
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required.';
    }
    if (!formData.currentSolutions?.trim()) {
      newErrors.currentSolutions = 'Current Solutions is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ problemDefinition: formData, ...formData });
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 1: Problem Definition
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Clearly define the problem you are solving before building anything.
          </p>
        </div>

        {/* Problem Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What problem are you solving?
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.problemDescription}
            onChange={(e) => {
              setFormData({ ...formData, problemDescription: e.target.value });
              if (errors.problemDescription) setErrors({ ...errors, problemDescription: null });
            }}
            placeholder="e.g., Small businesses struggle to track their finances because existing tools are too complex and expensive."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
              errors.problemDescription ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            maxLength={500}
          />
          {errors.problemDescription && (
            <p className="mt-1 text-sm text-red-500">{errors.problemDescription}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: Be specific. "People are busy" is too vague. "Working parents spend 2 hours daily planning meals" is better.
          </p>
        </div>

        {/* Who is facing the problem */}
        <div>
          <Input
            label="Who is facing this problem?"
            value={formData.whoFacingProblem}
            onChange={(e) => {
              setFormData({ ...formData, whoFacingProblem: e.target.value });
              if (errors.whoFacingProblem) setErrors({ ...errors, whoFacingProblem: null });
            }}
            error={errors.whoFacingProblem}
            placeholder="e.g., Freelance designers with 2-5 years of experience"
            required
            maxLength={200}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: Define your target user as specifically as possible.
          </p>
        </div>

        {/* Frequency */}
        <div>
          <Select
            label="How frequently does this problem occur?"
            value={formData.frequency}
            onChange={(e) => {
              setFormData({ ...formData, frequency: e.target.value });
              if (errors.frequency) setErrors({ ...errors, frequency: null });
            }}
            options={frequencyOptions}
            error={errors.frequency}
            required
          />
        </div>

        {/* Current Solutions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What solutions are people using today?
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.currentSolutions}
            onChange={(e) => {
              setFormData({ ...formData, currentSolutions: e.target.value });
              if (errors.currentSolutions) setErrors({ ...errors, currentSolutions: null });
            }}
            placeholder="e.g., Excel spreadsheets, manual tracking, expensive accounting software"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
              errors.currentSolutions ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={2}
            maxLength={300}
          />
          {errors.currentSolutions && (
            <p className="mt-1 text-sm text-red-500">{errors.currentSolutions}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Understanding current solutions helps identify gaps and opportunities.
          </p>
        </div>

        {/* Pain Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pain Level (How badly do users want this problem solved?)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.painLevel}
              onChange={(e) => setFormData({ ...formData, painLevel: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 w-8 text-center">
              {formData.painLevel}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Minor inconvenience</span>
            <span>Critical pain point</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {formData.painLevel >= 8 ? '🔥 High pain level - Great signal for product-market fit.' :
             formData.painLevel >= 5 ? '⚡ Moderate pain level - Need strong value proposition.' :
             '⚠️ Low pain level - Consider if this is worth solving.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onBack} disabled>
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

export default Step1_ProblemDefinition;
