const { firestore } = require('../config/firebase');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { chefId, rating, text, orderId } = req.body;
    
    // VERIFICATION: Check if user actually bought from this chef
    const subsSnapshot = await firestore.collection('subscriptions')
      .where('customerId', '==', req.user.uid)
      .where('chefId', '==', chefId)
      .get();
      
    if (subsSnapshot.empty) {
      return res.status(403).json({ message: 'You must subscribe to this chef before writing a review.' });
    }

    // VERIFICATION: Prevent multiple reviews
    const existingReviews = await firestore.collection('reviews')
      .where('customerId', '==', req.user.uid)
      .where('chefId', '==', chefId)
      .get();
      
    if (!existingReviews.empty) {
      return res.status(403).json({ message: 'You have already reviewed this chef.' });
    }

    const reviewData = {
      chefId,
      customerId: req.user.uid,
      orderId: orderId || null,
      rating: Number(rating),
      text,
      createdAt: new Date().toISOString()
    };
    
    const reviewRef = await firestore.collection('reviews').add(reviewData);
    
    // Update chef aggregate stats
    const chefDocRef = firestore.collection('chefs').doc(chefId);
    const chefDoc = await chefDocRef.get();
    
    if (chefDoc.exists) {
      // Calculate new stats locally
      const snapshot = await firestore.collection('reviews').where('chefId', '==', chefId).get();
      
      let sum = 0;
      let count = 0;
      
      snapshot.forEach(doc => {
         const r = doc.data();
         sum += r.rating || 0;
         count += 1;
      });
      
      const avgRating = count > 0 ? (Math.round((sum / count) * 10) / 10) : 0;
      
      await chefDocRef.update({
         rating: avgRating,
         reviewsCount: count
      });
    }
    
    res.status(201).json({ id: reviewRef.id, ...reviewData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
