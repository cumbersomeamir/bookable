const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const Area = require('../models/Area');
const Experience = require('../models/Experience');
const Promotion = require('../models/Promotion');

// Get all home page data in one call for performance
exports.getHomeData = async (req, res) => {
  try {
    const [
      awardWinning,
      outdoorDining,
      featured,
      newToBookable,
      bookTonight,
      wineTasting,
      topBooked,
      topViewed,
      topSaved,
      categories,
      areas,
      experiences,
      promotions,
    ] = await Promise.all([
      // Award-winning restaurants
      Restaurant.find({ isActive: true, isAwardWinning: true })
        .sort({ rating: -1 })
        .limit(10)
        .lean(),
      
      // Outdoor dining
      Restaurant.find({ isActive: true, hasOutdoorDining: true, 'timeSlots.0': { $exists: true } })
        .sort({ rating: -1 })
        .limit(10)
        .lean(),
      
      // Featured restaurants
      Restaurant.find({ isActive: true, isFeatured: true, rewardPoints: { $gt: 0 } })
        .sort({ rewardPoints: -1, rating: -1 })
        .limit(10)
        .lean(),
      
      // New to Bookable
      Restaurant.find({ isActive: true, isNewToBookable: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      
      // Book for tonight
      Restaurant.find({ isActive: true, 'timeSlots.0': { $exists: true }, rewardPoints: { $gt: 0 } })
        .sort({ rewardPoints: -1, rating: -1 })
        .limit(10)
        .lean(),
      
      // Wine tasting
      Restaurant.find({ isActive: true, features: 'Wine tasting' })
        .sort({ rating: -1 })
        .limit(10)
        .lean(),
      
      // Top booked
      Restaurant.find({ isActive: true, 'rank.topBooked': { $exists: true, $lte: 5 } })
        .sort({ 'rank.topBooked': 1 })
        .limit(5)
        .lean(),
      
      // Top viewed
      Restaurant.find({ isActive: true, 'rank.topViewed': { $exists: true, $lte: 5 } })
        .sort({ 'rank.topViewed': 1 })
        .limit(5)
        .lean(),
      
      // Top saved
      Restaurant.find({ isActive: true, 'rank.topSaved': { $exists: true, $lte: 5 } })
        .sort({ 'rank.topSaved': 1 })
        .limit(5)
        .lean(),
      
      // Categories
      Category.find({ isActive: true })
        .sort({ displayOrder: 1 })
        .limit(10)
        .lean(),
      
      // Areas
      Area.find({ isActive: true })
        .sort({ displayOrder: 1 })
        .limit(10)
        .lean(),
      
      // Featured experiences
      Experience.find({ isActive: true, isFeatured: true })
        .sort({ displayOrder: 1 })
        .limit(10)
        .lean(),
      
      // Promotions / Get inspired
      Promotion.find({ isActive: true, type: 'get-inspired' })
        .sort({ displayOrder: 1 })
        .limit(5)
        .lean(),
    ]);

    // Get greeting based on time
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';

    res.json({
      success: true,
      data: {
        greeting,
        sections: {
          bookTonight: {
            title: 'Book for dinner tonight',
            subtitle: null,
            data: bookTonight,
          },
          awardWinning: {
            title: 'Award-winning',
            subtitle: 'Restaurants that have won notable industry rewards with tables available today.',
            data: awardWinning,
          },
          outdoorDining: {
            title: 'Outdoor dining',
            subtitle: 'Restaurants with outdoor tables available tonight.',
            data: outdoorDining,
          },
          topRestaurants: {
            title: 'Top restaurants this week',
            subtitle: 'Explore what\'s popular with other diners with these lists, updated weekly.',
            tabs: {
              topBooked: { title: 'Top booked', data: topBooked },
              topViewed: { title: 'Top viewed', data: topViewed },
              topSaved: { title: 'Top saved', data: topSaved },
            },
          },
          featured: {
            title: 'Featured restaurants',
            subtitle: 'Restaurants offering points with availability tonight.',
            data: featured,
          },
          newToBookable: {
            title: 'New to Bookable',
            subtitle: 'Restaurants new to Bookable with tables tonight.',
            data: newToBookable,
          },
          wineTasting: {
            title: 'Wine tasting',
            subtitle: 'Bookable times for wine tasting tonight.',
            data: wineTasting,
          },
          featuredExperiences: {
            title: 'Featured Experiences',
            subtitle: 'Find a unique dining experience and let restaurants show you the best they have to offer.',
            data: experiences,
          },
          getInspired: {
            title: 'Get inspired',
            data: promotions,
          },
          cuisines: {
            title: 'Browse by cuisine',
            data: categories,
          },
          areas: {
            title: 'Explore the area',
            data: areas,
          },
        },
      },
    });
  } catch (error) {
    console.error('Home data error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

