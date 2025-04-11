import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  image: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    index: true
  }
}, {
  timestamps: true
});

// Indexes
postSchema.index({ createdAt: -1 });
postSchema.index({ 'comments.createdAt': -1 });
postSchema.index({ 'shares.createdAt': -1 });

// Middleware to populate author details
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name role'
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
