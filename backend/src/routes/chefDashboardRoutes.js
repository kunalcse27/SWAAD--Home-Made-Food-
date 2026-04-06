const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  updateProfile, 
  getChefOrders, 
  getMyMenu, 
  updateMenu, 
  publishMenu 
} = require('../controllers/chefDashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('chef'));

router.get('/stats', getDashboardStats);
router.put('/profile', updateProfile);
router.get('/orders', getChefOrders);
router.get('/menu', getMyMenu);
router.put('/menu', updateMenu);
router.post('/menu/publish', publishMenu);

module.exports = router;
