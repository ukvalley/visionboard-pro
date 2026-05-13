import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';

const Step4_SolutionDefinition = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    solutionStatement: product.solutionStatement || '',
    keyBenefits: product.keyBenefits || '',
    differentiation: product.differentiation || '',
    customer: product.targetAudience?.industry || '[customer]',
    problem: product.problemDescription?.substring(0, 50) + '...' || '[problem]'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.solutionStatement?.trim()) {
      newErrors.solutionStatement = 'Solution Statement is required.';
    }
    if (!formData.keyBenefits?.trim()) {
      newErrors.keyBenefits = 'Key Benefits is required.';
    }
    if (!formData.differentiation?.trim()) {
      newErrors.differentiation = 'Differentiation is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ solutionDefinition: formData, ...formData });
  };

  // Generate solution statement template
  const generateStatement = () => {
    const customer = product.targetAudience?.industry || '[customer]';
    const problem = product.problemDescription?.substring(0, 60) || '[problem]';
    return `We help ${customer} solve ${problem} using...`;
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 4: Solution Definition
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Define your solution clearly and how it stands out from competitors.
          </p>
        </div>

        {/* Solution Statement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            One-line Solution Statement
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.solutionStatement}
            onChange={(e) => {
              setFormData({ ...formData, solutionStatement: e.target.value });
              if (errors.solutionStatement) setErrors({ ...errors, solutionStatement: null });
            }}
            placeholder={generateStatement()}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
              errors.solutionStatement ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={2}
            maxLength={200}
          />
          {errors.solutionStatement && (
            <p className="mt-1 text-sm text-red-500">{errors.solutionStatement}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Format: "We help [customer] solve [problem] using [your unique approach]"
          </p>
        </div>

        {/* Key Benefits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Key Benefits
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.keyBenefits}
            onChange={(e) => {
              setFormData({ ...formData, keyBenefits: e.target.value });
              if (errors.keyBenefits) setErrors({ ...errors, keyBenefits: null });
            }}
            placeholder="e.g., Save 5 hours per week, Reduce costs by 40%, Improve accuracy by 99%"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
              errors.keyBenefits ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            maxLength={400}
          />
          {errors.keyBenefits && (
            <p className="mt-1 text-sm text-red-500">{errors.keyBenefits}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Focus on outcomes, not features. Use numbers when possible.
          </p>
        </div>

        {/* Differentiation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Differentiation from Competitors
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.differentiation}
            onChange={(e) => {
              setFormData({ ...formData, differentiation: e.target.value });
              if (errors.differentiation) setErrors({ ...errors, differentiation: null });
            }}
            placeholder="e.g., Unlike complex enterprise tools, we offer simplicity. Unlike free tools, we provide dedicated support."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
              errors.differentiation ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            maxLength={400}
          />
          {errors.differentiation && (
            <p className="mt-1 text-sm text-red-500">{errors.differentiation}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Be specific about why customers should choose you over alternatives.
          </p>
        </div>

        {/* Solution Preview Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h4 className="font-medium text-green-900 dark:text-green-400 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Solution Preview
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Statement:</span>
              <p className="font-medium text-gray-900 dark:text-white mt-1">
                {formData.solutionStatement || 'Your solution statement will appear here...'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Key Benefits:</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1 line-clamp-3">
                  {formData.keyBenefits || '...'}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Differentiation:</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1 line-clamp-3">
                  {formData.differentiation || '...'}
                </p>
              </div>
            </div>
          </div>
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

export default Step4_SolutionDefinition;
