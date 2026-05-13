import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';

const Step2_TargetAudience = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    industry: product.industry || '',
    ageRange: product.ageRange || '',
    incomeLevel: product.incomeLevel || '',
    location: product.location || '',
    behaviorPatterns: product.behaviorPatterns || '',
    dailyWorkflow: product.dailyWorkflow || '',
    buyingPower: product.buyingPower || '',
    keyFrustrations: product.keyFrustrations || ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.industry?.trim()) {
      newErrors.industry = 'Industry is required.';
    }
    if (!formData.behaviorPatterns?.trim()) {
      newErrors.behaviorPatterns = 'Behaviour Patterns is required.';
    }
    if (!formData.keyFrustrations?.trim()) {
      newErrors.keyFrustrations = 'Key Frustrations is required.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ targetAudience: formData, ...formData });
  };

  // Generate persona card preview
  const getPersonaPreview = () => ({
    industry: formData.industry || 'Industry',
    ageRange: formData.ageRange || 'Age range',
    location: formData.location || 'Location',
    buyingPower: formData.buyingPower || 'Budget',
    keyFrustrations: formData.keyFrustrations || 'Main frustrations'
  });

  const persona = getPersonaPreview();

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 2: Target Audience
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Define your ideal customer persona to build a product they will love.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <Input
              label="Industry / Segment"
              value={formData.industry}
              onChange={(e) => {
                setFormData({ ...formData, industry: e.target.value });
                if (errors.industry) setErrors({ ...errors, industry: null });
              }}
              error={errors.industry}
              placeholder="e.g., Healthcare, Education, SaaS, E-commerce"
              required
              maxLength={100}
            />

            <Input
              label="Age Range"
              value={formData.ageRange}
              onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
              placeholder="e.g., 25-40 years"
              maxLength={50}
            />

            <Input
              label="Income Level"
              value={formData.incomeLevel}
              onChange={(e) => setFormData({ ...formData, incomeLevel: e.target.value })}
              placeholder="e.g., ₹5-15 LPA"
              maxLength={50}
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Tier 1 cities, Pan India, Global"
              maxLength={100}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Behaviour Patterns
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.behaviorPatterns}
                onChange={(e) => {
                  setFormData({ ...formData, behaviorPatterns: e.target.value });
                  if (errors.behaviorPatterns) setErrors({ ...errors, behaviorPatterns: null });
                }}
                placeholder="e.g., They research extensively before buying, prefer mobile apps over desktop"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
                  errors.behaviorPatterns ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={2}
                maxLength={300}
              />
              {errors.behaviorPatterns && (
                <p className="mt-1 text-sm text-red-500">{errors.behaviorPatterns}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Daily Workflow
              </label>
              <textarea
                value={formData.dailyWorkflow}
                onChange={(e) => setFormData({ ...formData, dailyWorkflow: e.target.value })}
                placeholder="e.g., Starts day checking emails, uses 5-6 productivity tools"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600"
                rows={2}
                maxLength={300}
              />
            </div>

            <Input
              label="Buying Power / Budget"
              value={formData.buyingPower}
              onChange={(e) => setFormData({ ...formData, buyingPower: e.target.value })}
              placeholder="e.g., ₹500-2000/month for tools"
              maxLength={100}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key Frustrations
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.keyFrustrations}
                onChange={(e) => {
                  setFormData({ ...formData, keyFrustrations: e.target.value });
                  if (errors.keyFrustrations) setErrors({ ...errors, keyFrustrations: null });
                }}
                placeholder="e.g., Too many tools to manage, lack of integration, high costs"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
                  errors.keyFrustrations ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={2}
                maxLength={300}
              />
              {errors.keyFrustrations && (
                <p className="mt-1 text-sm text-red-500">{errors.keyFrustrations}</p>
              )}
            </div>
          </div>

          {/* Persona Card Preview */}
          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Persona Card
            </h3>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{persona.industry}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{persona.ageRange} • {persona.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                    <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{persona.buyingPower}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                    <span className="text-gray-500 dark:text-gray-400">Pain Points:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white line-clamp-2">{persona.keyFrustrations}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  💡 This persona card will be used throughout your product planning to ensure you are building for the right audience.
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

export default Step2_TargetAudience;
