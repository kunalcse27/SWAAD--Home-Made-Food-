const Order = require('../models/Order');
const { getIo } = require('../services/socket');

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('chefId')
      .sort('-date');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('chefId')
      .populate('deliveryPartnerId', 'name mobile');
      
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check ownership or role
    if (order.customerId.toString() !== req.user._id.toString() && req.user.role !== 'chef' && req.user.role !== 'delivery') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Chef or Delivery)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Quick role check: only chef/delivery can update
    if (req.user.role === 'customer') {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }
    
    order.status = status;
    await order.save();
    
    // Emit real-time tracking event!
    const io = getIo();
    io.to(order.customerId.toString()).emit('order:status_changed', {
      orderId: order._id,
      status: order.status
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
