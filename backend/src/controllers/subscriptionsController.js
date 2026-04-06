const Subscription = require('../models/Subscription');
const Chef = require('../models/Chef');

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    const { chefId, planType, deliveryOption, isVegOnly, customizations, specialInstructions, totalPrice, deliveryFee } = req.body;

    const chef = await Chef.findById(chefId);
    if (!chef) return res.status(404).json({ message: 'Chef not found' });

    // Calculate end date based on plan
    const startDate = new Date();
    const endDate = new Date();
    if (planType === 'weekly') endDate.setDate(startDate.getDate() + 7);
    if (planType === 'monthly') endDate.setMonth(startDate.getMonth() + 1);
    if (planType === 'quarterly') endDate.setMonth(startDate.getMonth() + 3);

    const subscription = await Subscription.create({
      customerId: req.user._id,
      chefId,
      planType,
      deliveryOption,
      isVegOnly,
      customizations,
      specialInstructions,
      totalPrice,
      deliveryFee,
      startDate,
      endDate,
      status: 'active'
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user subscriptions
// @route   GET /api/subscriptions/my
// @access  Private
exports.getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ customerId: req.user._id })
       .populate({
         path: 'chefId',
         populate: { path: 'userId', select: 'name' }
       }).sort('-createdAt');
       
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel subscription
// @route   PATCH /api/subscriptions/:id/cancel
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, customerId: req.user._id });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    
    sub.status = 'cancelled';
    await sub.save();
    
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pause subscription
// @route   PATCH /api/subscriptions/:id/pause
// @access  Private
exports.pauseSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, customerId: req.user._id });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    
    sub.status = sub.status === 'paused' ? 'active' : 'paused';
    await sub.save();
    
    res.json({ message: `Subscription ${sub.status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
