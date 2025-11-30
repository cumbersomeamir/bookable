const Experience = require('../models/Experience');

// Get all experiences
exports.getExperiences = async (req, res) => {
  try {
    const { limit = 10, featured } = req.query;
    const filter = { isActive: true };
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const experiences = await Experience.find(filter)
      .populate('restaurant')
      .sort({ displayOrder: 1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured experiences
exports.getFeaturedExperiences = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const experiences = await Experience.find({ 
      isActive: true,
      isFeatured: true,
    })
      .populate('restaurant')
      .sort({ displayOrder: 1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

