import React from 'react';
import '../styles/ShareModal.css';

function ShareModal({ post, onClose, onShare }) {
  const handleSharePublic = () => {
    console.log('📤 SHARE_PUBLIC', { postId: post.id, postTitle: post.title });
    onShare('public');
  };

  const handleShareFriends = () => {
    console.log('👥 SHARE_FRIENDS', { postId: post.id, postTitle: post.title });
    onShare('friends');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(link);
    console.log('🔗 LINK_COPIED', { postId: post.id, link });
    alert('Link copied to clipboard!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share "{post.title}"</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="share-options">
          <button className="share-option" onClick={handleSharePublic}>
            <span className="share-icon">🌐</span>
            <div className="share-text">
              <h3>Share Publicly</h3>
              <p>Share to all PiVi users</p>
            </div>
          </button>

          <button className="share-option" onClick={handleShareFriends}>
            <span className="share-icon">👥</span>
            <div className="share-text">
              <h3>Share with Friends</h3>
              <p>Share only with your friends</p>
            </div>
          </button>

          <button className="share-option" onClick={handleCopyLink}>
            <span className="share-icon">🔗</span>
            <div className="share-text">
              <h3>Copy Link</h3>
              <p>Copy post link to clipboard</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;