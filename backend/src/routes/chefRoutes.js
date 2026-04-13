const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { verifyRole } = require('../middleware/role');
const { joinChef, getChefSubscribers } = require('../controllers/chefController');

// POST /api/chef/join — delivery partner links to a chef via invite code
router.post('/join', protect, verifyRole('deliveryPartner'), joinChef);

// GET /api/chef/subscribers — logged-in chef's active subscribers
router.get('/subscribers', protect, verifyRole('chef'), getChefSubscribers);

module.exports = router;
