const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  
  // Specific meal context
  date: { type: Date, required: true },
  mealType: { type: String, enum: ['lunch', 'dinner'], required: true }, // Or breakfast
  items: [{ type: String }],
  
  // Status pipeline
  status: { 
    type: String, 
    enum: ['Scheduled', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Scheduled' 
  },
  
  // Delivery tracking (if applicable)
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // role: delivery
  estimatedDeliveryTime: { type: Date },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
