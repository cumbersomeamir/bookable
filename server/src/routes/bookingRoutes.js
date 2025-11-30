const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      restaurantId,
      userId,
      userEmail,
      userName,
      date,
      time,
      partySize,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!restaurantId || !userId || !userEmail || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: restaurantId, userId, userEmail, date, time',
      });
    }

    // Get restaurant details
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Find matching time slot to get points
    const timeSlot = restaurant.timeSlots?.find(slot => slot.time === time);
    const pointsEarned = timeSlot?.points || 0;

    // Get primary image
    const primaryImage = restaurant.images?.find(img => img.isPrimary)?.url || 
                         restaurant.images?.[0]?.url || '';

    // Create booking
    const booking = new Booking({
      restaurant: restaurantId,
      userId,
      userEmail,
      userName: userName || 'Guest',
      date: new Date(date),
      time,
      partySize: partySize || 2,
      specialRequests,
      pointsEarned,
      restaurantName: restaurant.name,
      restaurantImage: primaryImage,
      restaurantCuisine: restaurant.cuisine,
      restaurantArea: restaurant.areaName,
    });

    await booking.save();

    // Update restaurant booking stats
    await Restaurant.findByIdAndUpdate(restaurantId, {
      $inc: {'stats.weeklyBookings': 1, todayBookings: 1},
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
});

// Get user's bookings
router.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;
    const {status, page = 1, limit = 20} = req.query;

    const query = {userId};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .sort({date: -1, createdAt: -1})
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Booking.countDocuments(query);

    // Separate into upcoming and past
    const now = new Date();
    const upcoming = [];
    const past = [];

    bookings.forEach(booking => {
      const bookingDate = new Date(booking.date);
      if (bookingDate >= now && booking.status === 'confirmed') {
        upcoming.push(booking);
      } else {
        // Mark as completed if in the past and still confirmed
        if (booking.status === 'confirmed' && bookingDate < now) {
          booking.status = 'completed';
        }
        past.push(booking);
      }
    });

    res.json({
      success: true,
      data: {
        upcoming,
        past,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('restaurant', 'name images cuisine areaName phone fullAddress')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message,
    });
  }
});

// Cancel booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const {userId} = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify user owns this booking
    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed bookings can be cancelled',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
});

// Rate a completed booking
router.patch('/:id/rate', async (req, res) => {
  try {
    const {userId, rating} = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this booking',
      });
    }

    if (booking.rating) {
      return res.status(400).json({
        success: false,
        message: 'Booking already rated',
      });
    }

    booking.rating = rating;
    booking.ratedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Thank you for your rating!',
      data: booking,
    });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate booking',
      error: error.message,
    });
  }
});

module.exports = router;

