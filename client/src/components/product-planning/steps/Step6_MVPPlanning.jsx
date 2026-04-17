import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';

const Step6_MVPPlanning = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    mustHaveFeatures: product.mustHaveFeatures || '',
    goodToHaveFeatures: product.goodToHaveFeatures || '',
    futureFeatures: product.futureFeatures || ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.mustHaveFeatures?.trim()) {
      newErrors.mustHaveFeatures = 'Must-have Features is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ mvpPlanning: formData, ...formData });
  };

  // Feature prioritization matrix data (for display)
  const featureMatrix = [
    { name: 'Core Feature', impact: 'High', effort: 'Medium', priority: 'Must-have' },
    { name: 'Nice-to-have', impact: 'Medium', effort: 'Low', priority: 'Good-to-have' },
    { name: 'Advanced', impact: 'Low', effort: 'High', priority: 'Future' },
  ];

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 6: MVP Planning
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Define the minimum features needed to solve the core problem.
          </p>
        </div>

        {/* Feature Priority Matrix */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Feature Prioritization Matrix</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded text-center">
              <span className="font-medium text-red-700 dark:text-red-400">Must-have</span>
              <p className="text-xs text-red-600 dark:text-red-300">High Impact, Low Effort</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded text-center">
              <span className="font-medium text-yellow-700 dark:text-yellow-400">Good-to-have</span>
              <p className="text-xs text-yellow-600 dark:text-yellow-300">Medium Impact</p>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Future</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Low Impact, High Effort</p>
            </div>
          </div>
        </div>

        {/* Must-have Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Must-have Features (Core MVP)
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.mustHaveFeatures}
            onChange={(e) => {
              setFormData({ ...formData, mustHaveFeatures: e.target.value });
              if (errors.mustHaveFeatures) setErrors({ ...errors, mustHaveFeatures: null });
            }}
            placeholder="e.g., User authentication, Dashboard, Basic reporting, Payment integration"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
              errors.mustHaveFeatures ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            maxLength={500}
          />
          {errors.mustHaveFeatures && (
            <p className="mt-1 text-sm text-red-500">{errors.mustHaveFeatures}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 List only the features absolutely necessary to solve the core problem. Aim for 3-5 features.
          </p>
        </div>

        {/* Good-to-have Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Good-to-have Features (Phase 2)
          </label>
          <textarea
            value={formData.goodToHaveFeatures}
            onChange={(e) => setFormData({ ...formData, goodToHaveFeatures: e.target.value })}
            placeholder="e.g., Advanced analytics, Export to PDF, Email notifications, Mobile app"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600"
            rows={3}
            maxLength={400}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Features that enhance the product but aren't critical for launch.
          </p>
        </div>

        {/* Future Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Future Features (Roadmap)
          </label>
          <textarea
            value={formData.futureFeatures}
            onChange={(e) => setFormData({ ...formData, futureFeatures: e.target.value })}
            placeholder="e.g., AI-powered insights, API access, White-label option, Enterprise features"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600"
            rows={3}
            maxLength={400}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💡 Ideas for future versions. These help stakeholders see the long-term vision.
          </p>
        </div>

        {/* MVP Guidelines */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <h4 className="font-medium text-amber-900 dark:text-amber-400 mb-2">MVP Guidelines</h4>
          <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
            <li>Focus on solving ONE problem really well.</li>
            <li>Build the smallest thing that delivers value.</li>
            <li>Don't build features users haven't asked for.</li>
            <li>Launch fast and iterate based on feedback.</li>
            <li>Remember: "If you're not embarrassed by your MVP, you've launched too late."</li>
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

export default Step6_MVPPlanning;
