const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { protect } = require('../middleware/auth');

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }

    const result = await aiService.chat(messages, context || {});

    res.json({
      success: result.success,
      message: result.message,
      fallback: result.fallback
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat request'
    });
  }
};

// @desc    Get AI suggestions for vision board
// @route   POST /api/ai/suggestions
// @access  Private
const getSuggestions = async (req, res) => {
  try {
    const { visionBoard, monthlyUpdates } = req.body;

    const suggestions = await aiService.generateAISuggestions(visionBoard, monthlyUpdates || []);

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('AI Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating suggestions'
    });
  }
};

// @desc    Analyze financial data
// @route   POST /api/ai/analyze-financials
// @access  Private
const analyzeFinancials = async (req, res) => {
  try {
    const { financialData } = req.body;

    const result = await aiService.analyzeFinancials(financialData);

    res.json(result);
  } catch (error) {
    console.error('Financial Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing financials'
    });
  }
};

// @desc    Run risk simulation
// @route   POST /api/ai/simulate-risks
// @access  Private
const simulateRisks = async (req, res) => {
  try {
    const { risks, projects, priorities } = req.body;

    const result = await aiService.simulateRiskScenario(risks, projects, priorities);

    res.json(result);
  } catch (error) {
    console.error('Risk Simulation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error running simulation'
    });
  }
};

// Routes
router.post('/chat', protect, chat);
router.post('/suggestions', protect, getSuggestions);
router.post('/analyze-financials', protect, analyzeFinancials);
router.post('/simulate-risks', protect, simulateRisks);

module.exports = router;