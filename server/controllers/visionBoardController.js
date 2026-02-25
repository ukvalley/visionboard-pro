const VisionBoard = require('../models/VisionBoard');

// @desc    Get all vision boards for user
// @route   GET /api/visionboards
// @access  Private
const getVisionBoards = async (req, res) => {
  try {
    const visionBoards = await VisionBoard.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: visionBoards.length,
      data: visionBoards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vision board
// @route   GET /api/visionboards/:id
// @access  Private
const getVisionBoard = async (req, res) => {
  try {
    const visionBoard = await VisionBoard.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    res.json({
      success: true,
      data: visionBoard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create vision board
// @route   POST /api/visionboards
// @access  Private
const createVisionBoard = async (req, res) => {
  try {
    const visionBoard = await VisionBoard.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: visionBoard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vision board
// @route   PUT /api/visionboards/:id
// @access  Private
const updateVisionBoard = async (req, res) => {
  try {
    let visionBoard = await VisionBoard.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    visionBoard = await VisionBoard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: visionBoard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vision board
// @route   DELETE /api/visionboards/:id
// @access  Private
const deleteVisionBoard = async (req, res) => {
  try {
    const visionBoard = await VisionBoard.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    await visionBoard.deleteOne();

    res.json({
      success: true,
      message: 'Vision board deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update specific section
// @route   PUT /api/visionboards/:id/section/:sectionName
// @access  Private
const updateSection = async (req, res) => {
  try {
    const { id, sectionName } = req.params;
    const { completed, data } = req.body;

    // Validate section name - supports both legacy sections and strategySheet sections
    const legacySections = [
      'businessOverview', 'financialGoals', 'growthStrategy',
      'productService', 'systemsToBuild', 'teamPlan',
      'brandGoals', 'lifestyleVision'
    ];

    const strategySheetSections = [
      'companyOverview', 'corePurpose', 'vision', 'mission', 'brandPromise',
      'coreValues', 'bhag', 'vividDescription', 'swotAnalysis', 'strategicPriorities',
      'threeYearStrategy', 'smartGoals', 'quarterlyPlan', 'revenueModel',
      'organizationalStructure', 'sopRoadmap', 'automationSystems', 'kpiDashboard',
      'riskManagement', 'strategySummary'
    ];

    const isLegacySection = legacySections.includes(sectionName);
    const isStrategySection = strategySheetSections.includes(sectionName);

    if (!isLegacySection && !isStrategySection) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    }

    const visionBoard = await VisionBoard.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    // Update the appropriate section
    if (isLegacySection) {
      visionBoard.sections[sectionName] = {
        completed: completed !== undefined ? completed : visionBoard.sections[sectionName].completed,
        data: data || visionBoard.sections[sectionName].data
      };
    } else {
      // Update strategySheet section
      if (!visionBoard.strategySheet) {
        visionBoard.strategySheet = {};
      }
      visionBoard.strategySheet[sectionName] = {
        completed: completed !== undefined ? completed : (visionBoard.strategySheet[sectionName]?.completed || false),
        data: data || visionBoard.strategySheet[sectionName]?.data || {}
      };
    }

    await visionBoard.save();

    res.json({
      success: true,
      data: visionBoard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get progress details
// @route   GET /api/visionboards/:id/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const visionBoard = await VisionBoard.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    const sections = Object.entries(visionBoard.sections).map(([key, value]) => ({
      name: key,
      completed: value.completed,
      progress: value.completed ? 100 : 0
    }));

    res.json({
      success: true,
      data: {
        overallProgress: visionBoard.overallProgress,
        sections
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Archive vision board
// @route   PUT /api/visionboards/:id/archive
// @access  Private
const archiveVisionBoard = async (req, res) => {
  try {
    const visionBoard = await VisionBoard.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!visionBoard) {
      return res.status(404).json({
        success: false,
        message: 'Vision board not found'
      });
    }

    visionBoard.isActive = false;
    visionBoard.archivedAt = new Date();
    await visionBoard.save();

    res.json({
      success: true,
      data: visionBoard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getVisionBoards,
  getVisionBoard,
  createVisionBoard,
  updateVisionBoard,
  deleteVisionBoard,
  updateSection,
  getProgress,
  archiveVisionBoard
};