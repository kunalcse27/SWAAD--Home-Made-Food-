const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  planType: { type: String, enum: ['weekly', 'monthly', 'quarterly'], required: true },
  deliveryOption: { type: String, enum: ['home', 'pickup'], default: 'home' },
  
  // Customizations
  isVegOnly: { type: Boolean, default: false },
  customizations: [{ type: String }],
  specialInstructions: { type: String },
  
  // Pricing
  totalPrice: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  
  // State
  status: { type: String, enum: ['active', 'paused', 'cancelled', 'completed'], default: 'active' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
