const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  type: {
    type: String,
    enum: [
      'award-winning',
      'outdoor-dining', 
      'featured',
      'new-to-bookable',
      'book-tonight',
      'wine-tasting',
      'top-restaurants',
    ],
    required: true,
    index: true,
  },
  restaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookableRestaurant',
  }],
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  showOnHome: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'bookable-collections',
});

collectionSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('BookableCollection', collectionSchema);

