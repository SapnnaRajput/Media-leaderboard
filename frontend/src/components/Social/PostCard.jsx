import React, { useState } from 'react';
import { socialService } from '../../services/socialService';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrash, FaUserCircle, FaRetweet, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleLike = async () => {
    try {
      setIsLoading(true);
      
      // Create a local copy of the post for optimistic updates
      const updatedPost = { ...post };
      
      if (post.likes.includes(currentUser._id)) {
        // Optimistically remove the like
        updatedPost.likes = updatedPost.likes.filter(id => id !== currentUser._id);
        
        // Update the UI immediately
        onPostUpdate(updatedPost);
        
        // Then send the request to the server
        await socialService.unlikePost(post._id);
      } else {
        // Optimistically add the like
        updatedPost.likes = [...updatedPost.likes, currentUser._id];
        
        // Update the UI immediately
        onPostUpdate(updatedPost);
        
        // Then send the request to the server
        await socialService.likePost(post._id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // If there was an error, refresh the posts to get the correct state
      onPostUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      
      // Send the request to the server
      const response = await socialService.addComment(post._id, newComment);
      
      // If the server returned the updated post with the new comment
      if (response && response.data) {
        // Update the UI with the returned post
        onPostUpdate(response.data);
      } else {
        // Create a local copy of the post and add the comment
        const updatedPost = { ...post };
        const newCommentObj = {
          _id: Date.now().toString(), // Temporary ID until refresh
          content: newComment,
          user: {
            _id: currentUser._id,
            name: currentUser.name
          },
          createdAt: new Date().toISOString()
        };
        
        updatedPost.comments = [...updatedPost.comments, newCommentObj];
        
        // Update the UI immediately
        onPostUpdate(updatedPost);
      }
      
      // Clear the comment input
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      // If there was an error, refresh the posts to get the correct state
      onPostUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);
      
      // Send the request to the server
      const response = await socialService.sharePost(post._id);
      
      // Check if the share was successful
      if (response && response.status === 'success') {
        // Create a local copy of the post and add the share
        const updatedPost = { ...post };
        updatedPost.shares = [...updatedPost.shares, {
          user: {
            _id: currentUser._id,
            name: currentUser.name
          }
        }];
        
        // Update the UI immediately
        onPostUpdate(updatedPost);
        
        // Show a success message
        alert('Post shared successfully! You can now see it in your profile.');
        
        // If we have a shared post in the response, we could add it to the posts list
        if (response.data && response.data.sharedPost) {
          // This would require passing a callback to add a new post to the list
          // For now, the user will see it when they navigate to their profile or refresh
        }
      } else {
        // If we don't have the updated data, refresh the posts
        onPostUpdate();
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      
      // Check for specific error messages
      if (error.response?.data?.message === 'You have already shared this post') {
        alert('You have already shared this post.');
      } else {
        // Generic error
        alert('Error sharing post. Please try again.');
        // If there was an error, refresh the posts to get the correct state
        onPostUpdate();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsLoading(true);
        await socialService.deletePost(post._id);
        onPostDelete(post._id);
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Just now';
  };

  const isSharedPost = post.originalPost !== undefined;
  const displayPost = isSharedPost ? post.originalPost : post;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
      {/* Shared Post Header */}
      {isSharedPost && (
        <div className="flex items-center justify-between mb-4 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <FaRetweet className="w-4 h-4" />
            <span>{post.author.name} shared this post</span>
          </div>
          <div className="flex items-center gap-2">
            <span title={formatDate(post.createdAt)}>{formatTimeAgo(post.createdAt)}</span>
            <Link 
              to={`/post/${displayPost._id}`}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <FaExternalLinkAlt className="w-3 h-3" />
              <span>View Original</span>
            </Link>
          </div>
        </div>
      )}

      {/* Post Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="w-10 h-10 text-gray-400" />
          <div>
            <div className="font-semibold text-lg text-gray-800">
              {displayPost.author.name}
              {displayPost.author.role === 'journalist' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Journalist</span>
              )}
            </div>
            <div className="text-gray-500 text-sm">{formatDate(displayPost.createdAt)}</div>
          </div>
        </div>
        {currentUser.role === 'journalist' && currentUser._id === displayPost.author._id && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 hover:bg-red-50 rounded-full transition-colors"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {/* Post Image and Title */}
      <div 
        className="cursor-pointer"
        onClick={() => setShowContent(!showContent)}
      >
        <div className="relative w-full aspect-[16/9] mb-4 bg-gray-100 rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={displayPost.image}
            alt={displayPost.title}
            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{displayPost.title}</h3>
      </div>

      {/* Expandable Content */}
      {showContent && (
        <div className="mt-4 mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{displayPost.content}</p>
        </div>
      )}

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setShowContent(!showContent)}
        className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 py-2 transition-colors"
      >
        {showContent ? (
          <>
            <FaChevronUp />
            <span>Show less</span>
          </>
        ) : (
          <>
            <FaChevronDown />
            <span>Read more</span>
          </>
        )}
      </button>

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 px-2">
        <span className="flex items-center gap-1">
          <FaHeart className="text-red-500" /> {displayPost.likes.length}
        </span>
        <span className="flex items-center gap-1">
          <FaComment className="text-blue-500" /> {displayPost.comments.length}
        </span>
        <span className="flex items-center gap-1">
          <FaShare className="text-green-500" /> {displayPost.shares.length}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around border-t border-b border-gray-100 py-2 mb-4">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            displayPost.likes.includes(currentUser._id)
              ? 'text-red-500 bg-red-50'
              : 'text-gray-600 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          {displayPost.likes.includes(currentUser._id) ? <FaHeart /> : <FaRegHeart />}
          Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showComments ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FaComment />
          Comment
        </button>
        <button
          onClick={handleShare}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FaShare />
          Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 space-y-4">
          <form onSubmit={handleComment} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                maxLength={60}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {displayPost.comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="w-6 h-6 text-gray-400" />
                    <span className="font-medium text-gray-900">{comment.user.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700 ml-8">{comment.content}</p>
              </div>
            ))}
            {displayPost.comments.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
