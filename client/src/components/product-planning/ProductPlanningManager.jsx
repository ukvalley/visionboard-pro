import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import { formatDate } from '../../utils/helpers';
import productPlanningService from '../../services/productPlanningService';
import { openPDFPrintDialog, exportProductData } from '../../utils/pdfExport';

// Import Wizard Steps
import Step1_ProblemDefinition from './steps/Step1_ProblemDefinition';
import Step2_TargetAudience from './steps/Step2_TargetAudience';
import Step3_ProblemValidation from './steps/Step3_ProblemValidation';
import Step4_SolutionDefinition from './steps/Step4_SolutionDefinition';
import Step5_MarketValidation from './steps/Step5_MarketValidation';
import Step6_MVPPlanning from './steps/Step6_MVPPlanning';
import Step7_ProductVisualization from './steps/Step7_ProductVisualization';
import Step8_BusinessModel from './steps/Step8_BusinessModel';
import Step9_GoToMarket from './steps/Step9_GoToMarket';
import Step10_MetricsKPIs from './steps/Step10_MetricsKPIs';
import ProductCanvas from './ProductCanvas';

const PRODUCT_CATEGORIES = [
  { value: 'saas', label: 'SaaS' },
  { value: 'app', label: 'Mobile App' },
  { value: 'service', label: 'Service' },
  { value: 'physical', label: 'Physical Product' },
  { value: 'other', label: 'Other' }
];

const PRODUCT_STATUSES = [
  { value: 'idea', label: 'Idea' },
  { value: 'validation', label: 'Validation' },
  { value: 'mvp', label: 'MVP' },
  { value: 'launched', label: 'Launched' },
  { value: 'scaling', label: 'Scaling' }
];

const WIZARD_STEPS = [
  { id: 1, name: 'Problem Definition', component: Step1_ProblemDefinition },
  { id: 2, name: 'Target Audience', component: Step2_TargetAudience },
  { id: 3, name: 'Problem Validation', component: Step3_ProblemValidation },
  { id: 4, name: 'Solution Definition', component: Step4_SolutionDefinition },
  { id: 5, name: 'Market Validation', component: Step5_MarketValidation },
  { id: 6, name: 'MVP Planning', component: Step6_MVPPlanning },
  { id: 7, name: 'Product Visualization', component: Step7_ProductVisualization },
  { id: 8, name: 'Business Model', component: Step8_BusinessModel },
  { id: 9, name: 'Go-To-Market', component: Step9_GoToMarket },
  { id: 10, name: 'Metrics & KPIs', component: Step10_MetricsKPIs }
];

const ProductPlanningManager = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'wizard', 'canvas'

  // Form states
  const [addFormData, setAddFormData] = useState({
    name: '',
    category: '',
    status: 'idea'
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: '',
    status: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchProducts = async () => {
    try {
      const response = await productPlanningService.getAllProducts();
      // API returns { success: true, data: [...] }
      setProducts(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validation
  const validateProductForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) {
      errors.name = 'Product Name is required.';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Product Name must be at least 2 characters.';
    }
    if (!data.category) {
      errors.category = 'Category is required.';
    }
    return errors;
  };

  // CRUD Operations
  const handleAddProduct = async () => {
    const errors = validateProductForm(addFormData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await productPlanningService.createProduct(addFormData);
      setProducts([...products, response.data?.data]);
      setShowAddModal(false);
      setAddFormData({ name: '', category: '', status: 'idea' });
      setFormErrors({});
      setSuccessMessage('Product added successfully.');
    } catch (error) {
      setFormErrors({ submit: 'Failed to add product. Please try again.' });
    }
  };

  const handleUpdateProduct = async () => {
    const errors = validateProductForm(editFormData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await productPlanningService.updateProduct(
        currentProduct._id,
        editFormData
      );
      setProducts(products.map(p => p._id === currentProduct._id ? response.data?.data : p));
      setShowEditModal(false);
      setFormErrors({});
      setSuccessMessage('Product updated successfully.');
    } catch (error) {
      setFormErrors({ submit: 'Failed to update product. Please try again.' });
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await productPlanningService.deleteProduct(productToDelete._id);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      setSuccessMessage('Product deleted successfully.');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleDuplicateProduct = async (product) => {
    try {
      const response = await productPlanningService.duplicateProduct(product._id);
      setProducts([...products, response.data?.data]);
      setSuccessMessage('Product duplicated successfully.');
    } catch (error) {
      console.error('Failed to duplicate product:', error);
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setEditFormData({
      name: product.name,
      category: product.category,
      status: product.status
    });
    setShowEditModal(true);
    setFormErrors({});
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const openWizard = (product) => {
    setCurrentProduct(product);
    setViewMode('wizard');
    setCurrentStep(1);
  };

  const openCanvas = (product) => {
    setCurrentProduct(product);
    setViewMode('canvas');
  };

  const getStatusColor = (status) => {
    const colors = {
      idea: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      validation: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      mvp: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      launched: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      scaling: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[status] || colors.idea;
  };

  const CurrentStepComponent = WIZARD_STEPS[currentStep - 1]?.component;

  // Render List View
  const renderListView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Planning
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Plan and validate your products from idea to launch
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative max-w-xs">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 cursor-pointer"
            aria-label="Close message"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Products Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400 w-16">
                  SR. No.
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Product Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created Date
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {PRODUCT_CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {PRODUCT_STATUSES.find(s => s.value === product.status)?.label || product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openWizard(product)}
                          className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Open Planning Wizard"
                          aria-label="Open Planning Wizard"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openCanvas(product)}
                          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                          title="View Canvas"
                          aria-label="View Canvas"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(product)}
                          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate Product"
                          aria-label="Duplicate Product"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                          aria-label="Edit Product"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                          aria-label="Delete Product"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // Render Wizard View
  const renderWizardView = () => (
    <div className="space-y-6">
      {/* Wizard Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('list')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
            aria-label="Back to list"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentProduct?.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Step {currentStep} of 10: {WIZARD_STEPS[currentStep - 1]?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setViewMode('canvas')}>
            View Canvas
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round((currentStep / 10) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 overflow-x-auto">
          {WIZARD_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex-shrink-0 text-xs px-2 py-1 rounded-full transition-colors ${
                step.id === currentStep
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : step.id < currentStep
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.id}. {step.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentProduct && CurrentStepComponent && (
        <CurrentStepComponent
          product={currentProduct}
          onSave={(data) => {
            // Update product data
            setCurrentProduct({ ...currentProduct, ...data });
            // Move to next step if not on last step
            if (currentStep < 10) {
              setCurrentStep(currentStep + 1);
            }
          }}
          onBack={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            }
          }}
        />
      )}
    </div>
  );

  // Render Canvas View
  const handleExportPDF = () => {
    if (!currentProduct) return;
    openPDFPrintDialog(currentProduct);
  };

  const handleExportJSON = () => {
    if (!currentProduct) return;
    exportProductData(currentProduct);
    setSuccessMessage('Product data exported successfully.');
  };

  const renderCanvasView = () => (
    <ProductCanvas
      product={currentProduct}
      onEdit={(product) => {
        setCurrentProduct(product);
        setViewMode('wizard');
      }}
      onClose={() => setViewMode('list')}
    />
  );

  return (
    <div className="h-full">
      {viewMode === 'list' && renderListView()}
      {viewMode === 'wizard' && renderWizardView()}
      {viewMode === 'canvas' && renderCanvasView()}

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setAddFormData({ name: '', category: '', status: 'idea' });
          setFormErrors({});
        }}
        title="Add Product"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setAddFormData({ name: '', category: '', status: 'idea' });
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddProduct}>
              Add Product
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Product Name"
            value={addFormData.name}
            onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
            error={formErrors.name}
            placeholder="Enter Product Name"
            required
            maxLength={100}
          />
          <Select
            label="Category"
            value={addFormData.category}
            onChange={(e) => setAddFormData({ ...addFormData, category: e.target.value })}
            options={PRODUCT_CATEGORIES}
            error={formErrors.category}
            required
          />
          <Select
            label="Status"
            value={addFormData.status}
            onChange={(e) => setAddFormData({ ...addFormData, status: e.target.value })}
            options={PRODUCT_STATUSES}
            required
          />
          {formErrors.submit && (
            <p className="text-sm text-red-500">{formErrors.submit}</p>
          )}
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setFormErrors({});
        }}
        title="Edit Product"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateProduct}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Product Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            error={formErrors.name}
            placeholder="Enter Product Name"
            required
            maxLength={100}
          />
          <Select
            label="Category"
            value={editFormData.category}
            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
            options={PRODUCT_CATEGORIES}
            error={formErrors.category}
            required
          />
          <Select
            label="Status"
            value={editFormData.status}
            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
            options={PRODUCT_STATUSES}
            required
          />
          {formErrors.submit && (
            <p className="text-sm text-red-500">{formErrors.submit}</p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowDeleteModal(false);
              setProductToDelete(null);
            }}>
              Cancel
            </Button>
            <Button variant="danger" destructive onClick={handleDeleteProduct}>
              Delete
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete product <strong>{productToDelete?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ProductPlanningManager;
