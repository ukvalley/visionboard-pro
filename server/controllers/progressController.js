const MonthlyUpdate = require('../models/MonthlyUpdate');
const VisionBoard = require('../models/VisionBoard');
const { generateAISuggestions } = require('../services/aiService');

// @desc    Get progress history
// @route   GET /api/progress/:visionBoardId
// @access  Private
const getProgressHistory = async (req, res) => {
  try {
    const updates = await MonthlyUpdate.find({
      visionBoardId: req.params.visionBoardId
    }).sort({ year: -1, month: -1 });

    res.json({
      success: true,
      count: updates.length,
      data: updates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add monthly update
// @route   POST /api/progress/:visionBoardId/monthly
// @access  Private
const addMonthlyUpdate = async (req, res) => {
  try {
    // Verify vision board exists and belongs to user
    const visionBoard = await VisionBoard.findOne({
      _id: req.params.visionBoardId,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    // Check if update already exists for this month/year
    const existingUpdate = await MonthlyUpdate.findOne({
      visionBoardId: req.params.visionBoardId,
      month: req.body.month,
      year: req.body.year
    });

    if (existingUpdate) {
      // Update existing record
      Object.assign(existingUpdate, req.body);
      await existingUpdate.save();
      return res.json({
        success: true,
        data: existingUpdate
      });
    }

    const update = await MonthlyUpdate.create({
      ...req.body,
      visionBoardId: req.params.visionBoardId
    });

    res.status(201).json({
      success: true,
      data: update
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get actual vs target comparison
// @route   GET /api/progress/:visionBoardId/comparison
// @access  Private
const getComparison = async (req, res) => {
  try {
    const { month, year } = req.query;

    const visionBoard = await VisionBoard.findOne({
      _id: req.params.visionBoardId,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    const query = { visionBoardId: req.params.visionBoardId };
    if (month && year) {
      query.month = month;
      query.year = parseInt(year);
    }

    const updates = await MonthlyUpdate.find(query).sort({ year: 1, month: 1 });

    // Get targets from vision board
    const targets = {
      annualRevenue: visionBoard.sections.financialGoals?.data?.annualRevenue || 0,
      monthlyRevenue: visionBoard.sections.financialGoals?.data?.monthlyRevenue || 0,
      teamSize: visionBoard.sections.teamPlan?.data?.teamSize || 0,
      leads: visionBoard.sections.brandGoals?.data?.websiteLeads || 0
    };

    const comparison = updates.map(update => ({
      month: update.month,
      year: update.year,
      actual: {
        revenue: update.actualRevenue,
        teamSize: update.actualTeamSize,
        leads: update.actualLeads,
        customers: update.actualCustomers
      },
      target: {
        revenue: targets.monthlyRevenue,
        teamSize: targets.teamSize,
        leads: targets.leads
      },
      variance: {
        revenue: update.actualRevenue - targets.monthlyRevenue,
        teamSize: update.actualTeamSize - targets.teamSize,
        leads: update.actualLeads - targets.leads
      }
    }));

    res.json({
      success: true,
      data: {
        targets,
        comparison
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get AI suggestions
// @route   GET /api/progress/:visionBoardId/ai-suggestions
// @access  Private
const getAISuggestions = async (req, res) => {
  try {
    const visionBoard = await VisionBoard.findOne({
      _id: req.params.visionBoardId,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    const updates = await MonthlyUpdate.find({
      visionBoardId: req.params.visionBoardId
    }).sort({ year: -1, month: -1 }).limit(3);

    const suggestions = generateAISuggestions(visionBoard, updates);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProgressHistory,
  addMonthlyUpdate,
  getComparison,
  getAISuggestions
};