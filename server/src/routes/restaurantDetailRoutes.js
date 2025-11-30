const express = require('express');
const router = express.Router();
const restaurantDetailController = require('../controllers/restaurantDetailController');

// Get restaurant by slug (basic info)
router.get('/slug/:slug', restaurantDetailController.getRestaurantBySlug);

// Get full restaurant detail with menu, reviews, experiences
router.get('/slug/:slug/full', restaurantDetailController.getRestaurantFullDetail);

// Get restaurant menu
router.get('/slug/:slug/menu', restaurantDetailController.getRestaurantMenu);

// Get restaurant reviews
router.get('/slug/:slug/reviews', restaurantDetailController.getRestaurantReviews);

// Get restaurant experiences
router.get('/slug/:slug/experiences', restaurantDetailController.getRestaurantExperiences);

// Get restaurants by cuisine
router.get('/cuisine/:cuisine', restaurantDetailController.getRestaurantsByCuisine);

module.exports = router;
