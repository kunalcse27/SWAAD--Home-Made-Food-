const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { verifyRole } = require('../middleware/role');
const { updateDeliveryStatus, getMyDeliveries } = require('../controllers/deliveryController');

// GET /api/deliveries/my — all orders for logged-in partner
router.get('/my', protect, verifyRole('deliveryPartner'), getMyDeliveries);

// PATCH /api/deliveries/:orderId/status — update a delivery order's status
router.patch('/:orderId/status', protect, verifyRole('deliveryPartner'), updateDeliveryStatus);

module.exports = router;
