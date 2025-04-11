import express from 'express';
import { createPost, getAllPosts, likePost, unlikePost, addComment, sharePost, deletePost } from '../controllers/postController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a new post (protected, journalists only)
router.post('/', auth, upload.single('image'), createPost);

// Get all posts
router.get('/', auth, getAllPosts);

// Like a post
router.post('/:id/like', auth, likePost);

// Unlike a post
router.delete('/:id/like', auth, unlikePost);

// Add a comment
router.post('/:id/comments', auth, addComment);

// Share a post
router.post('/:id/share', auth, sharePost);

// Delete a post (protected, journalists only)
router.delete('/:id', auth, deletePost);

export default router;
