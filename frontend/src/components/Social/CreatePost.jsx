import React, { useState } from 'react';
import { socialService } from '../../services/socialService';
import { FaPen, FaImage, FaTimes } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    removeImage();
    setError('');
    setIsExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setError('Please enter content');
      return;
    }

    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Create FormData
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('image', image);

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

      console.log('Sending post creation request...');
      
      try {
        const response = await socialService.createPost(formData);
        console.log('Post creation response:', response);

        if (response && response.status === 'success') {
          console.log('Post created successfully:', response.data);
          resetForm();
          if (onPostCreated) {
            onPostCreated();
          }
          return; // Exit early on success
        } else {
          console.error('Post creation failed with response:', response);
          throw new Error(response?.message || 'Failed to create post');
        }
      } catch (error) {
        console.error('Create post error:', error);
        
        // For these specific error messages, we'll set a more informative error
        if (
          error.message.includes('timed out') || 
          error.message.includes('Network') ||
          error.message.includes('might still be created')
        ) {
          setError(error.message);
        } else {
          setError(error.response?.data?.message || error.message || 'Failed to create post');
        }
        
        // Always refresh posts after a delay, as the post might have been created
        // despite the error
        setTimeout(() => {
          if (onPostCreated) {
            console.log('Refreshing posts after error...');
            onPostCreated();
          }
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaPen />
          <span>Create a new article...</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              maxLength={100}
              className="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500 mt-1">
              {title.length}/100 characters
            </div>
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content..."
              maxLength={1000}
              rows={4}
              className="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500 mt-1">
              {content.length}/1000 characters
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor="image-upload"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaImage className="text-gray-500" />
                <span className="text-gray-700">Add Image</span>
                <input
                  id="image-upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                  disabled={isLoading}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {imagePreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg font-medium text-white shadow-sm transition-all ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow'
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
