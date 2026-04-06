const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewsController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);

module.exports = router;
