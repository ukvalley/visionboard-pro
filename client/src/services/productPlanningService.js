import api from './api';

const BASE_URL = '/product-planning';

const productPlanningService = {
  // Product CRUD
  getAllProducts: () => api.get(BASE_URL),
  getProduct: (id) => api.get(`${BASE_URL}/${id}`),
  createProduct: (data) => api.post(BASE_URL, data),
  updateProduct: (id, data) => api.put(`${BASE_URL}/${id}`, data),
  deleteProduct: (id) => api.delete(`${BASE_URL}/${id}`),
  duplicateProduct: (id) => api.post(`${BASE_URL}/${id}/duplicate`),

  // Step updates
  updateProblemDefinition: (id, data) => api.put(`${BASE_URL}/${id}/problem`, data),
  updateTargetAudience: (id, data) => api.put(`${BASE_URL}/${id}/audience`, data),
  updateProblemValidation: (id, data) => api.put(`${BASE_URL}/${id}/validation`, data),
  updateSolutionDefinition: (id, data) => api.put(`${BASE_URL}/${id}/solution`, data),
  updateMarketValidation: (id, data) => api.put(`${BASE_URL}/${id}/market`, data),
  updateMVPPlanning: (id, data) => api.put(`${BASE_URL}/${id}/mvp`, data),
  updateVisualization: (id, data) => api.put(`${BASE_URL}/${id}/visualization`, data),
  updateBusinessModel: (id, data) => api.put(`${BASE_URL}/${id}/business-model`, data),
  updateGoToMarket: (id, data) => api.put(`${BASE_URL}/${id}/gtm`, data),
  updateMetrics: (id, data) => api.put(`${BASE_URL}/${id}/metrics`, data),

  // Export
  exportProductPlan: (id) => api.get(`${BASE_URL}/${id}/export`, { responseType: 'blob' }),

  // Validation score calculation
  calculateValidationScore: (id) => api.get(`${BASE_URL}/${id}/validation-score`),
};

export default productPlanningService;
