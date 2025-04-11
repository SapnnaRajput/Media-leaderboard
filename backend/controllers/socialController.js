import Post from '../models/Post.js';
import cloudinary from '../config/cloudinary.js';
import { dataUri } from '../utils/dataUri.js';

export const createPost = async (req, res) => {
  try {
    if (req.user.role !== 'journalist') {
      return res.status(403).json({ message: 'Only journalists can create posts' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Convert buffer to data URI
    const fileUri = dataUri(req.file);

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'media-leaderboard',
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    // Create post with image URL
    const post = await Post.create({
      author: req.user._id,
      title: req.body.title,
      content: req.body.content,
      image: result.secure_url,
      cloudinaryPublicId: result.public_id
    });

    // Populate author details
    await post.populate('author', 'name role');
    console.log('Cloudinary result:', result);

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort('-createdAt')
      .populate('author', 'name role')
      .populate('comments.user', 'name')
      .populate('shares.user', 'name')
      .populate({
        path: 'originalPost',
        populate: {
          path: 'author',
          select: 'name role'
        }
      });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name role')
      .populate('comments.user', 'name')
      .populate('shares.user', 'name')
      .populate({
        path: 'originalPost',
        populate: {
          path: 'author',
          select: 'name role'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.role !== 'journalist' || post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updates = {
      title: req.body.title,
      content: req.body.content
    };

    if (req.file) {
      // Delete old image from Cloudinary
      if (post.image) {
        const publicId = post.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`media-leaderboard/${publicId}`);
      }

      // Upload new image
      const fileUri = dataUri(req.file);
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: 'media-leaderboard',
        transformation: [
          { width: 1200, height: 800, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      updates.image = result.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'name role');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.role !== 'journalist' || post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete image from Cloudinary
    if (post.image) {
      const publicId = post.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`media-leaderboard/${publicId}`);
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();
    }

    res.json(post);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Error unliking post', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      content: req.body.content
    });

    await post.save();
    await post.populate('comments.user', 'name');

    res.json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

export const sharePost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new post as a share
    const sharedPost = await Post.create({
      author: req.user._id,
      title: originalPost.title,
      content: originalPost.content,
      image: originalPost.image,
      originalPost: originalPost._id
    });

    await sharedPost.populate('author', 'name role');
    await sharedPost.populate({
      path: 'originalPost',
      populate: {
        path: 'author',
        select: 'name role'
      }
    });

    res.json(sharedPost);
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ message: 'Error sharing post', error: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort('-createdAt')
      .populate('author', 'name role')
      .populate('comments.user', 'name')
      .populate('shares.user', 'name');

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};
