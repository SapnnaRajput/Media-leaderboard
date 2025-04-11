import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

// Debug configuration (without exposing secrets)
console.log('Cloudinary Configuration:', {
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key?.slice(0, 4) + '...',
  api_secret: cloudinaryConfig.api_secret ? '***' : undefined
});

cloudinary.config(cloudinaryConfig);

// Verify configuration
try {
  cloudinary.api.ping()
    .then(() => {
      console.log('✅ Cloudinary connection successful');
    })
    .catch(error => {
      console.error('❌ Cloudinary connection failed:', error.message);
    });
} catch (error) {
  console.error('❌ Error verifying Cloudinary config:', error.message);
}

export default cloudinary;
