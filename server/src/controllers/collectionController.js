const Collection = require('../models/Collection');

// Get all collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true, showOnHome: true })
      .populate('restaurants')
      .sort({ displayOrder: 1 })
      .lean();

    res.json({ success: true, data: collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get collection by type
exports.getCollectionByType = async (req, res) => {
  try {
    const collection = await Collection.findOne({ 
      type: req.params.type,
      isActive: true,
    })
      .populate('restaurants')
      .lean();
    
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    
    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

