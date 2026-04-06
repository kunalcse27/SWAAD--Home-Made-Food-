const Review = require('../models/Review');
const Chef = require('../models/Chef');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { chefId, rating, text, orderId } = req.body;
    
    // Note: normally we'd check if customer has a past order/subscription for this chef
    
    const review = await Review.create({
      chefId,
      customerId: req.user._id,
      orderId,
      rating,
      text
    });
    
    // Update chef aggregate stats
    const chef = await Chef.findById(chefId);
    if (chef) {
      const stats = await Review.aggregate([
        { $match: { chefId: chef._id } },
        { $group: { _id: '$chefId', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
      ]);
      
      if (stats.length > 0) {
        chef.rating = Math.round(stats[0].avgRating * 10) / 10;
        chef.reviewsCount = stats[0].numReviews;
        await chef.save();
      }
    }
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
