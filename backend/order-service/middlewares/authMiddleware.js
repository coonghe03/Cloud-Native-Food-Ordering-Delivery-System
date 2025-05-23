import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Middleware to verify authentication token and attach user
export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for missing or malformed authorization header
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required: No valid token provided',
    });
  }

  const token = authHeader.split(' ')[1];

  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: Missing JWT secret',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    // Validate required fields in token payload
    if (!decoded.id || !decoded.role) {
      console.error('Token missing required fields:', decoded);
      return res.status(401).json({
        success: false,
        error: 'Invalid token: Missing required fields (id or role)',
      });
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.error('Invalid ObjectId in token:', decoded.id);
      return res.status(401).json({
        success: false,
        error: 'Invalid user ID in token',
      });
    }

    // Attach user info from token
    req.user = {
      _id: new mongoose.Types.ObjectId(decoded.id),
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error(`Authentication error: ${error.name} - ${error.message}`, {
      tokenLength: token.length,
      errorStack: error.stack,
    });

    const errorResponses = {
      JsonWebTokenError: {
        status: 401,
        error: 'Invalid authentication token',
      },
      TokenExpiredError: {
        status: 401,
        error: 'Authentication token expired',
      },
    };

    const response = errorResponses[error.name] || {
      status: 500,
      error: 'Internal server error during authentication',
    };

    return res.status(response.status).json({
      success: false,
      error: response.error,
    });
  }
};

export const customerAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer')
      return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to authenticate restaurant admin
export const restaurantAdminAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'restaurant_admin')
      return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to authenticate system admin
export const systemAdminAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'system_admin')
      return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to authenticate delivery person
export const deliveryAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'delivery_personnel')
      return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
