import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  // Create a plain object with only the necessary user data
  const payload = {
    _id: user._id.toString(),  // Changed from id to _id to match MongoDB
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'  // Default to 7 days if not set
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const generateEmailVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const generatePasswordResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
