import React, { useState, useEffect } from 'react';
import '../styles/CommentModal.css';
import { addComment, likeComment, getPostById } from '../utils/userDatabase';

function CommentModal({ post, userId, onClose, onAddComment, onPostsUpdate }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const currentPost = getPostById(post.id);
    if (currentPost && currentPost.comments) {
      setComments(currentPost.comments);
      console.log('COMMENTS_LOADED', { postId: post.id, count: currentPost.comments.length });
    }
  }, [post.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = addComment(post.id, {
        author: '@currentuser',
        avatar: 'U',
        text: commentText,
        userId: userId
      });
      
      if (newComment) {
        setComments([...comments, newComment]);
        console.log('NEW_COMMENT_ADDED_TO_UI', { 
          postId: post.id, 
          commentId: newComment.id,
          text: commentText 
        });
        onAddComment(commentText);
        setCommentText('');
      }
    }
  };

  const handleCommentLike = (commentId) => {
    const updatedComment = likeComment(post.id, commentId, userId);
    if (updatedComment) {
      setComments(comments.map(c => {
        if (c.id === commentId) {
          return updatedComment;
        }
        return c;
      }));
      console.log('COMMENT_LIKE_TOGGLED', { commentId, postId: post.id, userId });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Comments on "{post.title}"</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>

        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <span className="comment-avatar">{comment.avatar}</span>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">{comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : 'now'}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <span 
                    className="comment-like-btn" 
                    onClick={() => handleCommentLike(comment.id)}
                  >
                    LIKE {comment.likes || 0}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-comments">No comments yet. Be the first to comment!</div>
          )}
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