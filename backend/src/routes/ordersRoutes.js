const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/ordersController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);

router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

// Only chef and delivery can update status
router.patch('/:id/status', authorize('chef', 'delivery'), updateOrderStatus);

module.exports = router;
