const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  deleteUser,
  getAnalytics,
  getAllVisionBoards
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

router.use(protect);
router.use(adminOnly);

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/analytics')
  .get(getAnalytics);

router.route('/visionboards')
  .get(getAllVisionBoards);

router.route('/users/:userId/visionboards')
  .get(async (req, res) => {
    try {
      const VisionBoard = require('../models/VisionBoard');
      const visionBoards = await VisionBoard.find({ userId: req.params.userId })
        .sort({ createdAt: -1 });
      res.json({
        success: true,
        data: visionBoards
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

module.exports = router;