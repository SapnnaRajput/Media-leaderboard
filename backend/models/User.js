import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'journalist'],
    default: 'user'
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  // Additional fields for journalists
  journalistInfo: {
    mediaOutlet: String,
    position: String,
    experience: Number,
    portfolio: String,
    pressId: String,
    country: String,
    state: String,
    contactNumber: {
      type: String,
      validate: {
        validator: function(v) {
          // Allow digits, spaces, dashes, plus sign, and parentheses
          return /^[\d\s\-+()]+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
