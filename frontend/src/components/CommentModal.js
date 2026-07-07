import React, { useState } from 'react';
import '../styles/CommentModal.css';

function CommentModal({ post, onClose, onAddComment }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: '@john_doe',
      avatar: '👨',
      text: 'Amazing shot! 📸',
      likes: 2,
      timestamp: '1h ago'
    },
    {
      id: 2,
      author: '@jane_smith',
      avatar: '👩',
      text: 'Love this perspective!',
      likes: 5,
      timestamp: '30m ago'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: '@currentuser',
          avatar: '👤',
          text: commentText,
          likes: 0,
          timestamp: 'now'
        }
      ]);
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleCommentLike = (commentId) => {
    console.log('❤️ COMMENT_LIKED', { commentId, postId: post.id });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Comments on "{post.title}"</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <span className="comment-avatar">{comment.avatar}</span>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{comment.timestamp}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <span 
                  className="comment-like-btn" 
                  onClick={() => handleCommentLike(comment.id)}
                >
                  ❤️ {comment.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form className="comment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="comment-input"
          />
          <button type="submit" className="comment-submit-btn">Post</button>
        </form>
      </div>
    </div>
  );
}

export default CommentModal;