const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['system', 'order', 'subscription'], default: 'system' },
  read: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed }, // Arbitrary payload (e.g., link to order)
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
