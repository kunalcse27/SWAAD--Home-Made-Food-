const Chef = require('../models/Chef');
const Menu = require('../models/Menu');
const Subscription = require('../models/Subscription');
const Order = require('../models/Order');

// Helper to get chef profile for logged in user
const getMyChefProfile = async (userId) => {
  return await Chef.findOne({ userId });
};

// @desc    Get dashboard stats
// @route   GET /api/chef-dashboard/stats
// @access  Private (Chef)
exports.getDashboardStats = async (req, res) => {
  try {
    const chef = await getMyChefProfile(req.user._id);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
    
    // Aggregations could go here e.g. total active subs, this week earnings
    const totalSubs = await Subscription.countDocuments({ chefId: chef._id, status: 'active' });
    const pendingOrders = await Order.countDocuments({ chefId: chef._id, status: { $in: ['Scheduled', 'Preparing'] } });
    
    res.json({
      totalSubscribers: totalSubs,
      pendingOrders,
      rating: chef.rating,
      issues: 0 // Mock sentiment metric
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update chef profile
// @route   PUT /api/chef-dashboard/profile
// @access  Private (Chef)
exports.updateProfile = async (req, res) => {
  try {
    const chef = await getMyChefProfile(req.user._id);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
    
    const updatableFields = ['kitchenName', 'bio', 'cuisines', 'isVeg', 'specialty', 'location', 'subscriptions'];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        chef[field] = req.body[field];
      }
    });
    
    // Example format for subscriptions: { weekly: 700, monthly: 2500, quarterly: 6500 }
    
    await chef.save();
    res.json(chef);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chef orders/subscribers
// @route   GET /api/chef-dashboard/orders
// @access  Private (Chef)
exports.getChefOrders = async (req, res) => {
  try {
    const chef = await getMyChefProfile(req.user._id);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
    
    const orders = await Order.find({ chefId: chef._id })
       .populate('customerId', 'name email avatar mobile')
       .sort('-date');
       
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my menu draft/published
// @route   GET /api/chef-dashboard/menu
// @access  Private (Chef)
exports.getMyMenu = async (req, res) => {
  try {
    const chef = await getMyChefProfile(req.user._id);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
    
    let menu = await Menu.findOne({ chefId: chef._id }).sort('-createdAt');
    if (!menu) {
      // Create empty draft
      menu = await Menu.create({ chefId: chef._id, status: 'Draft', days: [] });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu days (drafting)
// @route   PUT /api/chef-dashboard/menu
// @access  Private (Chef)
exports.updateMenu = async (req, res) => {
  try {
    const { days } = req.body; // Array of day objects
    const chef = await getMyChefProfile(req.user._id);
    
    let menu = await Menu.findOne({ chefId: chef._id, status: 'Draft' });
    if (!menu) {
       menu = await Menu.findOne({ chefId: chef._id }).sort('-createdAt');
       // If published, create new draft based on it or just override
       // For simplicity, we just override latest
    }
    
    menu.days = days;
    menu.updatedAt = Date.now();
    await menu.save();
    
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish menu
// @route   POST /api/chef-dashboard/menu/publish
// @access  Private (Chef)
exports.publishMenu = async (req, res) => {
  try {
    const chef = await getMyChefProfile(req.user._id);
    const menu = await Menu.findOne({ chefId: chef._id }).sort('-createdAt');
    
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    
    menu.status = 'Published';
    menu.updatedAt = Date.now();
    await menu.save();
    
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
