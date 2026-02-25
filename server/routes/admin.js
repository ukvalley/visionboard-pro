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

module.exports = router;