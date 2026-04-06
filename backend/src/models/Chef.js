const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  kitchenName: { type: String, required: true },
  bio: { type: String },
  experience: { type: String },
  cuisines: [{ type: String }],
  isVeg: { type: Boolean, default: false },
  specialty: { type: String },
  avatar: { type: String },
  image: { type: String }, // Cover image
  
  // Location
  location: { type: String },
  coordinates: {
    lat: Number,
    lng: Number
  },
  
  // Pricing
  subscriptions: {
    weekly: { type: Number, required: true },
    monthly: { type: Number, required: true },
    quarterly: { type: Number, required: true }
  },
  
  // Metrics (computed or populated)
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chef', ChefSchema);
