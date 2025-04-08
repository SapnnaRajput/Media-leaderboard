import express from 'express';
import { signup, verifyEmail, resendOTP, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/login', login);

export default router;
