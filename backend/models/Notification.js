import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['share', 'like', 'comment'],
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Middleware to populate sender details
notificationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'name role'
  });
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
