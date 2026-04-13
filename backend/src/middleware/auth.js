const { auth, firestore } = require('../config/firebase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify Firebase Token
      const decodedUser = await auth.verifyIdToken(token);
      
      let firestoreUser = null;
      
      // Fetch user profile from Firestore
      const userDoc = await firestore.collection('users').doc(decodedUser.uid).get();
      if (userDoc.exists) {
         const data = userDoc.data();
         firestoreUser = { 
            _id: decodedUser.uid,
            uid: decodedUser.uid, 
            email: decodedUser.email, 
            role: data.role || 'customer',
            name: data.name || 'User'
         };
      } else {
         // Default user object if no DB record exists anywhere
         firestoreUser = { 
            _id: decodedUser.uid,
            uid: decodedUser.uid, 
            email: decodedUser.email, 
            role: 'customer',
            name: decodedUser.name || 'User'
         };
      }
      
      req.user = firestoreUser;
      
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
