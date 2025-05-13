const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to authenticate user with JWT
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.'
    });
  }
  
  // Extract token from header (Bearer token)
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. Invalid token format.'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please authenticate again.'
    });
  }
};

/**
 * Check if user is an admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  next();
};

/**
 * Check if user is an NGO
 */
const isNgo = (req, res, next) => {
  if (!req.user || !req.user.isNgo) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. NGO account required.'
    });
  }
  
  next();
};

/**
 * Check if user is the owner of a resource or an admin
 */
const isResourceOwnerOrAdmin = (resourceOwnerField) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // If user is admin, allow access
    if (req.user.isAdmin) {
      return next();
    }
    
    // Check if user is the owner of the resource
    const resourceOwnerId = req.params[resourceOwnerField] || 
                            req.body[resourceOwnerField] ||
                            (req.resource && req.resource[resourceOwnerField]);
                            
    if (req.user.id !== parseInt(resourceOwnerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not own this resource.'
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateJWT,
  isAdmin,
  isNgo,
  isResourceOwnerOrAdmin
}; 