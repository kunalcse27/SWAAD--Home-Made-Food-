const { auth, firestore } = require('../config/firebase');

// ─── Helper: generate unique chef invite code ────────────────────────────────
function generateInviteCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = 'CHEF-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { idToken, name, role } = req.body;

    if (!idToken) {
       return res.status(400).json({ message: 'Please provide Firebase idToken' });
    }

    // Verify token from frontend
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    const userRole = role || 'customer';

    // Generate invite code for chefs
    const inviteCode = userRole === 'chef' ? generateInviteCode() : null;

    // Save additional profile data to Firestore (Source of Truth)
    const userDocData = {
      uid,
      name,
      email,
      role: userRole,
      createdAt: new Date().toISOString()
    };
    if (inviteCode) userDocData.inviteCode = inviteCode;

    await firestore.collection('users').doc(uid).set(userDocData);

    // ── Set Firebase custom claims so role is in the JWT ──────────────────────
    await auth.setCustomUserClaims(uid, { role: userRole });

    // Automatically provision Chef profile if role is chef
    if (userRole === 'chef') {
      await firestore.collection('chefs').doc(uid).set({
         userId: uid,
         kitchenName: `${name}'s Kitchen`,
         inviteCode,
         subscriptions: { weekly: 700, monthly: 2500, quarterly: 6500 },
         createdAt: new Date().toISOString()
      });
    }

    res.status(201).json({
      _id: uid,
      uid: uid,
      name: name,
      email: email,
      role: userRole,
      inviteCode: inviteCode || undefined,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ message: 'User already exists' });
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token metadata
// @route   POST /api/auth/login
// @access  Public
// NOTE: With Firebase, clients login directly to Firebase on the frontend to get the JWT.
exports.login = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
       return res.status(400).json({ message: 'Please provide Firebase idToken' });
    }

    // Verify token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Fetch from Firestore
    const userDoc = await firestore.collection('users').doc(decodedToken.uid).get();
    const firestoreData = userDoc.exists ? userDoc.data() : {};
    const userRole = firestoreData.role || 'customer';

    // Back-fill custom claims for users who signed up before this change
    if (!decodedToken.role) {
      await auth.setCustomUserClaims(decodedToken.uid, { role: userRole });
    }
    
    res.json({
      _id: decodedToken.uid,
      uid: decodedToken.uid,
      name: firestoreData.name || decodedToken.name || 'User',
      email: firestoreData.email || decodedToken.email,
      role: userRole,
      inviteCode: firestoreData.inviteCode || undefined,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// @desc    Get user profile (me)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware — enrich with inviteCode
    const userDoc = await firestore.collection('users').doc(req.user.uid).get();
    const extra = userDoc.exists ? userDoc.data() : {};
    res.json({
      ...req.user,
      inviteCode: extra.inviteCode || undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
