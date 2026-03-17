const RatingCategory = require('../models/RatingCategory');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await RatingCategory.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_CATEGORIES_ERROR',
        message: 'Failed to fetch categories'
      }
    });
  }
};

// Get all categories (including inactive) - Admin only
const getAllCategories = async (req, res) => {
  try {
    const categories = await RatingCategory.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error('Error fetching all categories:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_CATEGORIES_ERROR',
        message: 'Failed to fetch categories'
      }
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, description, feedbackType } = req.body;

    // Validation
    if (!name || !feedbackType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name and feedback type are required'
        }
      });
    }

    // Check if category already exists
    const existingCategory = await RatingCategory.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      feedbackType 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CATEGORY_EXISTS',
          message: 'Category with this name already exists for this feedback type'
        }
      });
    }

    const category = await RatingCategory.create({
      name,
      description,
      feedbackType,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_CATEGORY_ERROR',
        message: 'Failed to create category'
      }
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, feedbackType, isActive } = req.body;

    const category = await RatingCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: 'Category not found'
        }
      });
    }

    // Check for duplicate name if name is being changed
    if (name && name !== category.name) {
      const existingCategory = await RatingCategory.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        feedbackType: feedbackType || category.feedbackType
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CATEGORY_EXISTS',
            message: 'Category with this name already exists'
          }
        });
      }
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (feedbackType) category.feedbackType = feedbackType;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_CATEGORY_ERROR',
        message: 'Failed to update category'
      }
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await RatingCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: 'Category not found'
        }
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_CATEGORY_ERROR',
        message: 'Failed to delete category'
      }
    });
  }
};

module.exports = {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
