import api from './api';

export const visionBoardService = {
  async getAll() {
    const response = await api.get('/visionboards');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/visionboards/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/visionboards', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/visionboards/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/visionboards/${id}`);
    return response.data;
  },

  async updateSection(id, sectionName, data) {
    const response = await api.put(`/visionboards/${id}/section/${sectionName}`, data);
    return response.data;
  },

  async getProgress(id) {
    const response = await api.get(`/visionboards/${id}/progress`);
    return response.data;
  },

  async archive(id) {
    const response = await api.put(`/visionboards/${id}/archive`);
    return response.data;
  },

  async getProgressHistory(id) {
    const response = await api.get(`/progress/${id}`);
    return response.data;
  },

  async addMonthlyUpdate(id, data) {
    const response = await api.post(`/progress/${id}/monthly`, data);
    return response.data;
  },

  async getComparison(id, params = {}) {
    const response = await api.get(`/progress/${id}/comparison`, { params });
    return response.data;
  },

  async getAISuggestions(id) {
    const response = await api.get(`/progress/${id}/ai-suggestions`);
    return response.data;
  }
};

export default visionBoardService;