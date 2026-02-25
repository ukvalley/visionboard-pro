const express = require('express');
const router = express.Router();
const {
  getVisionBoards,
  getVisionBoard,
  createVisionBoard,
  updateVisionBoard,
  deleteVisionBoard,
  updateSection,
  getProgress,
  archiveVisionBoard
} = require('../controllers/visionBoardController');
const {
  getStrategySheet,
  updateStrategySection,
  getStrategyProgress,
  getStrategySummary
} = require('../controllers/strategySheetController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getVisionBoards)
  .post(protect, createVisionBoard);

router.route('/:id')
  .get(protect, getVisionBoard)
  .put(protect, updateVisionBoard)
  .delete(protect, deleteVisionBoard);

router.route('/:id/archive')
  .put(protect, archiveVisionBoard);

router.route('/:id/section/:sectionName')
  .put(protect, updateSection);

router.route('/:id/progress')
  .get(protect, getProgress);

// Strategy Sheet Routes
router.route('/:id/strategy')
  .get(protect, getStrategySheet);

router.route('/:id/strategy/:sectionName')
  .put(protect, updateStrategySection);

router.route('/:id/strategy/progress')
  .get(protect, getStrategyProgress);

router.route('/:id/strategy/summary')
  .get(protect, getStrategySummary);

module.exports = router;