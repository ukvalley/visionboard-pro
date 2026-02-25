import api from './api';

export const strategySheetService = {
  async getStrategySheet(visionBoardId) {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy`);
    return response.data;
  },

  async updateSection(visionBoardId, sectionName, data) {
    const response = await api.put(`/visionboards/${visionBoardId}/strategy/${sectionName}`, data);
    return response.data;
  },

  async getProgress(visionBoardId) {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy/progress`);
    return response.data;
  },

  async getSummary(visionBoardId) {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy/summary`);
    return response.data;
  }
};

export default strategySheetService;