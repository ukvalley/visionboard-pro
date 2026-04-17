import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';
import { openPDFPrintDialog } from '../../utils/pdfExport';

const ProductCanvas = ({ product, onEdit, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    { id: 'problem', title: '1. Problem Definition', icon: '🎯', color: 'from-red-500 to-pink-600' },
    { id: 'audience', title: '2. Target Audience', icon: '👥', color: 'from-orange-500 to-amber-600' },
    { id: 'validation', title: '3. Validation', icon: '✅', color: 'from-yellow-500 to-lime-600' },
    { id: 'solution', title: '4. Solution', icon: '💡', color: 'from-green-500 to-emerald-600' },
    { id: 'market', title: '5. Market Validation', icon: '📊', color: 'from-teal-500 to-cyan-600' },
    { id: 'mvp', title: '6. MVP Planning', icon: '🚀', color: 'from-blue-500 to-indigo-600' },
    { id: 'visual', title: '7. Visualization', icon: '🎨', color: 'from-indigo-500 to-violet-600' },
    { id: 'business', title: '8. Business Model', icon: '💰', color: 'from-purple-500 to-fuchsia-600' },
    { id: 'gtm', title: '9. Go-To-Market', icon: '📢', color: 'from-pink-500 to-rose-600' },
    { id: 'metrics', title: '10. Metrics', icon: '📈', color: 'from-rose-500 to-red-600' }
  ];

  const getSectionData = (sectionId) => {
    switch (sectionId) {
      case 'problem':
        return {
          title: 'Problem Definition',
          content: product.problemDescription,
          meta: [
            { label: 'Who', value: product.whoFacingProblem },
            { label: 'Frequency', value: product.frequency },
            { label: 'Pain Level', value: `${product.painLevel}/10` }
          ]
        };
      case 'audience':
        return {
          title: 'Target Audience',
          content: product.industry,
          meta: [
            { label: 'Age', value: product.ageRange },
            { label: 'Income', value: product.incomeLevel },
            { label: 'Location', value: product.location }
          ]
        };
      case 'validation':
        return {
          title: 'Problem Validation',
          content: product.keyInsights,
          meta: [
            { label: 'Interviews', value: product.interviewsConducted },
            { label: 'Paying Now', value: product.currentlyPaying },
            { label: 'Score', value: `${product.validationScore}/100` }
          ]
        };
      case 'solution':
        return {
          title: 'Solution Definition',
          content: product.solutionStatement,
          meta: [
            { label: 'Benefits', value: product.keyBenefits },
            { label: 'Differentiation', value: product.differentiation }
          ]
        };
      case 'market':
        return {
          title: 'Market Validation',
          content: product.landingPageCreated === 'yes' ? 'Landing page created' : 'No landing page yet',
          meta: [
            { label: 'Ad Spend', value: `₹${product.adSpend || 0}` },
            { label: 'CTR', value: `${product.ctr || 0}%` },
            { label: 'Leads', value: product.leadsCollected || 0 }
          ]
        };
      case 'mvp':
        return {
          title: 'MVP Planning',
          content: product.mustHaveFeatures,
          meta: [
            { label: 'Must-have', value: product.mustHaveFeatures },
            { label: 'Good-to-have', value: product.goodToHaveFeatures }
          ]
        };
      case 'visual':
        return {
          title: 'Product Visualization',
          content: product.figmaLink || product.demoVideoLink,
          meta: [
            { label: 'Wireframes', value: product.wireframes?.length || 0 },
            { label: 'Figma', value: product.figmaLink ? 'Linked' : 'Not linked' },
            { label: 'Demo', value: product.demoVideoLink ? 'Linked' : 'Not linked' }
          ]
        };
      case 'business':
        return {
          title: 'Business Model',
          content: product.revenueModel,
          meta: [
            { label: 'Pricing', value: product.pricing },
            { label: 'CAC', value: `₹${product.cac || 0}` },
            { label: 'LTV', value: `₹${product.ltv || 0}` },
            { label: 'Ratio', value: product.cac && product.ltv ? `${(product.ltv / product.cac).toFixed(1)}x` : 'N/A' }
          ]
        };
      case 'gtm':
        return {
          title: 'Go-To-Market',
          content: product.first100UsersPlan,
          meta: [
            { label: 'Channels', value: product.targetChannels?.join(', ') },
            { label: 'Budget', value: product.budgetAllocation }
          ]
        };
      case 'metrics':
        return {
          title: 'Metrics & KPIs',
          content: `Revenue Target: ₹${product.revenueTarget || 0}`,
          meta: [
            { label: 'Conversion', value: `${product.conversionRate || 0}%` },
            { label: 'Retention', value: `${product.retentionRate || 0}%` },
            { label: 'Growth', value: `${product.growthTarget || 0}%` }
          ]
        };
      default:
        return { title: '', content: '', meta: [] };
    }
  };

  const getCompletionStatus = (sectionId) => {
    const stepMap = {
      problem: 1, audience: 2, validation: 3, solution: 4,
      market: 5, mvp: 6, visual: 7, business: 8, gtm: 9, metrics: 10
    };
    const stepNumber = stepMap[sectionId];
    return product.completedSteps?.includes(stepNumber);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={onClose}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Product Planning Canvas • Created {formatDate(product.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={() => onEdit(product)}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>

          <Button variant="secondary" size="sm" onClick={() => openPDFPrintDialog(product)}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Canvas Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 transition-transform duration-300"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
      >
        {sections.map((section) => {
          const data = getSectionData(section.id);
          const isCompleted = getCompletionStatus(section.id);

          return (
            <Card
              key={section.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${
                activeSection === section.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${section.color} rounded-t-lg p-3 -m-6 mb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="font-semibold text-white text-sm">{section.title}</h3>
                  </div>
                  {isCompleted && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                {data.content ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {data.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    Not filled yet
                  </p>
                )}

                {/* Meta Data */}
                {data.meta.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                      {data.meta.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="text-gray-500 dark:text-gray-400">{item.label}:</span>
                          <span className="ml-1 text-gray-700 dark:text-gray-300 font-medium truncate">
                            {item.value || 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Planning Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {product.completedSteps?.length || 0}/10
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Steps Completed</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {product.validationScore || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Validation Score</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {product.category ? product.category.toUpperCase() : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 capitalize">
              {product.status || 'Idea'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCanvas;
