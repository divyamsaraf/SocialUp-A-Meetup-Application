const Category = require("../models/category.model");

/**
 * Get all active categories
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    
    res.status(200).json({
      status: "success",
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category (Admin only)
 * POST /api/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, icon, description, displayOrder } = req.body;
    
    const category = await Category.create({
      name,
      icon: icon || "📅",
      description,
      displayOrder: displayOrder || 0,
    });
    
    res.status(201).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Category with this name already exists",
      });
    }
    next(error);
  }
};

/**
 * Update a category (Admin only)
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, description, isActive, displayOrder } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, icon, description, isActive, displayOrder },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }
    
    res.status(200).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category (Admin only)
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }
    
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
