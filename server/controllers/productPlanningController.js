const ProductPlanning = require('../models/ProductPlanning');

// Get all products for user
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductPlanning.find({
      user: req.user.id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products.' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await ProductPlanning.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product.' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, status } = req.body;

    const product = new ProductPlanning({
      user: req.user.id,
      name,
      category,
      status: status || 'idea'
    });

    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Failed to create product.' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await ProductPlanning.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
};

// Delete product (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductPlanning.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product.' });
  }
};

// Duplicate product
exports.duplicateProduct = async (req, res) => {
  try {
    const originalProduct = await ProductPlanning.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!originalProduct) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const productData = originalProduct.toObject();
    delete productData._id;
    delete productData.createdAt;
    delete productData.updatedAt;

    const duplicatedProduct = new ProductPlanning({
      ...productData,
      name: `${originalProduct.name} (Copy)`,
      user: req.user.id,
      status: 'idea'
    });

    await duplicatedProduct.save();

    res.json({ success: true, data: duplicatedProduct });
  } catch (error) {
    console.error('Error duplicating product:', error);
    res.status(500).json({ success: false, error: 'Failed to duplicate product.' });
  }
};

// Update specific step
exports.updateStep = async (req, res, stepNumber) => {
  try {

    const product = await ProductPlanning.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        $set: req.body,
        $addToSet: { completedSteps: stepNumber }
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ success: false, error: 'Failed to update step.' });
  }
};

// Calculate validation score
exports.calculateValidationScore = async (req, res) => {
  try {
    const product = await ProductPlanning.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    let score = 0;

    // Interviews conducted (max 30 points)
    const interviews = parseInt(product.interviewsConducted) || 0;
    if (interviews >= 10) score += 30;
    else if (interviews >= 5) score += 20;
    else if (interviews >= 1) score += 10;

    // Currently paying (max 30 points)
    if (product.currentlyPaying === 'yes') score += 30;
    else if (product.currentlyPaying === 'trying') score += 15;

    // Willingness to pay (max 40 points)
    if (product.willingnessToPay?.includes('paid')) score += 40;
    else if (product.willingnessToPay?.includes('premium')) score += 25;
    else if (product.willingnessToPay) score += 10;

    res.json({ success: true, data: { score, maxScore: 100 } });
  } catch (error) {
    console.error('Error calculating validation score:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate validation score.' });
  }
};

// Export product plan
exports.exportProductPlan = async (req, res) => {
  try {
    const product = await ProductPlanning.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    // For now, return JSON. PDF generation can be added later
    res.json({
      success: true,
      data: {
        productName: product.name,
        exportDate: new Date(),
        productPlan: product.toObject()
      }
    });
  } catch (error) {
    console.error('Error exporting product plan:', error);
    res.status(500).json({ success: false, error: 'Failed to export product plan.' });
  }
};
