const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    image: {
      url: {type: String, required: true},
      alt: {type: String},
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookableRestaurant',
    },
    type: {
      type: String,
      enum: ['dining', 'tasting', 'event', 'promotion'],
      default: 'dining',
    },
    price: {
      amount: {type: Number},
      currency: {type: String, default: 'GBP'},
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'bookable-experiences',
  },
);

experienceSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('BookableExperience', experienceSchema);
