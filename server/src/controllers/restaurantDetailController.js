const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');
const RestaurantExperience = require('../models/RestaurantExperience');

// Get restaurant detail by slug
exports.getRestaurantBySlug = async (req, res) => {
  try {
    const {slug} = req.params;

    const restaurant = await Restaurant.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    res.json({success: true, data: restaurant});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get full restaurant detail with all related data
exports.getRestaurantFullDetail = async (req, res) => {
  try {
    const {slug} = req.params;

    const restaurant = await Restaurant.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Fetch all related data in parallel
    const [menuItems, reviews, experiences] = await Promise.all([
      MenuItem.find({
        restaurant: restaurant._id,
        isActive: true,
      })
        .sort({isPopular: -1, displayOrder: 1})
        .limit(10)
        .lean(),

      Review.find({
        restaurant: restaurant._id,
        isActive: true,
      })
        .sort({createdAt: -1})
        .limit(5)
        .lean(),

      RestaurantExperience.find({
        restaurant: restaurant._id,
        isActive: true,
      })
        .sort({displayOrder: 1})
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        ...restaurant,
        menu: {
          popularItems: menuItems.filter(item => item.isPopular),
          allItems: menuItems,
        },
        reviews: {
          items: reviews,
          total: restaurant.reviewCount,
        },
        experiences,
      },
    });
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get menu items for a restaurant
exports.getRestaurantMenu = async (req, res) => {
  try {
    const {slug} = req.params;
    const {category, popular} = req.query;

    const restaurant = await Restaurant.findOne({slug, isActive: true}).lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const filter = {restaurant: restaurant._id, isActive: true};
    if (category) {
      filter.category = category;
    }
    if (popular === 'true') {
      filter.isPopular = true;
    }

    const menuItems = await MenuItem.find(filter).sort({isPopular: -1, displayOrder: 1}).lean();

    res.json({success: true, data: menuItems});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get reviews for a restaurant
exports.getRestaurantReviews = async (req, res) => {
  try {
    const {slug} = req.params;
    const {limit = 10, page = 1, sort = 'recent'} = req.query;

    const restaurant = await Restaurant.findOne({slug, isActive: true}).lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    let sortOption = {createdAt: -1};
    if (sort === 'highest') {
      sortOption = {'ratings.overall': -1};
    }
    if (sort === 'lowest') {
      sortOption = {'ratings.overall': 1};
    }
    if (sort === 'helpful') {
      sortOption = {helpfulCount: -1};
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({
      restaurant: restaurant._id,
      isActive: true,
    })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments({
      restaurant: restaurant._id,
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        items: reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get experiences for a restaurant
exports.getRestaurantExperiences = async (req, res) => {
  try {
    const {slug} = req.params;

    const restaurant = await Restaurant.findOne({slug, isActive: true}).lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const experiences = await RestaurantExperience.find({
      restaurant: restaurant._id,
      isActive: true,
    })
      .sort({displayOrder: 1})
      .lean();

    res.json({success: true, data: experiences});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Get restaurants by cuisine
exports.getRestaurantsByCuisine = async (req, res) => {
  try {
    const {cuisine} = req.params;
    const {limit = 20, page = 1} = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const restaurants = await Restaurant.find({
      cuisine: {$regex: new RegExp(`^${cuisine}$`, 'i')},
      isActive: true,
    })
      .sort({rating: -1, reviewCount: -1})
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Restaurant.countDocuments({
      cuisine: {$regex: new RegExp(`^${cuisine}$`, 'i')},
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        cuisine,
        restaurants,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};
