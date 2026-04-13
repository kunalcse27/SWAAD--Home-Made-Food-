const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
  getDeliveryOrders
} = require('../controllers/ordersController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/',              createOrder);
router.get('/my',             getMyOrders);
router.get('/delivery',       getDeliveryOrders);
router.get('/:id',            getOrderById);
router.patch('/:id/status',   updateOrderStatus);

module.exports = router;
