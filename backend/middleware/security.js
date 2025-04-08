import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import xssClean from 'xss-clean';

// Rate limiting
export const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});

// Set security HTTP headers
export const helmetMiddleware = helmet();

// Data sanitization against XSS
export const xssMiddleware = xssClean();

// Prevent parameter pollution
export const hppMiddleware = hpp({
  whitelist: [] // Add parameters that are allowed to be duplicated
});
