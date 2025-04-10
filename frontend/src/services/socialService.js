import axios from 'axios';

const API_URL = '/api/social';

// Create a new post (only for journalists)
const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}/posts`, postData);
  return response.data;
};

// Get all posts
const getAllPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

// Get a specific post
const getPost = async (postId) => {
  const response = await axios.get(`${API_URL}/posts/${postId}`);
  return response.data;
};

// Like a post
const likePost = async (postId) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/like`);
  return response.data;
};

// Unlike a post
const unlikePost = async (postId) => {
  const response = await axios.delete(`${API_URL}/posts/${postId}/like`);
  return response.data;
};

// Add a comment
const addComment = async (postId, content) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content });
  return response.data;
};

// Delete a comment
const deleteComment = async (postId, commentId) => {
  const response = await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`);
  return response.data;
};

// Share a post
const sharePost = async (postId) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/share`);
  return response.data;
};

// Get my posts
const getMyPosts = async () => {
  const response = await axios.get(`${API_URL}/my-posts`);
  return response.data;
};

// Delete a post (only for journalists who created the post)
const deletePost = async (postId) => {
  const response = await axios.delete(`${API_URL}/posts/${postId}`);
  return response.data;
};

export const socialService = {
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
};
