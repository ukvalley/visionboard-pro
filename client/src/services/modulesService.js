import api from './api';

// Vision & Strategy Service
export const visionStrategyService = {
  // Cascading Goals
  getCascadingGoals: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy/goals`);
    return response;
  },

  addCascadingGoal: async (visionBoardId, goalData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/strategy/goals`, goalData);
    return response;
  },

  updateGoalProgress: async (visionBoardId, goalId, progress) => {
    const response = await api.put(`/visionboards/${visionBoardId}/strategy/goals/${goalId}`, { progress });
    return response;
  },

  // Mission & Vision
  getMissionVision: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy/mission-vision`);
    return response;
  },

  updateMissionVision: async (visionBoardId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/strategy/mission-vision`, data);
    return response;
  },

  // SWOT Analysis
  getSwot: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy/swot`);
    return response;
  },

  addSwotItem: async (visionBoardId, category, item) => {
    const response = await api.post(`/visionboards/${visionBoardId}/strategy/swot`, { category, item });
    return response;
  },

  // 7 Strata
  getStrata: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy/strata`);
    return response;
  },

  updateStrata: async (visionBoardId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/strategy/strata`, data);
    return response;
  },

  // Strategic Plan
  getStrategicPlan: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/strategy/plan`);
    return response;
  },

  updateStrategicPlan: async (visionBoardId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/strategy/plan`, data);
    return response;
  },

  // AI Vision Alternatives
  getAIVisionAlternatives: async (visionBoardId, currentVision) => {
    const response = await api.post(`/visionboards/${visionBoardId}/strategy/ai-alternatives`, currentVision);
    return response;
  }
};

// Target Tracker Service
export const targetTrackerService = {
  // OKRs
  getOKRs: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/targets/okrs`);
    return response;
  },

  createOKR: async (visionBoardId, okrData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/targets/okrs`, okrData);
    return response;
  },

  updateKeyResult: async (visionBoardId, okrId, krId, progress) => {
    const response = await api.put(`/visionboards/${visionBoardId}/targets/okrs/${okrId}/keyresults/${krId}`, { progress });
    return response;
  },

  // Milestones
  getMilestones: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/targets/milestones`);
    return response;
  },

  createMilestone: async (visionBoardId, milestoneData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/targets/milestones`, milestoneData);
    return response;
  },

  updateMilestone: async (visionBoardId, milestoneId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/targets/milestones/${milestoneId}`, data);
    return response;
  },

  // Dependencies
  getDependencies: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/targets/dependencies`);
    return response;
  },

  createDependency: async (visionBoardId, dependencyData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/targets/dependencies`, dependencyData);
    return response;
  },

  // SMART Goal Writer
  generateSMARTGoal: async (visionBoardId, goalTitle) => {
    const response = await api.post(`/visionboards/${visionBoardId}/targets/smart-goal`, { title: goalTitle });
    return response;
  }
};

// Resource Management Service
export const resourceService = {
  // FACe Chart
  getFACeChart: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/resources/face`);
    return response;
  },

  updateFACeRole: async (visionBoardId, roleId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/resources/face/${roleId}`, data);
    return response;
  },

  // PACe Chart
  getPACeChart: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/resources/pace`);
    return response;
  },

  updatePACeProcess: async (visionBoardId, processId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/resources/pace/${processId}`, data);
    return response;
  },

  // Team
  getTeamMembers: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/resources/team`);
    return response;
  },

  addTeamMember: async (visionBoardId, memberData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/resources/team`, memberData);
    return response;
  },

  updateTeamMember: async (visionBoardId, memberId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/resources/team/${memberId}`, data);
    return response;
  },

  deleteTeamMember: async (visionBoardId, memberId) => {
    const response = await api.delete(`/visionboards/${visionBoardId}/resources/team/${memberId}`);
    return response;
  },

  // Talent Assessment
  getTalentAssessments: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/resources/talent`);
    return response;
  },

  createTalentAssessment: async (visionBoardId, assessmentData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/resources/talent`, assessmentData);
    return response;
  },

  // AI Resource Recommendations
  getResourceRecommendations: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/resources/recommendations`);
    return response;
  }
};

// Execution & Risk Service
export const executionRiskService = {
  // WWW Actions
  getWWWActions: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/execution/www`);
    return response;
  },

  createWWWAction: async (visionBoardId, actionData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/execution/www`, actionData);
    return response;
  },

  updateWWWAction: async (visionBoardId, actionId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/execution/www/${actionId}`, data);
    return response;
  },

  deleteWWWAction: async (visionBoardId, actionId) => {
    const response = await api.delete(`/visionboards/${visionBoardId}/execution/www/${actionId}`);
    return response;
  },

  // Rockefeller Habits
  getHabits: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/execution/habits`);
    return response;
  },

  createHabit: async (visionBoardId, habitData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/execution/habits`, habitData);
    return response;
  },

  completeHabit: async (visionBoardId, habitId) => {
    const response = await api.put(`/visionboards/${visionBoardId}/execution/habits/${habitId}/complete`);
    return response;
  },

  // Risks
  getRisks: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/execution/risks`);
    return response;
  },

  createRisk: async (visionBoardId, riskData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/execution/risks`, riskData);
    return response;
  },

  updateRisk: async (visionBoardId, riskId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/execution/risks/${riskId}`, data);
    return response;
  },

  deleteRisk: async (visionBoardId, riskId) => {
    const response = await api.delete(`/visionboards/${visionBoardId}/execution/risks/${riskId}`);
    return response;
  },

  // Projects
  getProjects: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/execution/projects`);
    return response;
  },

  createProject: async (visionBoardId, projectData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/execution/projects`, projectData);
    return response;
  },

  updateProject: async (visionBoardId, projectId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/execution/projects/${projectId}`, data);
    return response;
  },

  // AI Scenario simulation
  runScenarioSimulation: async (visionBoardId, scenarios) => {
    const response = await api.post(`/visionboards/${visionBoardId}/execution/simulate`, scenarios);
    return response;
  }
};

// Financial Insights Service
export const financialService = {
  // Dashboard
  getFinancialDashboard: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/financial/dashboard`);
    return response;
  },

  // CASh Strategies
  getCashStrategies: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/financial/cash-strategies`);
    return response;
  },

  createCashStrategy: async (visionBoardId, strategyData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/financial/cash-strategies`, strategyData);
    return response;
  },

  updateCashStrategy: async (visionBoardId, strategyId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/financial/cash-strategies/${strategyId}`, data);
    return response;
  },

  // Forecasts
  getForecasts: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/financial/forecasts`);
    return response;
  },

  createForecast: async (visionBoardId, forecastData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/financial/forecasts`, forecastData);
    return response;
  },

  updateForecast: async (visionBoardId, forecastId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/financial/forecasts/${forecastId}`, data);
    return response;
  },

  // ROI Projects
  getROIProjects: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/financial/roi-projects`);
    return response;
  },

  createROIProject: async (visionBoardId, projectData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/financial/roi-projects`, projectData);
    return response;
  },

  updateROIProject: async (visionBoardId, projectId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/financial/roi-projects/${projectId}`, data);
    return response;
  },

  // AI Financial Analysis
  runAIAnalysis: async (visionBoardId) => {
    const response = await api.post(`/visionboards/${visionBoardId}/financial/ai-analysis`);
    return response;
  },

  generateScenarios: async (visionBoardId, params) => {
    const response = await api.post(`/visionboards/${visionBoardId}/financial/generate-scenarios`, params);
    return response;
  }
};

// Collaboration Service
export const collaborationService = {
  // Workspaces
  getWorkspaces: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/collaboration/workspaces`);
    return response;
  },

  createWorkspace: async (visionBoardId, workspaceData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/collaboration/workspaces`, workspaceData);
    return response;
  },

  // Discussions
  getDiscussions: async (visionBoardId, workspaceId = null) => {
    const url = workspaceId
      ? `/visionboards/${visionBoardId}/collaboration/discussions?workspace=${workspaceId}`
      : `/visionboards/${visionBoardId}/collaboration/discussions`;
    const response = await api.get(url);
    return response;
  },

  createDiscussion: async (visionBoardId, discussionData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/collaboration/discussions`, discussionData);
    return response;
  },

  // Mentorships
  getMentorships: async (visionBoardId) => {
    const response = await api.get(`/visionboards/${visionBoardId}/collaboration/mentorships`);
    return response;
  },

  createMentorship: async (visionBoardId, mentorshipData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/collaboration/mentorships`, mentorshipData);
    return response;
  },

  updateMentorship: async (visionBoardId, mentorshipId, data) => {
    const response = await api.put(`/visionboards/${visionBoardId}/collaboration/mentorships/${mentorshipId}`, data);
    return response;
  },

  // Knowledge Base
  getKnowledgeArticles: async (visionBoardId, category = null) => {
    const url = category
      ? `/visionboards/${visionBoardId}/collaboration/knowledge?category=${category}`
      : `/visionboards/${visionBoardId}/collaboration/knowledge`;
    const response = await api.get(url);
    return response;
  },

  createKnowledgeArticle: async (visionBoardId, articleData) => {
    const response = await api.post(`/visionboards/${visionBoardId}/collaboration/knowledge`, articleData);
    return response;
  },

  // AI Coach
  askPatrickAI: async (visionBoardId, message) => {
    const response = await api.post(`/visionboards/${visionBoardId}/collaboration/ai-coach`, { message });
    return response;
  }
};

export default {
  visionStrategy: visionStrategyService,
  targetTracker: targetTrackerService,
  resource: resourceService,
  executionRisk: executionRiskService,
  financial: financialService,
  collaboration: collaborationService
};