import React from 'react';
import '../styles/PostCard.css';

function PostCard({ post, userId, onLike, onComment, onShare, onDM }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-header-left">
          <span className="post-avatar">{post.avatar}</span>
          <div className="post-header-info">
            <span className="post-author">{post.author}</span>
            <span className="post-time">{post.uploadedAt}</span>
          </div>
        </div>
      </div>

      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>

      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description}</p>
      </div>

      <div className="post-stats">
        <div className="stat">
          <span 
            className={`stat-btn like-btn ${post.liked ? 'liked' : ''}`} 
            onClick={() => onLike(post.id)}
            title="Like this post"
          >
            {post.liked ? '❤️' : '🤍'} <span className="stat-count">{post.likes}</span>
          </span>
        </div>
        <div className="stat">
          <span 
            className="stat-btn comment-btn" 
            onClick={onComment}
            title="Comment on this post"
          >
            💬 <span className="stat-count">{post.comments}</span>
          </span>
        </div>
        <div className="stat">
          <span 
            className="stat-btn share-btn" 
            onClick={onShare}
            title="Share this post"
          >
            📤 <span className="stat-count">{post.shares}</span>
          </span>
        </div>
        <div className="stat">
          <span 
            className="stat-btn dm-btn" 
            onClick={onDM}
            title="Send DM to this user"
          >
            💌
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;