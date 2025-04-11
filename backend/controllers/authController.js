import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

// Initialize transporter as null
let transporter = null;

// Function to initialize email transporter
export const initializeEmailTransporter = () => {
  // Check if environment variables are loaded
  console.log('Auth Controller Environment variables check:');
  console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('FRONTEND_URL exists:', !!process.env.FRONTEND_URL);

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    console.log('Email transporter created successfully');
    
    // Verify the connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('Email configuration error:', error);
      } else {
        console.log('Email server is ready to send messages');
      }
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, journalistInfo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Create verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'fallback-jwt-secret',
      { expiresIn: '1h' }
    );

    // Create new user with verification token and set isEmailVerified to false
    const user = new User({
      name,
      email,
      password,
      role,
      journalistInfo,
      verificationToken,
      isEmailVerified: false // Email verification required
    });

    await user.save();
    console.log('User created successfully:', user._id);

    // Generate verification link
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    // Try to send verification email
    try {
      if (!transporter) {
        throw new Error('Email transporter not configured');
      }

      const mailOptions = {
        from: `"MediaLeader" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - MediaLeader',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to MediaLeader!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for signing up. Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4b5563;">${verificationLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>The MediaLeader Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully to:', email);

      res.status(201).json({
        status: 'success',
        message: 'Verification email sent. Please check your inbox.'
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      
      // For now, we'll still create the account but inform the user about the email issue
      res.status(201).json({
        status: 'success',
        message: 'Account created but verification email could not be sent. Please contact support.'
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating account: ' + error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    console.log('Verifying email with token:', token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-jwt-secret');
    console.log('Token decoded:', decoded);
    
    // Find user by email
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      console.log('User not found with email:', decoded.email);
      return res.status(400).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      console.log('Email already verified for user:', user._id);
      return res.status(400).json({
        status: 'error',
        message: 'Email already verified'
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    console.log('Email verified successfully for user:', user._id);

    // Generate auth token
    const authToken = generateToken(user);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Invalid or expired verification link'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      console.log('Invalid credentials for email:', email);
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      console.log('Email not verified for user:', user._id);
      return res.status(401).json({
        status: 'error',
        message: 'Please verify your email first'
      });
    }

    // Generate JWT token
    const token = generateToken(user);
    console.log('Login successful for user:', user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Resend verification email request for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      console.log('Email already verified for user:', user._id);
      return res.status(400).json({
        status: 'error',
        message: 'Email already verified'
      });
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'fallback-jwt-secret',
      { expiresIn: '1h' }
    );

    user.verificationToken = verificationToken;
    await user.save();
    console.log('New verification token generated for user:', user._id);

    // Generate verification link
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    // Try to send new verification email
    try {
      if (!transporter) {
        throw new Error('Email transporter not configured');
      }

      const mailOptions = {
        from: `"MediaLeader" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - MediaLeader',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to MediaLeader!</h2>
            <p>Hi ${user.name},</p>
            <p>Thank you for signing up. Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4b5563;">${verificationLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>The MediaLeader Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('New verification email sent successfully to:', email);

      res.status(200).json({
        status: 'success',
        message: 'New verification email sent successfully'
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};