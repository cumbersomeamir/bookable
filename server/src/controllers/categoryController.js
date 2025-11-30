const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const {limit = 10} = req.query;
    const categories = await Category.find({isActive: true})
      .sort({displayOrder: 1})
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: categories});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!category) {
      return res.status(404).json({success: false, message: 'Category not found'});
    }

    res.json({success: true, data: category});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};
