const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const productPlanningController = require('../controllers/productPlanningController');

// Product CRUD
router.get('/', protect, productPlanningController.getAllProducts);
router.post('/', protect, productPlanningController.createProduct);
router.get('/:id', protect, productPlanningController.getProduct);
router.put('/:id', protect, productPlanningController.updateProduct);
router.delete('/:id', protect, productPlanningController.deleteProduct);

// Duplicate product
router.post('/:id/duplicate', protect, productPlanningController.duplicateProduct);

// Step updates
router.put('/:id/problem', protect, (req, res) => productPlanningController.updateStep(req, res, 1));
router.put('/:id/audience', protect, (req, res) => productPlanningController.updateStep(req, res, 2));
router.put('/:id/validation', protect, (req, res) => productPlanningController.updateStep(req, res, 3));
router.put('/:id/solution', protect, (req, res) => productPlanningController.updateStep(req, res, 4));
router.put('/:id/market', protect, (req, res) => productPlanningController.updateStep(req, res, 5));
router.put('/:id/mvp', protect, (req, res) => productPlanningController.updateStep(req, res, 6));
router.put('/:id/visualization', protect, (req, res) => productPlanningController.updateStep(req, res, 7));
router.put('/:id/business-model', protect, (req, res) => productPlanningController.updateStep(req, res, 8));
router.put('/:id/gtm', protect, (req, res) => productPlanningController.updateStep(req, res, 9));
router.put('/:id/metrics', protect, (req, res) => productPlanningController.updateStep(req, res, 10));

// Validation score
router.get('/:id/validation-score', protect, productPlanningController.calculateValidationScore);

// Export
router.get('/:id/export', protect, productPlanningController.exportProductPlan);

module.exports = router;
