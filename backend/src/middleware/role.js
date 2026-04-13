const { auth } = require('../config/firebase');

/**
 * verifyRole(requiredRole)
 * Extracts Bearer token → verifyIdToken → checks decoded.role from custom claim.
 * Returns 401 if no/invalid token, 403 if wrong role.
 */
const verifyRole = (requiredRole) => async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = await auth.verifyIdToken(token);
    const userRole = decoded.role || 'customer';

    if (userRole !== requiredRole) {
      return res.status(403).json({
        message: `Access denied. Required role: ${requiredRole}, your role: ${userRole}`,
      });
    }

    req.user = { ...req.user, uid: decoded.uid, email: decoded.email, role: userRole };
    next();
  } catch (err) {
    console.error('verifyRole error:', err.message);
    return res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};

/**
 * authorize(role) — backward-compatible alias
 * Same as verifyRole but reads req.user.role (set by protect middleware from Firestore)
 * Kept for existing routes that already use protect + authorize.
 */
const authorize = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: `Access denied. Required role: ${role}` });
  }
  next();
};

module.exports = { verifyRole, authorize };
