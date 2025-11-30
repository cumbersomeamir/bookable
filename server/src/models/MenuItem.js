const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookableRestaurant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      url: {type: String},
      alt: {type: String},
    },
    category: {
      type: String,
      enum: ['starter', 'main', 'dessert', 'drink', 'side', 'popular'],
      default: 'main',
    },
    price: {
      amount: {type: Number},
      currency: {type: String, default: 'GBP'},
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    photoCount: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    dietary: [
      {
        type: String,
        enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'],
      },
    ],
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
    collection: 'bookable-menu-items',
  },
);

module.exports = mongoose.model('BookableMenuItem', menuItemSchema);
