// Load environment variables first, before any other imports
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '.env');
console.log('Loading environment variables from:', envPath);
dotenv.config({ path: envPath });

// Log environment variables for debugging
console.log('Environment Variables Check:', {
  EMAIL_USER: process.env.EMAIL_USER ? 'exists' : 'missing',
  EMAIL_PASS: process.env.EMAIL_PASS ? 'exists' : 'missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing',
  FRONTEND_URL: process.env.FRONTEND_URL ? 'exists' : 'missing',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'exists' : 'missing',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'exists' : 'missing',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'exists' : 'missing',
  NODE_ENV: process.env.NODE_ENV
});

// Now import other dependencies
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import { limiter, helmetMiddleware, xssMiddleware, hppMiddleware } from './middleware/security.js';
import { initializeEmailTransporter } from './controllers/authController.js';

// Initialize email transporter with loaded environment variables
initializeEmailTransporter();

const app = express();

// Debug logging for requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(helmetMiddleware); // Set security HTTP headers
app.use('/api', limiter); // Rate limiting
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true }));
app.use(xssMiddleware); // Data sanitization against XSS
app.use(hppMiddleware); // Prevent parameter pollution

// Debug route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', socialRoutes); // Changed to handle all social/post routes under /api

// Debug environment variables immediately after loading
console.log('Initial Environment Variables Check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.slice(0, 4) + '...',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
  NODE_ENV: process.env.NODE_ENV
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err); // Debug logging for errors
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment Variables Check:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 5) + '...' : undefined,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
    NODE_ENV: process.env.NODE_ENV
  });
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    // Try using the next port
    app.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});
