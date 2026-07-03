import React, { useEffect, useState } from 'react';
import { postsAPI } from '../utils/api';
import '../styles/HomePage.css';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const fetchFeed = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await postsAPI.getFeed(20, offset);
      setPosts(response.data);
      
      // Track liked status
      const liked = {};
      response.data.forEach(post => {
        liked[post.id] = post.liked_by_user;
      });
      setLikedPosts(liked);
    } catch (err) {
      setError('Failed to load feed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (likedPosts[postId]) {
        await postsAPI.unlikePost(postId);
      } else {
        await postsAPI.likePost(postId);
      }
      setLikedPosts({ ...likedPosts, [postId]: !likedPosts[postId] });
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      await postsAPI.addComment(postId, content);
      setNewComment({ ...newComment, [postId]: '' });
      fetchFeed(); // Refresh to show new comment
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const toggleComments = async (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments({ ...expandedComments, [postId]: false });
    } else {
      try {
        const response = await postsAPI.getComments(postId);
        setExpandedComments({ ...expandedComments, [postId]: response.data });
      } catch (err) {
        console.error('Comments fetch error:', err);
      }
    }
  };

  if (isLoading) {
    return <div className="home-container"><p>Loading feed...</p></div>;
  }

  return (
    <div className="home-container">
      <h1>🏠 Home Feed</h1>
      
      {error && <div className="error-message">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty-feed">
          <p>No posts yet. Start following people or create your first post!</p>
        </div>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                {post.profile_picture_url && (
                  <img src={post.profile_picture_url} alt={post.username} className="avatar" />
                )}
                <div className="user-info">
                  <h3>{post.username}</h3>
                  <p className="timestamp">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {post.caption && <p className="caption">{post.caption}</p>}

              {post.media && post.media.length > 0 && (
                <div className="media-container">
                  {post.media.map((media, idx) => (
                    <div key={idx} className="media-item">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Post media" />
                      ) : (
                        <video controls>
                          <source src={media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="post-stats">
                <span>❤️ {post.likes_count} Likes</span>
                <span>💬 {post.comments_count} Comments</span>
              </div>

              <div className="post-actions">
                <button
                  className={`action-btn like-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  {likedPosts[post.id] ? '❤️' : '🤍'} Like
                </button>
                <button
                  className="action-btn"
                  onClick={() => toggleComments(post.id)}
                >
                  💬 Comment
                </button>
              </div>

              {expandedComments[post.id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {expandedComments[post.id].length === 0 ? (
                      <p className="no-comments">No comments yet</p>
                    ) : (
                      expandedComments[post.id].map(comment => (
                        <div key={comment.id} className="comment">
                          <strong>{comment.username}</strong>
                          <p>{comment.content}</p>
                          <small>{new Date(comment.created_at).toLocaleDateString()}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <button onClick={() => handleAddComment(post.id)}>Post</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
