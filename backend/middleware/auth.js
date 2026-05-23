const jwt  = require('jsonwebtoken');
const pool = require('../config/db');

// Check if the request has a valid JWT token
const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Please log in first.' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const [rows] = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, u.status, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.user_id = ?`,
      [decoded.userId]
    );

    if (!rows.length || rows[0].status !== 'Active') {
      return res.status(401).json({ success: false, message: 'Account not found or inactive.' });
    }

    req.user = rows[0]; // attach user info to the request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Check if the logged-in user has the required role
// Usage: authorize('Admin') or authorize('Admin', 'Department Head')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role_name)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to do this.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };