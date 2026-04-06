const express = require('express');
const router = express.Router();
const { getChefs, getChefById, getChefMenu, getChefReviews } = require('../controllers/chefsController');

router.get('/', getChefs);
router.get('/:id', getChefById);
router.get('/:id/menu', getChefMenu);
router.get('/:id/reviews', getChefReviews);

module.exports = router;
