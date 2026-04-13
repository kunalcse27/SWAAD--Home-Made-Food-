const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats, getEarningsHistory, updateStatus } = require('../controllers/deliveryDashboardController');

// All delivery dashboard routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/earnings', getEarningsHistory);
router.put('/status', updateStatus);

module.exports = router;
