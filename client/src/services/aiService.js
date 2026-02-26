import api from './api';

const aiService = {
  // Chat with AI assistant
  chat: async (messages, context = {}) => {
    const response = await api.post('/ai/chat', { messages, context });
    return response.data;
  },

  // Get AI suggestions for vision board
  getSuggestions: async (visionBoard, monthlyUpdates = []) => {
    const response = await api.post('/ai/suggestions', { visionBoard, monthlyUpdates });
    return response.data;
  },

  // Analyze financial data
  analyzeFinancials: async (financialData) => {
    const response = await api.post('/ai/analyze-financials', { financialData });
    return response.data;
  },

  // Run risk simulation
  simulateRisks: async (risks, projects, priorities) => {
    const response = await api.post('/ai/simulate-risks', { risks, projects, priorities });
    return response.data;
  }
};

export default aiService;