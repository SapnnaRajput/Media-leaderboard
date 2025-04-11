import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    // Get token and check if it exists
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error',
        message: 'No auth token provided' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists and is verified
      const user = await User.findOne({ 
        _id: decoded._id,
        isEmailVerified: true 
      }).select('-password');

      if (!user) {
        return res.status(401).json({ 
          status: 'error',
          message: 'User not found or not verified' 
        });
      }

      // Check if token matches stored user data
      if (user.email !== decoded.email || user.role !== decoded.role) {
        return res.status(401).json({
          status: 'error',
          message: 'Token invalid or expired'
        });
      }

      // Attach user and token to request
      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      // Handle invalid/expired token
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error during authentication' 
    });
  }
};

export default auth;
