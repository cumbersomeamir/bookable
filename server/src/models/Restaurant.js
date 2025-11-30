const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // "19:15", "19:30", etc.
  available: { type: Boolean, default: true },
  points: { type: Number, default: 0 }, // Reward points for booking this slot
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
  }],
  cuisine: {
    type: String,
    required: true,
    index: true,
  },
  priceLevel: {
    type: String,
    enum: ['£', '££', '£££', '££££'],
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookableArea',
    index: true,
  },
  areaName: {
    type: String,
    index: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
    address: String,
    city: { type: String, default: 'London' },
    country: { type: String, default: 'United Kingdom' },
  },
  distance: {
    value: { type: Number }, // in yards or miles
    unit: { type: String, enum: ['yd', 'mi'], default: 'yd' },
    display: { type: String }, // "750 yd", "0.65 mi"
  },
  badges: [{
    type: String,
    enum: ['Award-winning', 'Promoted', 'New', 'Popular', 'Michelin'],
  }],
  features: [{
    type: String,
    enum: ['Outdoor dining', 'Wine tasting', 'Private dining', 'Vegan options', 'Gluten-free'],
  }],
  timeSlots: [timeSlotSchema],
  isPromoted: {
    type: Boolean,
    default: false,
    index: true,
  },
  isAwardWinning: {
    type: Boolean,
    default: false,
    index: true,
  },
  hasOutdoorDining: {
    type: Boolean,
    default: false,
    index: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  isNewToBookable: {
    type: Boolean,
    default: false,
    index: true,
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
  stats: {
    weeklyBookings: { type: Number, default: 0 },
    weeklyViews: { type: Number, default: 0 },
    weeklySaves: { type: Number, default: 0 },
  },
  rank: {
    topBooked: { type: Number },
    topViewed: { type: Number },
    topSaved: { type: Number },
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  description: String,
  phone: String,
  website: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'bookable-restaurants',
});

// Indexes for geospatial queries
restaurantSchema.index({ 'location.coordinates': '2dsphere' });
restaurantSchema.index({ cuisine: 1, rating: -1 });
restaurantSchema.index({ 'stats.weeklyBookings': -1 });

// Pre-save middleware to generate slug
restaurantSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('BookableRestaurant', restaurantSchema);

