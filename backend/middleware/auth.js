const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  // Get token from cookie or Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not logged in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' });
  }
}

// Check if user has the right role
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission.' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };