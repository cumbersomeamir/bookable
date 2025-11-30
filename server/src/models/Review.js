const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookableRestaurant',
      required: true,
      index: true,
    },
    user: {
      name: {type: String, required: true},
      avatar: {type: String},
      location: {type: String},
    },
    ratings: {
      overall: {type: Number, min: 1, max: 5, required: true},
      food: {type: Number, min: 1, max: 5},
      service: {type: Number, min: 1, max: 5},
      ambience: {type: Number, min: 1, max: 5},
      value: {type: Number, min: 1, max: 5},
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    visitDate: {
      type: Date,
    },
    visitType: {
      type: String,
      enum: ['dinner', 'lunch', 'brunch', 'breakfast'],
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    photos: [
      {
        url: {type: String},
        alt: {type: String},
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    restaurantResponse: {
      content: {type: String},
      respondedAt: {type: Date},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'bookable-reviews',
  },
);

// Index for sorting
reviewSchema.index({restaurant: 1, createdAt: -1});
reviewSchema.index({restaurant: 1, 'ratings.overall': -1});

module.exports = mongoose.model('BookableReview', reviewSchema);
