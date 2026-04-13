const { firestore } = require('../config/firebase');

/**
 * @desc  Update delivery order status (Pending → Out for Delivery → Delivered)
 * @route PATCH /api/deliveries/:orderId/status
 * @access Private (deliveryPartner only)
 */
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'out_for_delivery', 'delivered'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`,
      });
    }

    const docRef = firestore.collection('deliveryOrders').doc(orderId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Delivery order not found' });
    }

    // Ensure this partner owns this order
    if (docSnap.data().partnerId !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    await docRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({ id: orderId, status, message: `Order status updated to ${status}` });
  } catch (error) {
    console.error('updateDeliveryStatus error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc  Get all delivery orders for the logged-in partner
 * @route GET /api/deliveries/my
 * @access Private (deliveryPartner only)
 */
exports.getMyDeliveries = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection('deliveryOrders')
      .where('partnerId', '==', req.user.uid)
      .orderBy('deliveryDate', 'desc')
      .get();

    if (snapshot.empty) return res.json([]);

    const orders = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Enrich with customer name
      let customerName = 'Unknown';
      const customerDoc = await firestore.collection('users').doc(data.customerId).get();
      if (customerDoc.exists) customerName = customerDoc.data().name || customerName;

      orders.push({ id: doc.id, ...data, customerName });
    }

    res.json(orders);
  } catch (error) {
    console.error('getMyDeliveries error:', error);
    res.status(500).json({ message: error.message });
  }
};
