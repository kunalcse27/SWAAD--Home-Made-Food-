const { firestore } = require('../config/firebase');
const { getIo } = require('../services/socket');

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection('orders')
      .where('customerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return res.json([]);

    const orders = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Fetch chef name for display
      let chefName = 'Unknown Chef';
      let chefKitchen = '';
      if (data.chefId) {
        const chefDoc = await firestore.collection('chefs').doc(data.chefId).get();
        if (chefDoc.exists) {
          chefKitchen = chefDoc.data().kitchenName || '';
          const userDoc = await firestore.collection('users').doc(data.chefId).get();
          if (userDoc.exists) chefName = userDoc.data().name || chefName;
        }
      }
      orders.push({
        id: doc.id,
        ...data,
        chefName,
        chefKitchen,
      });
    }

    res.json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const orderDoc = await firestore.collection('orders').doc(req.params.id).get();
    if (!orderDoc.exists) return res.status(404).json({ message: 'Order not found' });

    const order = orderDoc.data();

    // Authorization: owner, chef, or delivery partner
    if (
      order.customerId !== req.user.uid &&
      req.user.role !== 'chef' &&
      req.user.role !== 'deliveryPartner'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ id: orderDoc.id, ...order });
  } catch (error) {
    console.error('getOrderById error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active orders for delivery dashboard
// @route   GET /api/orders/delivery
// @access  Private (Delivery Role)
exports.getDeliveryOrders = async (req, res) => {
  try {
    if (req.user.role !== 'deliveryPartner') {
      return res.status(403).json({ message: 'Only delivery partners can access this.' });
    }

    // Fetch orders that are ready for pickup or on the way
    const snapshot = await firestore.collection('orders')
      .where('status', 'in', ['Scheduled', 'Picking Up', 'On the Way'])
      .orderBy('createdAt', 'asc')
      .limit(20)
      .get();

    if (snapshot.empty) return res.json([]);

    const orders = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Enrich with basic customer/chef details for delivery driver maps
      let customerName = 'Customer';
      let chefKitchen = 'Tiffin Chef';
      
      if (data.customerId) {
        const u = await firestore.collection('users').doc(data.customerId).get();
        if (u.exists) customerName = u.data().name || customerName;
      }
      
      if (data.chefId) {
        const c = await firestore.collection('chefs').doc(data.chefId).get();
        if (c.exists) chefKitchen = c.data().kitchenName || chefKitchen;
      }

      // Generate a mock deterministic distance for the driver UI based off the chef/customer string lengths
      const mockDistance = (Math.abs(chefKitchen.length - customerName.length) * 0.4 + 1.2).toFixed(1);

      orders.push({
        id: doc.id,
        ...data,
        customerName,
        chefKitchen,
        distance: `${mockDistance} km`
      });
    }

    res.json(orders);
  } catch (error) {
    console.error('getDeliveryOrders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Chef or Delivery)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    if (req.user.role === 'customer') {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }

    const orderRef = firestore.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) return res.status(404).json({ message: 'Order not found' });

    await orderRef.update({ status, updatedAt: new Date().toISOString() });

    const { emitOrderStatusUpdate } = require('../services/socket');
    emitOrderStatusUpdate(orderDoc.data().customerId, {
      orderId: req.params.id,
      status,
    });

    res.json({ id: req.params.id, status });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an order (internal use / checkout)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { chefId, planType, items, totalPrice, deliveryAddress } = req.body;

    const orderData = {
      customerId: req.user.uid,
      chefId,
      planType: planType || 'daily',
      items: items || [],
      totalPrice: totalPrice || 0,
      deliveryAddress: deliveryAddress || '',
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orderRef = await firestore.collection('orders').add(orderData);
    
    // Emit real-time update to Chef
    const { emitNewOrder } = require('../services/socket');
    emitNewOrder(chefId, { id: orderRef.id, ...orderData });

    res.status(201).json({ id: orderRef.id, ...orderData });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ message: error.message });
  }
};
