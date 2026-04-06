const Chef = require('../models/Chef');
const Menu = require('../models/Menu');
const Review = require('../models/Review');

// @desc    Get all chefs
// @route   GET /api/chefs
// @access  Public
exports.getChefs = async (req, res) => {
  try {
    const { q, filter } = req.query;
    
    let query = {};
    
    // Simplistic search
    if (q) {
      query.$or = [
        { kitchenName: { $regex: q, $options: 'i' } },
        { cuisines: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    // Filters logic
    if (filter) {
       if (filter === 'veg') query.isVeg = true;
       if (filter === 'jain') query.cuisines = { $in: ['Jain'] };
       if (filter === 'south-indian') query.cuisines = { $in: [/South/i] };
       if (filter === 'north-indian') query.cuisines = { $in: [/North/i] };
       if (filter === 'gujarati') query.cuisines = { $in: ['Gujarati'] };
       if (filter === 'under-2000') query['subscriptions.monthly'] = { $lt: 2000 };
       if (filter === 'under-3000') query['subscriptions.monthly'] = { $lt: 3000 };
       if (filter === 'top-rated') query.rating = { $gte: 4.8 };
    }

    const chefs = await Chef.find(query).populate('userId', 'name avatar');
    
    // Format for frontend
    const formattedChefs = chefs.map(c => ({
      id: c._id,
      name: c.userId ? c.userId.name : 'Unknown User',
      kitchen: c.kitchenName,
      avatar: c.avatar || (c.userId && c.userId.avatar) || "https://i.pravatar.cc/150",
      rating: c.rating,
      reviews: c.reviewsCount,
      experience: c.experience || 'New',
      location: c.location || 'Unknown',
      distance: "2.5 km", // Hardcoded mock distance for now
      cuisines: c.cuisines,
      isVeg: c.isVeg,
      image: c.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
      price: c.subscriptions.monthly,
      meals: "Lunch + Dinner",
      specialty: c.specialty || "Homemade food",
      verified: c.isVerified,
      subscriptions: c.subscriptions,
      badge: c.rating >= 4.8 ? "Top Rated" : ""
    }));

    res.json(formattedChefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single chef by ID
// @route   GET /api/chefs/:id
// @access  Public
exports.getChefById = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).populate('userId', 'name avatar');
    
    if (!chef) return res.status(404).json({ message: 'Chef not found' });
    
    const formattedChef = {
      id: chef._id,
      name: chef.userId ? chef.userId.name : 'Unknown',
      kitchen: chef.kitchenName,
      avatar: chef.avatar || (chef.userId && chef.userId.avatar) || "https://i.pravatar.cc/150",
      rating: chef.rating,
      reviews: chef.reviewsCount,
      experience: chef.experience || 'New',
      location: chef.location || 'Unknown',
      distance: "2.5 km",
      cuisines: chef.cuisines,
      isVeg: chef.isVeg,
      image: chef.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
      price: chef.subscriptions.monthly,
      meals: "Lunch + Dinner",
      specialty: chef.specialty || "Homemade food",
      verified: chef.isVerified,
      subscriptions: chef.subscriptions,
      badge: ""
    };
    
    res.json(formattedChef);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chef menu
// @route   GET /api/chefs/:id/menu
// @access  Public
exports.getChefMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ chefId: req.params.id, status: 'Published' }).sort('-createdAt');
    if (!menu) {
      return res.json({}); // Return empty if no published menu
    }
    
    // Format to match frontend structure: { Monday: { lunch: [], dinner: [] }, ... }
    const formattedMenu = {};
    menu.days.forEach(d => {
       formattedMenu[d.day] = {
         lunch: d.lunch || [],
         dinner: d.dinner || [],
         isRest: d.isRest,
         isSpecial: d.isSpecial
       };
    });
    
    res.json(formattedMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chef reviews
// @route   GET /api/chefs/:id/reviews
// @access  Public
exports.getChefReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ chefId: req.params.id }).populate('customerId', 'name avatar').sort('-createdAt');
    
    const formattedReviews = reviews.map(r => ({
      id: r._id,
      name: r.customerId ? r.customerId.name : 'Unknown User',
      avatar: (r.customerId && r.customerId.avatar) || "https://i.pravatar.cc/150",
      rating: r.rating,
      date: r.createdAt.toLocaleDateString(),
      text: r.text
    }));
    
    res.json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
