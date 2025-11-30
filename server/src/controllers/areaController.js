const Area = require('../models/Area');

// Get all areas
exports.getAreas = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const areas = await Area.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: areas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get area by slug
exports.getAreaBySlug = async (req, res) => {
  try {
    const area = await Area.findOne({ 
      slug: req.params.slug,
      isActive: true,
    }).lean();
    
    if (!area) {
      return res.status(404).json({ success: false, message: 'Area not found' });
    }
    
    res.json({ success: true, data: area });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

