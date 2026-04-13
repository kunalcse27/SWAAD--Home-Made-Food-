const { firestore } = require('../config/firebase');

/**
 * @desc  Partner submits chef's invite code → link themselves to that chef
 * @route POST /api/chef/join
 * @access Private (deliveryPartner only)
 */
exports.joinChef = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      return res.status(400).json({ message: 'inviteCode is required' });
    }

    const code = inviteCode.trim().toUpperCase();

    // Find the chef with this invite code in /users
    const usersSnap = await firestore
      .collection('users')
      .where('inviteCode', '==', code)
      .where('role', '==', 'chef')
      .limit(1)
      .get();

    if (usersSnap.empty) {
      return res.status(404).json({ message: 'Invalid invite code. No chef found.' });
    }

    const chefDoc = usersSnap.docs[0];
    const chefUid = chefDoc.id;
    const chefData = chefDoc.data();

    // Update partner's user doc with linkedChefId
    await firestore.collection('users').doc(req.user.uid).update({
      linkedChefId: chefUid,
      updatedAt: new Date().toISOString(),
    });

    // Also store partner on chef's chef doc for easy lookup
    await firestore.collection('chefs').doc(chefUid).update({
      linkedPartnerId: req.user.uid,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      message: `Successfully linked to chef ${chefData.name || 'Unknown'}`,
      chefId: chefUid,
      chefName: chefData.name,
      redirectTo: '/partner/dashboard',
    });
  } catch (error) {
    console.error('joinChef error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc  Get active subscribers for the logged-in chef
 * @route GET /api/chef/subscribers
 * @access Private (chef only)
 */
exports.getChefSubscribers = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection('subscriptions')
      .where('chefId', '==', req.user.uid)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return res.json([]);

    const subscribers = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let customerName = 'Unknown';
      let customerEmail = '';

      const userDoc = await firestore.collection('users').doc(data.customerId).get();
      if (userDoc.exists) {
        customerName = userDoc.data().name || customerName;
        customerEmail = userDoc.data().email || '';
      }

      subscribers.push({
        id: doc.id,
        customerId: data.customerId,
        customerName,
        customerEmail,
        tiffinServiceId: data.tiffinServiceId || null,
        deliveryPreference: data.deliveryPreference || data.deliveryOption || 'self_pickup',
        status: data.status,
        startDate: data.startDate,
        planType: data.planType,
        totalPrice: data.totalPrice,
      });
    }

    res.json(subscribers);
  } catch (error) {
    console.error('getChefSubscribers error:', error);
    res.status(500).json({ message: error.message });
  }
};
