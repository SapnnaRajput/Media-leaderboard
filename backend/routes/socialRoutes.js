import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { 
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  sharePost
} from '../controllers/socialController.js';

const router = express.Router();

// Post routes
router.post('/posts', auth, upload.single('image'), createPost);
router.get('/posts', auth, getAllPosts);
router.get('/posts/:id', auth, getPost);
router.patch('/posts/:id', auth, updatePost);
router.delete('/posts/:id', auth, deletePost);

// Post interactions
router.post('/posts/:id/like', auth, likePost);
router.delete('/posts/:id/like', auth, unlikePost);
router.post('/posts/:id/comments', auth, addComment);
router.post('/posts/:id/share', auth, sharePost);

export default router;
