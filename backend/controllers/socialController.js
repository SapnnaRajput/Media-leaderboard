import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

// Create a new post (only for journalists)
export const createPost = async (req, res) => {
  try {
    // Check if user is a journalist
    if (req.user.role !== 'journalist') {
      return res.status(403).json({
        status: 'error',
        message: 'Only journalists can create posts'
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content: req.body.content,
      title: req.body.title
    });

    res.status(201).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort('-createdAt')
      .populate('comments.user', 'name')
      .populate('shares.user', 'name')
      .populate({
        path: 'originalPost',
        populate: {
          path: 'author',
          select: 'name role'
        }
      });

    res.json({
      status: 'success',
      results: posts.length,
      data: { posts }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a specific post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'name')
      .populate('shares.user', 'name');

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    res.json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check if user has already liked the post
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already liked this post'
      });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    await post.save();

    res.json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const comment = {
      user: req.user._id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }

    // Only allow comment author or post author to delete comment
    if (comment.user.toString() !== req.user._id.toString() && 
        post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this comment'
      });
    }

    comment.remove();
    await post.save();

    res.json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Share a post
export const sharePost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id)
      .populate('author', 'name role');
    
    if (!originalPost) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check if user has already shared the post
    const existingShare = await Post.findOne({
      'author': req.user._id,
      'originalPost': originalPost._id,
      'isSharedPost': true
    });

    if (existingShare) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already shared this post'
      });
    }

    // Create a new shared post
    const sharedPost = await Post.create({
      author: req.user._id,
      title: originalPost.title,
      content: originalPost.content,
      isSharedPost: true,
      originalPost: originalPost._id
    });

    // Add share to original post
    originalPost.shares.push({
      user: req.user._id
    });
    await originalPost.save();

    // Create notification for the original post author
    if (originalPost.author._id.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: originalPost.author._id,
        sender: req.user._id,
        type: 'share',
        post: originalPost._id
      });
    }

    // Populate necessary fields
    await sharedPost.populate('originalPost');
    await sharedPost.populate('author', 'name role');

    res.status(201).json({
      status: 'success',
      data: { post: sharedPost }
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get posts by current user
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort('-createdAt')
      .populate('comments.user', 'name')
      .populate('shares.user', 'name');

    res.json({
      status: 'success',
      results: posts.length,
      data: { posts }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a post (only for journalists who created the post)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check if user is the author of the post and is a journalist
    if (post.author._id.toString() !== req.user._id.toString() || req.user.role !== 'journalist') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this post'
      });
    }

    // If this is an original post that has been shared, handle shared posts
    if (post.shares.length > 0) {
      // Find and delete all shared posts
      await Post.deleteMany({
        isSharedPost: true,
        originalPost: post._id
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
