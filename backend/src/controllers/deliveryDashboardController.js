const { firestore } = require('../config/firebase');

/**
 * @desc    Get delivery partner dashboard stats
 * @route   GET /api/delivery-dashboard/stats
 * @access  Private (Delivery Partner)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const uid = req.user.uid;

    // Get active/pending orders assigned to this delivery partner
    const ordersSnap = await firestore
      .collection('orders')
      .where('deliveryPartnerId', '==', uid)
      .where('status', 'in', ['Picking Up', 'On the Way', 'Scheduled'])
      .get();

    // Get completed deliveries for TODAY to calculate daily earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedTodaySnap = await firestore
      .collection('orders')
      .where('deliveryPartnerId', '==', uid)
      .where('status', '==', 'Delivered')
      .where('updatedAt', '>=', today.toISOString())
      .get();

    // Get partner profile (for rating and online status)
    const partnerDoc = await firestore.collection('users').doc(uid).get();
    const partnerData = partnerDoc.exists ? partnerDoc.data() : {};

    const deliveriesDone = completedTodaySnap.size;
    const earningsToday = deliveriesDone * 80; // Fixed rate per delivery

    res.json({
      activeOrdersCount: ordersSnap.size,
      deliveriesDoneToday: deliveriesDone,
      earningsToday: earningsToday,
      rating: partnerData.rating || 4.8,
      totalDeliveries: partnerData.totalDeliveries || 128,
      isOnline: partnerData.isOnline !== false,
      zone: partnerData.zone || 'Connaught Place, Delhi'
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get delivery partner earnings history
 * @route   GET /api/delivery-dashboard/earnings
 * @access  Private (Delivery Partner)
 */
exports.getEarningsHistory = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await firestore
      .collection('orders')
      .where('deliveryPartnerId', '==', uid)
      .where('status', '==', 'Delivered')
      .orderBy('updatedAt', 'desc')
      .limit(50)
      .get();

    const history = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.updatedAt.split('T')[0];
      history[date] = (history[date] || 0) + 80;
    });

    // Convert to array for frontend charts
    const chartData = Object.entries(history)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(chartData);
  } catch (error) {
    console.error('getEarningsHistory error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Toggle online/offline status
 * @route   PUT /api/delivery-dashboard/status
 * @access  Private (Delivery Partner)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    await firestore.collection('users').doc(req.user.uid).update({
      isOnline: !!isOnline,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: `Status updated to ${isOnline ? 'Online' : 'Offline'}`, isOnline });
  } catch (error) {
    console.error('updateStatus error:', error);
    res.status(500).json({ message: error.message });
  }
};
