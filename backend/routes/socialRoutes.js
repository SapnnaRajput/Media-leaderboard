import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createPost,
  getAllPosts,
  getPost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  sharePost,
  getMyPosts,
  deletePost
} from '../controllers/socialController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Post routes
router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/my', getMyPosts);
router.get('/posts/:id', getPost);
router.delete('/posts/:id', deletePost);

// Post interactions
router.post('/posts/:id/like', likePost);
router.delete('/posts/:id/like', unlikePost);
router.post('/posts/:id/comments', addComment);
router.delete('/posts/:id/comments/:commentId', deleteComment);
router.post('/posts/:id/share', sharePost);

export default router;
