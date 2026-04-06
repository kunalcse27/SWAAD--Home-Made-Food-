const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscriptions, cancelSubscription, pauseSubscription } = require('../controllers/subscriptionsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createSubscription);
router.get('/my', getMySubscriptions);
router.patch('/:id/cancel', cancelSubscription);
router.patch('/:id/pause', pauseSubscription);

module.exports = router;
