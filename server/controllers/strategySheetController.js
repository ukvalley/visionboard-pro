const VisionBoard = require('../models/VisionBoard');

// Strategy Sheet Section Names
const STRATEGY_SECTIONS = [
  'companyOverview',
  'corePurpose',
  'vision',
  'mission',
  'brandPromise',
  'coreValues',
  'bhag',
  'vividDescription',
  'swotAnalysis',
  'strategicPriorities',
  'threeYearStrategy',
  'smartGoals',
  'quarterlyPlan',
  'revenueModel',
  'organizationalStructure',
  'sopRoadmap',
  'automationSystems',
  'kpiDashboard',
  'riskManagement',
  'strategySummary'
];

// @desc    Get strategy sheet
// @route   GET /api/visionboards/:id/strategy
// @access  Private
const getStrategySheet = async (req, res) => {
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
      data: visionBoard.strategySheet || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update strategy sheet section
// @route   PUT /api/visionboards/:id/strategy/:sectionName
// @access  Private
const updateStrategySection = async (req, res) => {
  try {
    const { id, sectionName } = req.params;
    const { completed, data } = req.body;

    // Validate section name
    if (!STRATEGY_SECTIONS.includes(sectionName)) {
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

    // Initialize strategySheet if needed
    if (!visionBoard.strategySheet) {
      visionBoard.strategySheet = {};
    }

    // Update the section
    visionBoard.strategySheet[sectionName] = {
      completed: completed !== undefined ? completed : (visionBoard.strategySheet[sectionName]?.completed || false),
      data: data || visionBoard.strategySheet[sectionName]?.data || {}
    };

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

// @desc    Get strategy sheet progress
// @route   GET /api/visionboards/:id/strategy/progress
// @access  Private
const getStrategyProgress = async (req, res) => {
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

    const sections = STRATEGY_SECTIONS.map(sectionName => ({
      name: sectionName,
      completed: visionBoard.strategySheet?.[sectionName]?.completed || false,
      hasData: visionBoard.strategySheet?.[sectionName]?.data &&
               Object.keys(visionBoard.strategySheet[sectionName].data).length > 0
    }));

    const completedCount = sections.filter(s => s.completed).length;
    const progress = Math.round((completedCount / sections.length) * 100);

    res.json({
      success: true,
      data: {
        overallProgress: progress,
        completedSections: completedCount,
        totalSections: sections.length,
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

// @desc    Get strategy sheet summary (one-page view)
// @route   GET /api/visionboards/:id/strategy/summary
// @access  Private
const getStrategySummary = async (req, res) => {
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

    const sheet = visionBoard.strategySheet || {};

    const summary = {
      companyName: sheet.companyOverview?.data?.companyName || '',
      corePurpose: sheet.corePurpose?.data?.purposeStatement || '',
      vision: sheet.vision?.data?.visionStatement || '',
      mission: sheet.mission?.data?.missionStatement || '',
      brandPromise: sheet.brandPromise?.data?.promiseStatement || '',
      bhag: sheet.bhag?.data?.bhagStatement || '',
      whoWeServe: sheet.strategySummary?.data?.whoWeServe || '',
      problemWeSolve: sheet.strategySummary?.data?.problemWeSolve || '',
      howWeMakeMoney: sheet.strategySummary?.data?.howWeMakeMoney || '',
      whyWeWin: sheet.strategySummary?.data?.whyWeWin || '',
      year1Focus: sheet.strategySummary?.data?.year1Focus || '',
      threeYearDirection: sheet.strategySummary?.data?.threeYearDirection || '',
      tenYearAmbition: sheet.strategySummary?.data?.tenYearAmbition || ''
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStrategySheet,
  updateStrategySection,
  getStrategyProgress,
  getStrategySummary,
  STRATEGY_SECTIONS
};