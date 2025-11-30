const mongoose = require('mongoose');

const restaurantExperienceSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookableRestaurant',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      url: {type: String, required: true},
      alt: {type: String},
    },
    price: {
      min: {type: Number},
      max: {type: Number},
      currency: {type: String, default: 'GBP'},
      display: {type: String}, // "£50 - £79 per person"
    },
    availability: {
      hasMultipleDates: {type: Boolean, default: true},
      hasMultipleTimes: {type: Boolean, default: true},
      dates: [{type: Date}],
      times: [{type: String}],
    },
    includes: [
      {
        type: String,
      },
    ],
    duration: {
      value: {type: Number},
      unit: {type: String, enum: ['minutes', 'hours'], default: 'hours'},
    },
    groupSize: {
      min: {type: Number, default: 1},
      max: {type: Number},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'bookable-restaurant-experiences',
  },
);

module.exports = mongoose.model('BookableRestaurantExperience', restaurantExperienceSchema);
