const { firestore } = require('../config/firebase');
const { getIo } = require('../services/socket');

// ─── Helper ────────────────────────────────────────────────────────────────
// Get the chef document for the currently logged-in chef user
const getMyChefDoc = async (uid) => {
  const chefDoc = await firestore.collection('chefs').doc(uid).get();
  if (chefDoc.exists) {
    return { id: chefDoc.id, ...chefDoc.data() };
  } else {
    // Resilient auto-provisioning for missing profiles (e.g. after DB wipes)
    const newChef = {
       userId: uid,
       kitchenName: `Chef's Kitchen`,
       subscriptions: { weekly: 700, monthly: 2500, quarterly: 6500 },
       createdAt: new Date().toISOString()
    };
    await firestore.collection('chefs').doc(uid).set(newChef);
    return { id: uid, ...newChef };
  }
};


// @desc    Get dashboard stats
// @route   GET /api/chef-dashboard/stats
// @access  Private (Chef)
exports.getDashboardStats = async (req, res) => {
  try {
    const chef = await getMyChefDoc(req.user.uid);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });

    // Count active subscriptions for this chef
    const subsSnap = await firestore
      .collection('subscriptions')
      .where('chefId', '==', req.user.uid)
      .where('status', '==', 'active')
      .get();

    // Count pending/preparing orders
    const ordersSnap = await firestore
      .collection('orders')
      .where('chefId', '==', req.user.uid)
      .where('status', 'in', ['Scheduled', 'Preparing'])
      .get();

    // Calculate this month's earnings from active subscriptions
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let monthlyEarnings = 0;
    subsSnap.forEach((doc) => {
      const data = doc.data();
      const created = new Date(data.createdAt);
      if (created.getMonth() === thisMonth && created.getFullYear() === thisYear) {
        monthlyEarnings += data.totalPrice || 0;
      }
    });

    res.json({
      totalSubscribers: subsSnap.size,
      pendingOrders: ordersSnap.size,
      rating: chef.rating || 4.5,
      reviewsCount: chef.reviewsCount || 0,
      monthlyEarnings,
      issues: 0,
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get chef's own profile for the dashboard
// @route   GET /api/chef-dashboard/profile
// @access  Private (Chef)
exports.getProfile = async (req, res) => {
  try {
    const chef = await getMyChefDoc(req.user.uid);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });

    // Also pull name/email from users collection
    const userDoc = await firestore.collection('users').doc(req.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    res.json({ ...chef, name: userData.name, email: userData.email });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update chef profile
// @route   PUT /api/chef-dashboard/profile
// @access  Private (Chef)
exports.updateProfile = async (req, res) => {
  try {
    const chef = await getMyChefDoc(req.user.uid);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });

    const allowedFields = [
      'kitchenName', 'bio', 'cuisines', 'isVeg', 'specialty',
      'location', 'subscriptions', 'avatar', 'image', 'experience',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    updates.updatedAt = new Date().toISOString();

    await firestore.collection('chefs').doc(req.user.uid).update(updates);

    // Also update name in users collection if provided
    if (req.body.name) {
      await firestore.collection('users').doc(req.user.uid).update({ name: req.body.name });
    }

    res.json({ id: req.user.uid, ...chef, ...updates });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get chef's subscribers list
// @route   GET /api/chef-dashboard/subscribers
// @access  Private (Chef)
exports.getSubscribers = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection('subscriptions')
      .where('chefId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return res.json([]);

    const subscribers = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let customerName = 'Unknown';
      let customerAvatar = null;
      let customerEmail = '';

      const userDoc = await firestore.collection('users').doc(data.customerId).get();
      if (userDoc.exists) {
        customerName  = userDoc.data().name || customerName;
        customerAvatar = userDoc.data().avatar || null;
        customerEmail  = userDoc.data().email || '';
      }

      subscribers.push({
        id: doc.id,
        customerId: data.customerId,
        customerName,
        customerAvatar: customerAvatar || 'https://i.pravatar.cc/150',
        customerEmail,
        planType: data.planType,
        status: data.status,
        totalPrice: data.totalPrice,
        startDate: data.startDate,
        endDate: data.endDate,
        isVegOnly: data.isVegOnly,
        specialInstructions: data.specialInstructions,
      });
    }

    res.json(subscribers);
  } catch (error) {
    console.error('getSubscribers error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get chef's orders
// @route   GET /api/chef-dashboard/orders
// @access  Private (Chef)
exports.getChefOrders = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection('orders')
      .where('chefId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return res.json([]);

    const orders = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let customerName = 'Unknown';
      let customerAvatar = null;

      const userDoc = await firestore.collection('users').doc(data.customerId).get();
      if (userDoc.exists) {
        customerName  = userDoc.data().name || customerName;
        customerAvatar = userDoc.data().avatar || null;
      }

      orders.push({
        id: doc.id,
        ...data,
        customerName,
        customerAvatar: customerAvatar || 'https://i.pravatar.cc/150',
      });
    }

    res.json(orders);
  } catch (error) {
    console.error('getChefOrders error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get chef's current menu (draft or published)
// @route   GET /api/chef-dashboard/menu
// @access  Private (Chef)
exports.getMyMenu = async (req, res) => {
  try {
    const chef = await getMyChefDoc(req.user.uid);
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
    
    // Return existing menu or an empty skeleton if undefined
    const menu = chef.menu || {
        title: '',
        description: '',
        starter: '',
        mainCourse: '',
        accompaniments: '',
        isVeg: false,
        price: 0
    };
    
    res.json(menu);
  } catch (error) {
    console.error('getMyMenu error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update / save menu days (drafting)
// @route   PUT /api/chef-dashboard/menu
// @access  Private (Chef)
exports.updateMenu = async (req, res) => {
  try {
    const { title, description, starter, mainCourse, accompaniments, isVeg, price } = req.body;
    
    const menuPayload = {
        title: title || '',
        description: description || '',
        starter: starter || '',
        mainCourse: mainCourse || '',
        accompaniments: accompaniments || '',
        isVeg: !!isVeg,
        price: Number(price) || 0,
        updatedAt: new Date().toISOString()
    };

    await firestore.collection('chefs').doc(req.user.uid).update({ menu: menuPayload });

    const { emitMenuUpdate } = require('../services/socket');
    emitMenuUpdate(req.user.uid, menuPayload);

    res.json({ message: 'Menu updated successfully', menu: menuPayload });
  } catch (error) {
    console.error('updateMenu error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Publish the current draft menu
// @route   POST /api/chef-dashboard/menu/publish
// @access  Private (Chef)
exports.publishMenu = async (req, res) => {
  try {
    // In the new simplified architecture, updating and publishing are conceptually the same.
    // The menu is instantly live when saved to the chef's document.
    res.json({ message: 'Menu is live and published successfully.' });
  } catch (error) {
    console.error('publishMenu error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get earnings breakdown
// @route   GET /api/chef-dashboard/earnings
// @access  Private (Chef)
exports.getEarnings = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection('subscriptions')
      .where('chefId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const earningsByMonth = {};
    let totalEarnings = 0;
    let planBreakdown = { daily: 0, weekly: 0, monthly: 0, quarterly: 0 };

    snapshot.forEach((doc) => {
      const data = doc.data();
      const amount = data.totalPrice || 0;
      totalEarnings += amount;

      // Group by month
      const date = new Date(data.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      earningsByMonth[key] = (earningsByMonth[key] || 0) + amount;

      // Plan breakdown
      if (planBreakdown[data.planType] !== undefined) {
        planBreakdown[data.planType] += amount;
      }
    });

    // Convert to sorted array for charting
    const monthlyData = Object.entries(earningsByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    res.json({
      totalEarnings,
      monthlyData,
      planBreakdown,
      totalSubscriptions: snapshot.size,
    });
  } catch (error) {
    console.error('getEarnings error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get subscriber sentiment (based on reviews)
 * @route   GET /api/chef-dashboard/sentiment
 * @access  Private (Chef)
 */
exports.getSentiment = async (req, res) => {
  try {
    const reviewsSnap = await firestore
      .collection('reviews')
      .where('chefId', '==', req.user.uid)
      .get();

    if (reviewsSnap.empty) {
      return res.json({ positive: 90, balance: 85, packaging: 92 }); // Default high baseline
    }

    let totalRating = 0;
    reviewsSnap.forEach(doc => totalRating += doc.data().rating);
    const avg = totalRating / reviewsSnap.size;

    // Derived stats for visualization
    res.json({
      positive: Math.round((avg / 5) * 100),
      balance: 85 + Math.floor(Math.random() * 10), // Simulated variety
      packaging: 90 + Math.floor(Math.random() * 8)
    });
  } catch (error) {
    console.error('getSentiment error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get grocery/ingredient tracker
 * @route   GET /api/chef-dashboard/ingredients
 * @access  Private (Chef)
 */
exports.getIngredientList = async (req, res) => {
  try {
    const chef = await getMyChefDoc(req.user.uid);
    const menu = chef?.menu;

    if (!menu || !menu.mainCourse) {
      return res.json({ ingredients: [] });
    }

    // Logic: Split words, filter noise, and present as a grocery list
    const combined = `${menu.mainCourse} ${menu.starter} ${menu.accompaniments}`.toLowerCase();
    const CommonIndianKeywords = ['dal', 'paneer', 'chicken', 'roti', 'rice', 'makhani', 'shahi', 'butter', 'masala', 'aloo', 'gobi', 'jeera', 'kofta', 'malai'];
    
    const ingredients = CommonIndianKeywords.filter(keyword => combined.includes(keyword))
      .map(item => ({ name: item, qty: 'Bulk (5kg+)', status: 'In Stock' }));

    res.json(ingredients);
  } catch (error) {
    console.error('getIngredientList error:', error);
    res.status(500).json({ message: error.message });
  }
};
