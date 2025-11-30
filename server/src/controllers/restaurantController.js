const Restaurant = require('../models/Restaurant');

// Get all restaurants with filtering
exports.getRestaurants = async (req, res) => {
  try {
    const {
      cuisine,
      area,
      priceLevel,
      minRating,
      hasOutdoorDining,
      isAwardWinning,
      limit = 20,
      page = 1,
    } = req.query;

    const filter = {isActive: true};

    if (cuisine) {
      filter.cuisine = cuisine;
    }
    if (area) {
      filter.areaName = area;
    }
    if (priceLevel) {
      filter.priceLevel = priceLevel;
    }
    if (minRating) {
      filter.rating = {$gte: parseFloat(minRating)};
    }
    if (hasOutdoorDining === 'true') {
      filter.hasOutdoorDining = true;
    }
    if (isAwardWinning === 'true') {
      filter.isAwardWinning = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const restaurants = await Restaurant.find(filter)
      .sort({rating: -1, reviewCount: -1})
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) {
      return res.status(404).json({success: false, message: 'Restaurant not found'});
    }
    res.json({success: true, data: restaurant});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get award-winning restaurants
exports.getAwardWinning = async (req, res) => {
  try {
    const {limit = 10} = req.query;
    const restaurants = await Restaurant.find({
      isActive: true,
      isAwardWinning: true,
    })
      .sort({rating: -1})
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: restaurants});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get restaurants with outdoor dining
exports.getOutdoorDining = async (req, res) => {
  try {
    const {limit = 10} = req.query;
    const restaurants = await Restaurant.find({
      isActive: true,
      hasOutdoorDining: true,
      'timeSlots.0': {$exists: true},
    })
      .sort({rating: -1})
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: restaurants});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get featured restaurants
exports.getFeatured = async (req, res) => {
  try {
    const {limit = 10} = req.query;
    const restaurants = await Restaurant.find({
      isActive: true,
      isFeatured: true,
      rewardPoints: {$gt: 0},
    })
      .sort({rewardPoints: -1, rating: -1})
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: restaurants});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get new restaurants
exports.getNewToBookable = async (req, res) => {
  try {
    const {limit = 10} = req.query;
    const restaurants = await Restaurant.find({
      isActive: true,
      isNewToBookable: true,
    })
      .sort({createdAt: -1})
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: restaurants});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get top restaurants this week
exports.getTopRestaurants = async (req, res) => {
  try {
    const {type = 'booked', limit = 5} = req.query;

    let sortField;
    let rankField;

    switch (type) {
      case 'viewed':
        sortField = {'stats.weeklyViews': -1};
        rankField = 'rank.topViewed';
        break;
      case 'saved':
        sortField = {'stats.weeklySaves': -1};
        rankField = 'rank.topSaved';
        break;
      default:
        sortField = {'stats.weeklyBookings': -1};
        rankField = 'rank.topBooked';
    }

    const restaurants = await Restaurant.find({
      isActive: true,
      [rankField]: {$exists: true, $lte: parseInt(limit)},
    })
      .sort(sortField)
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: restaurants});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get wine tasting restaurants
exports.getWineTasting = async (req, res) => {
  try {
    const {limit = 10} = req.query;
    const restaurants = await Restaurant.find({
      isActive: true,
      features: 'Wine tasting',
    })
      .sort({rating: -1})
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: restaurants});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get book for tonight
exports.getBookTonight = async (req, res) => {
  try {
    const {limit = 10} = req.query;
    const restaurants = await Restaurant.find({
      isActive: true,
      'timeSlots.0': {$exists: true},
      rewardPoints: {$gt: 0},
    })
      .sort({rewardPoints: -1, rating: -1})
      .limit(parseInt(limit))
      .lean();

    res.json({success: true, data: restaurants});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};
