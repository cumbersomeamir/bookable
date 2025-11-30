const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
    },
    image: {
      url: {type: String, required: true},
      alt: {type: String},
    },
    link: {
      type: String,
    },
    type: {
      type: String,
      enum: ['get-inspired', 'banner', 'sponsored'],
      default: 'get-inspired',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: true,
    collection: 'bookable-promotions',
  },
);

module.exports = mongoose.model('BookablePromotion', promotionSchema);
