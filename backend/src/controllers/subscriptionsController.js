const { firestore } = require('../config/firebase');

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private (customer only)
exports.createSubscription = async (req, res) => {
  try {
    const {
      chefId,
      planType,
      deliveryOption,
      deliveryPreference,   // spec field: 'self_pickup' | 'delivery'
      isVegOnly,
      customizations,
      specialInstructions,
      totalPrice,
      deliveryFee,
      tiffinServiceId,
    } = req.body;

    // Support both field names from different calling contexts
    const delivPref = deliveryPreference || (deliveryOption === 'home' ? 'delivery' : 'self_pickup');

    // Verify chef exists
    const chefDoc = await firestore.collection('chefs').doc(chefId).get();
    if (!chefDoc.exists) return res.status(404).json({ message: 'Chef not found' });
    const chefData = chefDoc.data();

    // Calculate end date based on plan
    const startDate = new Date();
    const endDate = new Date();
    if (planType === 'daily')     endDate.setDate(startDate.getDate() + 1);
    if (planType === 'weekly')    endDate.setDate(startDate.getDate() + 7);
    if (planType === 'monthly')   endDate.setMonth(startDate.getMonth() + 1);
    if (planType === 'quarterly') endDate.setMonth(startDate.getMonth() + 3);

    // Secure Pricing Math (Backend)
    const subPrices = chefData.subscriptions || { daily: 100, weekly: 700, monthly: 2500, quarterly: 7000 };
    const basePlanPrice = subPrices[planType] || 2500;
    const calculatedDeliveryFee = delivPref === 'delivery' ? 300 : 0;
    const computedGST = Math.round(basePlanPrice * 0.05);
    const secureTotalPrice = basePlanPrice + computedGST + calculatedDeliveryFee;

    const subscriptionData = {
      customerId: req.user.uid,
      chefId,
      tiffinServiceId: tiffinServiceId || null,
      planType,
      deliveryPreference: delivPref,
      deliveryOption: delivPref === 'delivery' ? 'home' : 'pickup', // backward compat
      isVegOnly: isVegOnly || false,
      customizations: customizations || [],
      specialInstructions: specialInstructions || '',
      totalPrice: secureTotalPrice,
      deliveryFee: calculatedDeliveryFee,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const subRef = await firestore.collection('subscriptions').add(subscriptionData);

    // Increment chef's subscriber count
    const currentCount = chefData.subscribersCount || 0;
    await firestore.collection('chefs').doc(chefId).update({ subscribersCount: currentCount + 1 });

    // ── If delivery chosen, create a deliveryOrders doc ──────────────────────
    let deliveryOrderId = null;
    if (delivPref === 'delivery') {
      const partnerId = chefData.linkedPartnerId || null;
      const deliveryOrderData = {
        subscriptionId: subRef.id,
        customerId: req.user.uid,
        chefId,
        partnerId,                   // may be null if chef has no linked partner yet
        deliveryDate: startDate.toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const delRef = await firestore.collection('deliveryOrders').add(deliveryOrderData);
      deliveryOrderId = delRef.id;
    }

    res.status(201).json({
      id: subRef.id,
      ...subscriptionData,
      deliveryOrderId,
    });
  } catch (error) {
    console.error('createSubscription error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get logged in user's subscriptions
// @route   GET /api/subscriptions/my
// @access  Private
exports.getMySubscriptions = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection('subscriptions')
      .where('customerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return res.json([]);

    const subscriptions = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Enrich with chef details
      let chefName = 'Unknown Chef';
      let chefKitchen = '';
      let chefAvatar = null;

      if (data.chefId) {
        const chefDoc = await firestore.collection('chefs').doc(data.chefId).get();
        if (chefDoc.exists) {
          chefKitchen = chefDoc.data().kitchenName || '';
          chefAvatar = chefDoc.data().avatar || null;
          const userDoc = await firestore.collection('users').doc(data.chefId).get();
          if (userDoc.exists) chefName = userDoc.data().name || chefName;
        }
      }

      subscriptions.push({
        id: doc.id,
        ...data,
        chef: {
          id: data.chefId,
          name: chefName,
          kitchen: chefKitchen,
          avatar: chefAvatar || 'https://i.pravatar.cc/150',
        },
      });
    }

    res.json(subscriptions);
  } catch (error) {
    console.error('getMySubscriptions error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel subscription
// @route   PATCH /api/subscriptions/:id/cancel
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const subRef = firestore.collection('subscriptions').doc(req.params.id);
    const subDoc = await subRef.get();

    if (!subDoc.exists) return res.status(404).json({ message: 'Subscription not found' });
    if (subDoc.data().customerId !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await subRef.update({ status: 'cancelled', updatedAt: new Date().toISOString() });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('cancelSubscription error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pause / Resume subscription
// @route   PATCH /api/subscriptions/:id/pause
// @access  Private
exports.pauseSubscription = async (req, res) => {
  try {
    const subRef = firestore.collection('subscriptions').doc(req.params.id);
    const subDoc = await subRef.get();

    if (!subDoc.exists) return res.status(404).json({ message: 'Subscription not found' });
    if (subDoc.data().customerId !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const currentStatus = subDoc.data().status;
    const newStatus = currentStatus === 'paused' ? 'active' : 'paused';

    await subRef.update({ status: newStatus, updatedAt: new Date().toISOString() });

    res.json({ message: `Subscription ${newStatus}`, status: newStatus });
  } catch (error) {
    console.error('pauseSubscription error:', error);
    res.status(500).json({ message: error.message });
  }
};
