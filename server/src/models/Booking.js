const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookableRestaurant',
      required: true,
      index: true,
    },
    userId: {
      type: String, // Google user ID
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    time: {
      type: String, // "19:00", "19:30", etc.
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 2,
    },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'confirmed',
      index: true,
    },
    specialRequests: {
      type: String,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    ratedAt: {
      type: Date,
    },
    confirmationNumber: {
      type: String,
      unique: true,
    },
    // Cached restaurant info for display
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantImage: {
      type: String,
    },
    restaurantCuisine: {
      type: String,
    },
    restaurantArea: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'bookable-bookings',
  }
);

// Compound index for user bookings sorted by date
bookingSchema.index({userId: 1, date: -1});
bookingSchema.index({restaurant: 1, date: 1, time: 1});

// Pre-save middleware to generate confirmation number
bookingSchema.pre('save', function (next) {
  if (!this.confirmationNumber) {
    const prefix = 'BK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.confirmationNumber = `${prefix}${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('BookableBooking', bookingSchema);

