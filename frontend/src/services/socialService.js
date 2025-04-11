import axios from '../utils/axiosConfig';

// Create a new post with image
const createPost = async (formData) => {
  try {
    // Set a timeout for the upload request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await axios.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: controller.signal,
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    return response.data;
  } catch (error) {
    console.error('Error in socialService.createPost:', error);
    
    // Check if the error is a timeout
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Your post might still be created. Please refresh to check.');
    }
    
    // If it's a network error but the post might have been created
    if (error.message.includes('Network Error')) {
      throw new Error('Network error occurred. Your post might still be created. Please refresh to check.');
    }
    
    // Pass through the error
    throw error;
  }
};

// Get all posts
const getAllPosts = async () => {
  const response = await axios.get('/api/posts');
  return response.data;
};

// Get a specific post
const getPost = async (postId) => {
  const response = await axios.get(`/api/posts/${postId}`);
  return response.data;
};

// Like a post
const likePost = async (postId) => {
  const response = await axios.post(`/api/posts/${postId}/like`);
  return response.data;
};

// Unlike a post
const unlikePost = async (postId) => {
  const response = await axios.delete(`/api/posts/${postId}/like`);
  return response.data;
};

// Add a comment to a post
const addComment = async (postId, content) => {
  const response = await axios.post(`/api/posts/${postId}/comments`, { content });
  return response.data;
};

// Share a post
const sharePost = async (postId) => {
  try {
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await axios.post(`/api/posts/${postId}/share`, {}, {
      signal: controller.signal,
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    return response.data;
  } catch (error) {
    console.error('Error in socialService.sharePost:', error);
    throw error;
  }
};

// Get my posts
const getMyPosts = async () => {
  const response = await axios.get('/api/posts/me');
  return response.data;
};

// Delete a post
const deletePost = async (postId) => {
  const response = await axios.delete(`/api/posts/${postId}`);
  return response.data;
};

// Update a post
const updatePost = async (postId, formData) => {
  const response = await axios.patch(`/api/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const socialService = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  sharePost,
  getMyPosts
};
