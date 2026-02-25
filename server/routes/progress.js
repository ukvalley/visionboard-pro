const express = require('express');
const router = express.Router();
const {
  getProgressHistory,
  addMonthlyUpdate,
  getComparison,
  getAISuggestions
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.route('/:visionBoardId')
  .get(protect, getProgressHistory);

router.route('/:visionBoardId/monthly')
  .post(protect, addMonthlyUpdate);

router.route('/:visionBoardId/comparison')
  .get(protect, getComparison);

router.route('/:visionBoardId/ai-suggestions')
  .get(protect, getAISuggestions);

module.exports = router;