const mongoose = require('mongoose');

const DayMenuSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  date: { type: Date }, // Optional: store specific dates if planning ahead
  lunch: [{ type: String }],
  lunchDesc: { type: String },
  dinner: [{ type: String }],
  dinnerDesc: { type: String },
  isSpecial: { type: Boolean, default: false },
  isRest: { type: Boolean, default: false }
});

const MenuSchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }, // Draft or Published
  weekStart: { type: Date }, // Start date for the week
  days: [DayMenuSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', MenuSchema);
