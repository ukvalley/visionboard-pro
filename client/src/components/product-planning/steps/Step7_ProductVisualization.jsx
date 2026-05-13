import { useState } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';

const Step7_ProductVisualization = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    wireframes: product.wireframes || [],
    figmaLink: product.figmaLink || '',
    demoVideoLink: product.demoVideoLink || ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.figmaLink && !formData.demoVideoLink && formData.wireframes.length === 0) {
      newErrors.general = 'Please provide at least one visual asset (wireframes, Figma link, or demo video).';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ visualization: formData, ...formData });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      wireframes: [...prev.wireframes, ...files.map(f => f.name)]
    }));
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step 7: Product Visualization
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visualize your product with wireframes, mockups, or demo videos.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Wireframes Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Wireframes / Mockups
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="wireframe-upload"
            />
            <label
              htmlFor="wireframe-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload wireframes or mockups
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </span>
            </label>
          </div>

          {/* Uploaded Files List */}
          {formData.wireframes.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.wireframes.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{file}</span>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      wireframes: prev.wireframes.filter((_, i) => i !== index)
                    }))}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Figma Link */}
        <Input
          label="Figma Design Link"
          type="url"
          value={formData.figmaLink}
          onChange={(e) => setFormData({ ...formData, figmaLink: e.target.value })}
          placeholder="https://www.figma.com/file/..."
          helperText="Link to your Figma prototype or design file."
        />

        {/* Demo Video Link */}
        <Input
          label="Demo Video Link"
          type="url"
          value={formData.demoVideoLink}
          onChange={(e) => setFormData({ ...formData, demoVideoLink: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
          helperText="Link to a video walkthrough or demo of your product."
        />

        {/* Preview Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Visual Assets Preview</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className={`p-4 rounded-lg ${formData.wireframes.length > 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <svg className="w-6 h-6 mx-auto mb-1 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formData.wireframes.length > 0 ? `${formData.wireframes.length} uploaded` : 'No wireframes'}
              </span>
            </div>
            <div className={`p-4 rounded-lg ${formData.figmaLink ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <svg className="w-6 h-6 mx-auto mb-1 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formData.figmaLink ? 'Figma linked' : 'No Figma link'}
              </span>
            </div>
            <div className={`p-4 rounded-lg ${formData.demoVideoLink ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <svg className="w-6 h-6 mx-auto mb-1 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formData.demoVideoLink ? 'Video linked' : 'No video link'}
              </span>
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

export default Step7_ProductVisualization;
