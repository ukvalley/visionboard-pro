const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const VisionBoard = require('../models/VisionBoard');
const { protect } = require('../middleware/auth');

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { messages, context, visionBoardId, saveHistory } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }

    const result = await aiService.chat(messages, context || {});

    // Save chat history to vision board if requested
    if (saveHistory && visionBoardId && result.success) {
      try {
        const visionBoard = await VisionBoard.findById(visionBoardId);
        if (visionBoard) {
          const chatHistory = visionBoard.strategySheet?.collaboration?.data?.chatHistory || [];
          // Add user message
          const lastUserMessage = messages[messages.length - 1];
          chatHistory.push({
            role: 'user',
            content: lastUserMessage.content,
            timestamp: new Date()
          });
          // Add assistant response
          chatHistory.push({
            role: 'assistant',
            content: result.message,
            timestamp: new Date()
          });
          // Keep only last 100 messages
          const trimmedHistory = chatHistory.slice(-100);

          // Update vision board
          if (!visionBoard.strategySheet) visionBoard.strategySheet = {};
          if (!visionBoard.strategySheet.collaboration) visionBoard.strategySheet.collaboration = { completed: false, data: {} };
          if (!visionBoard.strategySheet.collaboration.data) visionBoard.strategySheet.collaboration.data = {};
          visionBoard.strategySheet.collaboration.data.chatHistory = trimmedHistory;
          visionBoard.strategySheet.collaboration.completed = true;

          await visionBoard.save();
        }
      } catch (saveError) {
        console.error('Error saving chat history:', saveError);
        // Don't fail the request if saving fails
      }
    }

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

// @desc    Get chat history
// @route   GET /api/ai/chat-history/:visionBoardId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { visionBoardId } = req.params;

    const visionBoard = await VisionBoard.findById(visionBoardId);
    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    const chatHistory = visionBoard.strategySheet?.collaboration?.data?.chatHistory || [];

    res.json({
      success: true,
      data: chatHistory
    });
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving chat history'
    });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/ai/chat-history/:visionBoardId
// @access  Private
const clearChatHistory = async (req, res) => {
  try {
    const { visionBoardId } = req.params;

    const visionBoard = await VisionBoard.findById(visionBoardId);
    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    if (visionBoard.strategySheet?.collaboration?.data) {
      visionBoard.strategySheet.collaboration.data.chatHistory = [];
      await visionBoard.save();
    }

    res.json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    console.error('Clear Chat History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing chat history'
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
router.get('/chat-history/:visionBoardId', protect, getChatHistory);
router.delete('/chat-history/:visionBoardId', protect, clearChatHistory);
router.post('/suggestions', protect, getSuggestions);
router.post('/analyze-financials', protect, analyzeFinancials);
router.post('/simulate-risks', protect, simulateRisks);

module.exports = router;