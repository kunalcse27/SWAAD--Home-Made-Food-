const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getProfile,
  updateProfile,
  getSubscribers,
  getChefOrders,
  getMyMenu,
  updateMenu,
  publishMenu,
  getEarnings,
} = require('../controllers/chefDashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('chef'));

router.get('/stats',           getDashboardStats);
router.get('/profile',         getProfile);
router.put('/profile',         updateProfile);
router.get('/subscribers',     getSubscribers);
router.get('/orders',          getChefOrders);
router.get('/menu',            getMyMenu);
router.put('/menu',            updateMenu);
router.post('/menu/publish',   publishMenu);
router.get('/earnings',        getEarnings);
router.get('/sentiment',       require('../controllers/chefDashboardController').getSentiment);
router.get('/ingredients',     require('../controllers/chefDashboardController').getIngredientList);

module.exports = router;
