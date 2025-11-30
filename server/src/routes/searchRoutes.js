const express = require('express');
const router = express.Router();
const {Restaurant} = require('../models');

// GET /api/search - Search restaurants with filters
router.get('/', async (req, res) => {
  try {
    const {
      query = '',
      cuisine,
      area,
      priceLevel,
      features,
      sort = 'rating',
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter object
    const filter = {isActive: true};

    // Text search on name
    if (query) {
      filter.name = {$regex: query, $options: 'i'};
    }

    // Cuisine filter
    if (cuisine) {
      filter.cuisine = {$regex: cuisine, $options: 'i'};
    }

    // Area filter
    if (area) {
      filter.areaName = {$regex: area, $options: 'i'};
    }

    // Price level filter
    if (priceLevel) {
      filter.priceLevel = priceLevel;
    }

    // Features filter (e.g., Outdoor dining, Wine tasting)
    if (features) {
      const featuresArray = features.split(',');
      filter.features = {$in: featuresArray};
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = {rating: -1};
        break;
      case 'reviews':
        sortOption = {reviewCount: -1};
        break;
      case 'price_low':
        sortOption = {priceLevel: 1};
        break;
      case 'price_high':
        sortOption = {priceLevel: -1};
        break;
      case 'distance':
        sortOption = {'distance.value': 1};
        break;
      default:
        sortOption = {rating: -1};
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit)).lean(),
      Restaurant.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        restaurants,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
});

// GET /api/search/filters - Get available filter options
router.get('/filters', async (req, res) => {
  try {
    const [cuisines, areas, features] = await Promise.all([
      Restaurant.distinct('cuisine', {isActive: true}),
      Restaurant.distinct('areaName', {isActive: true}),
      Restaurant.distinct('features', {isActive: true}),
    ]);

    res.json({
      success: true,
      data: {
        cuisines: cuisines.filter(Boolean).sort(),
        areas: areas.filter(Boolean).sort(),
        features: features.filter(Boolean).sort(),
        priceLevels: ['£', '££', '£££', '££££'],
      },
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filters',
      error: error.message,
    });
  }
});

// GET /api/search/nearby - Get restaurants near coordinates
router.get('/nearby', async (req, res) => {
  try {
    const {lat, lng, radius = 5000} = req.query; // radius in meters

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const restaurants = await Restaurant.find({
      isActive: true,
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    })
      .limit(50)
      .lean();

    res.json({
      success: true,
      data: {
        restaurants,
        total: restaurants.length,
      },
    });
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      success: false,
      message: 'Nearby search failed',
      error: error.message,
    });
  }
});

module.exports = router;
