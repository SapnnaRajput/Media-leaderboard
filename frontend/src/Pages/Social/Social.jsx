import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../../components/Social/CreatePost';
import PostCard from '../../components/Social/PostCard';
import { socialService } from '../../services/socialService';
import { FaSpinner } from 'react-icons/fa';

const Social = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await socialService.getAllPosts();
      setPosts(response?.data?.posts || []);
    } catch (error) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostUpdate = () => {
    fetchPosts();
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your feed...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Social Feed</h1>
          {user?.role === 'journalist' && (
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              Journalist Account
            </span>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Show post creation for journalists */}
        {user?.role === 'journalist' && (
          <div className="mb-8">
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        )}

        {/* Posts feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))}
          {posts.length === 0 && !isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
              <p className="text-gray-600">
                {user?.role === 'journalist' 
                  ? 'Share your first story with the community!'
                  : 'Follow journalists to see their stories in your feed.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Social;
