const { firestore } = require('../config/firebase');

// @desc    Get all chefs
// @route   GET /api/chefs
// @access  Public
exports.getChefs = async (req, res) => {
  try {
    const { q, filter } = req.query;
    
    let chefsRef = firestore.collection('chefs');
    // Note: Complex queries in Firestore usually require composite indexes, 
    // but we can fetch and filter locally if dataset is small, or use basic querying.
    const snapshot = await chefsRef.get();
    
    if (snapshot.empty) {
      return res.json([]);
    }

    let chefsList = [];
    
    // Fetch associated user data for names
    // To avoid too many reads, we should ideally denormalize 'userName' onto the Chef document,
    // but for now we fetch it if missing.
    snapshot.forEach(doc => {
      chefsList.push({ id: doc.id, ...doc.data() });
    });

    // Formatting & manual filtering (since Firestore query operators are limited for complex regex)
    let formattedChefs = [];
    
    for (let c of chefsList) {
       // Local filtering logic to mimic previous backend regex search
       if (q) {
         const search = q.toLowerCase();
         const kitchenName = (c.kitchenName || '').toLowerCase();
         const hasCuisine = (c.cuisines || []).some(cuisine => cuisine.toLowerCase().includes(search));
         if (!kitchenName.includes(search) && !hasCuisine) {
             continue; // Skip this chef
         }
       }

       if (filter) {
         if (filter === 'veg' && c.isVeg !== true) continue;
         if (filter === 'jain' && !(c.cuisines || []).includes('Jain')) continue;
         if (filter === 'south-indian' && !(c.cuisines || []).join(' ').toLowerCase().includes('south')) continue;
         if (filter === 'north-indian' && !(c.cuisines || []).join(' ').toLowerCase().includes('north')) continue;
         if (filter === 'gujarati' && !(c.cuisines || []).includes('Gujarati')) continue;
         if (filter === 'under-2000' && (c.subscriptions?.monthly || 9999) >= 2000) continue;
         if (filter === 'under-3000' && (c.subscriptions?.monthly || 9999) >= 3000) continue;
         if (filter === 'top-rated' && (c.rating || 0) < 4.8) continue;
       }

       let userName = c.name || c.userName || 'Unknown User';
       let userAvatar = null;
       
       // If no denormalized name, fetch from users collection
       if (!c.name && !c.userName && c.userId) {
          const userDoc = await firestore.collection('users').doc(c.userId).get();
          if (userDoc.exists) {
              userName = userDoc.data().name;
              userAvatar = userDoc.data().avatar;
          }
       }

       formattedChefs.push({
          id: c.userId || c.id,
          name: userName,
          kitchen: c.kitchenName,
          avatar: c.avatar || userAvatar || "https://i.pravatar.cc/150",
          rating: c.rating || 4.5,
          reviews: c.reviewsCount || 0,
          experience: c.experience || 'New',
          location: c.location || 'Unknown',
          distance: c.distance || "2.5 km",
          cuisines: c.cuisines || c.specialties || [],
          isVeg: c.isVeg || false,
          image: c.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
          price: c.menu?.price || c.subscriptions?.monthly || 2500,
          meals: c.meals || "Lunch + Dinner",
          specialty: c.specialty || "Homemade food",
          verified: c.isVerified || false,
          subscriptions: c.subscriptions || { daily: 100, weekly: 700, monthly: 2500 },
          badge: (c.rating && c.rating >= 4.8) ? "Top Rated" : ""
       });
    }

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
    const chefId = req.params.id;
    const chefDoc = await firestore.collection('chefs').doc(chefId).get();
    
    if (!chefDoc.exists) return res.status(404).json({ message: 'Chef not found' });
    
    const chef = chefDoc.data();
    
    let userName = chef.name || chef.userName || 'Unknown User';
    let userAvatar = null;
    
    if (!chef.name && !chef.userName && chef.userId) {
       const userDoc = await firestore.collection('users').doc(chef.userId).get();
       if (userDoc.exists) {
           userName = userDoc.data().name;
           userAvatar = userDoc.data().avatar;
       }
    }
    
    const formattedChef = {
      id: chef.userId || chefDoc.id,
      name: userName,
      kitchen: chef.kitchenName,
      avatar: chef.avatar || userAvatar || "https://i.pravatar.cc/150",
      rating: chef.rating || 4.5,
      reviews: chef.reviewsCount || 0,
      experience: chef.experience || 'New',
      location: chef.location || 'Unknown',
      distance: chef.distance || "2.5 km",
      cuisines: chef.cuisines || chef.specialties || [],
      isVeg: chef.isVeg || false,
      image: chef.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
      price: chef.menu?.price || chef.subscriptions?.monthly || 2500,
      meals: chef.meals || "Lunch + Dinner",
      specialty: chef.specialty || "Homemade food",
      verified: chef.isVerified || false,
      subscriptions: chef.subscriptions || { daily: 100, weekly: 700, monthly: 2500 },
      badge: (chef.rating && chef.rating >= 4.8) ? "Top Rated" : ""
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
    const chefId = req.params.id;
    const chefDoc = await firestore.collection('chefs').doc(chefId).get();
    
    if (!chefDoc.exists) return res.json({});
    
    const menu = chefDoc.data().menu || {};
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chef reviews
// @route   GET /api/chefs/:id/reviews
// @access  Public
exports.getChefReviews = async (req, res) => {
  try {
    const chefId = req.params.id;
    const reviewsRef = firestore.collection('reviews');
    const snapshot = await reviewsRef.where('chefId', '==', chefId).orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
      return res.json([]);
    }
    
    let formattedReviews = [];
    
    for (let doc of snapshot.docs) {
       const r = doc.data();
       let customerName = 'Unknown User';
       let customerAvatar = null;
       
       if (r.customerId) {
          const userDoc = await firestore.collection('users').doc(r.customerId).get();
          if (userDoc.exists) {
              customerName = userDoc.data().name;
              customerAvatar = userDoc.data().avatar;
          }
       }
       
       formattedReviews.push({
          id: doc.id,
          name: customerName,
          avatar: customerAvatar || "https://i.pravatar.cc/150",
          rating: r.rating,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          text: r.text
       });
    }
    
    res.json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
