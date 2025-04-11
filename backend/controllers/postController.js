import Post from '../models/Post.js';
import cloudinary from '../config/cloudinary.js';
import { dataUri } from '../utils/dataUri.js';

export const createPost = async (req, res) => {
  try {
    console.log('Create Post Request:', {
      user: req.user,
      body: req.body,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });

    // Check if user is a journalist
    if (req.user.role !== 'journalist') {
      console.log('User role check failed:', req.user.role);
      return res.status(403).json({ 
        status: 'error',
        message: 'Only journalists can create posts' 
      });
    }

    // Check if all required fields are present
    if (!req.body.title || !req.body.content) {
      console.log('Missing required fields:', { title: !!req.body.title, content: !!req.body.content });
      return res.status(400).json({ 
        status: 'error',
        message: 'Title and content are required' 
      });
    }

    if (!req.file) {
      console.log('No image file provided');
      return res.status(400).json({ 
        status: 'error',
        message: 'Image is required' 
      });
    }

    try {
      // Convert buffer to data URI
      console.log('Converting image to data URI...');
      const fileUri = dataUri(req.file);
      
      if (!fileUri) {
        console.error('Failed to create data URI from file:', {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        });
        throw new Error('Failed to process image');
      }

      // Set a timeout for the Cloudinary upload
      console.log('Uploading to Cloudinary...');
      const cloudinaryUploadPromise = cloudinary.uploader.upload(fileUri, {
        folder: 'media-leaderboard',
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 800, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Cloudinary upload timed out after 30 seconds')), 30000);
      });
      
      // Race the upload against the timeout
      const result = await Promise.race([
        cloudinaryUploadPromise,
        timeoutPromise
      ]).catch(err => {
        console.error('Cloudinary upload error:', {
          error: err.message,
          details: err.http_code ? {
            http_code: err.http_code,
            error_subtype: err.error_subtype
          } : err
        });
        throw new Error(`Cloudinary upload failed: ${err.message}`);
      });

      if (!result || !result.secure_url) {
        console.error('Invalid Cloudinary result:', result);
        throw new Error('Failed to get image URL from Cloudinary');
      }

      console.log('Successfully uploaded to Cloudinary:', {
        secure_url: result.secure_url,
        public_id: result.public_id
      });

      // Create post with image URL and Cloudinary public ID
      console.log('Creating post in database...');
      const post = await Post.create({
        author: req.user._id,
        title: req.body.title.trim(),
        content: req.body.content.trim(),
        image: result.secure_url,
        cloudinaryPublicId: result.public_id // Save the Cloudinary public ID
      });

      // Populate author details
      await post.populate('author', 'name role');

      console.log('Post created successfully:', {
        postId: post._id,
        title: post.title,
        authorId: post.author._id,
        cloudinaryId: post.cloudinaryPublicId
      });

      res.status(201).json({
        status: 'success',
        data: post
      });
    } catch (uploadError) {
      console.error('Error during post creation:', {
        error: uploadError.message,
        stack: uploadError.stack
      });
      return res.status(500).json({ 
        status: 'error',
        message: uploadError.message
      });
    }
  } catch (error) {
    console.error('Error in createPost:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      status: 'error',
      message: error.message
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort('-createdAt')
      .populate('author', 'name role')
      .populate('comments.user', 'name')
      .populate('shares.user', 'name');

    res.json({
      status: 'success',
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching posts' 
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Post not found' 
      });
    }

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();
    }

    res.json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error liking post' 
    });
  }
};

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
      data: post
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error unliking post' 
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Post not found' 
      });
    }

    post.comments.push({
      user: req.user._id,
      content: req.body.content
    });

    await post.save();
    await post.populate('comments.user', 'name');

    res.json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error adding comment' 
    });
  }
};

export const sharePost = async (req, res) => {
  try {
    // Find the original post
    const originalPost = await Post.findById(req.params.id)
      .populate('author', 'name role');
    
    if (!originalPost) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Post not found' 
      });
    }

    // Check if the user has already shared this post
    if (originalPost.shares.some(share => share.user.toString() === req.user._id.toString())) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already shared this post'
      });
    }

    // Add the user to the shares array of the original post
    originalPost.shares.push({
      user: req.user._id,
      createdAt: new Date()
    });
    await originalPost.save();

    // Create a new post for the user that references the original post
    const sharedPost = await Post.create({
      author: req.user._id,
      title: originalPost.title,
      content: originalPost.content,
      image: originalPost.image,
      cloudinaryPublicId: originalPost.cloudinaryPublicId,
      originalPost: originalPost._id,
      likes: [],
      comments: [],
      shares: []
    });

    // Populate the author details
    await sharedPost.populate('author', 'name role');
    
    // Also populate the original post reference
    await sharedPost.populate({
      path: 'originalPost',
      select: 'author title content image createdAt',
      populate: {
        path: 'author',
        select: 'name role'
      }
    });

    console.log('Post shared successfully:', {
      originalPostId: originalPost._id,
      sharedPostId: sharedPost._id,
      userId: req.user._id
    });

    res.status(201).json({
      status: 'success',
      message: 'Post shared successfully',
      data: {
        originalPost,
        sharedPost
      }
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error sharing post' 
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Post not found' 
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        status: 'error',
        message: 'You can only delete your own posts' 
      });
    }

    await post.deleteOne();

    res.json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error deleting post' 
    });
  }
};
