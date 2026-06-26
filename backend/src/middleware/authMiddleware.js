const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header: Bearer <token>
 */
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token missing'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    console.error('Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

/**
 * Middleware to check user role
 * Usage: requireRole('INSTRUCTOR', 'ADMIN')
 */
exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};