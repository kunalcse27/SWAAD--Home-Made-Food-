const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional, tie to a specific meal
  
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String },
  
  helpfulCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
