import React from 'react';
import '../styles/PostCard.css';

function PostCard({ post, onLike, onComment, onShare }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
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
          <span className={`like-btn ${post.liked ? 'liked' : ''}`} onClick={() => onLike(post.id)}>
            {post.liked ? '❤️' : '🤍'} {post.likes}
          </span>
        </div>
        <div className="stat">
          <span className="comment-btn" onClick={() => onComment(post.id)}>
            💬 {post.comments}
          </span>
        </div>
        <div className="stat">
          <span className="share-btn" onClick={() => onShare(post.id)}>
            📤 {post.shares}
          </span>
        </div>
        <div className="stat">
          <span className="message-btn">💬</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;