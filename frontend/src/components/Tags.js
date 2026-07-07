import React, { useState, useEffect } from 'react';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';
import {
  getTaggedPosts,
  initializeDefaultTaggedPosts,
  toggleTagLike
} from '../utils/userDatabase';
import '../styles/Tags.css';

function Tags({ userId, userEmail }) {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    initializeDefaultTaggedPosts();
    const loaded = getTaggedPosts();
    setTags(loaded);
    console.log('TAG_FEED_LOADED', { count: loaded.length, userId });
  }, [userId]);

  const handleLike = (tagId) => {
    const updated = toggleTagLike(tagId, userId);
    if (updated) {
      setTags(prev => prev.map(t => (t.id === tagId ? updated : t)));
      console.log('TAG_LIKED', {
        tagId,
        userId,
        liked: updated.likedBy.includes(userId),
        totalLikes: updated.likes
      });
    }
  };

  const handleCommentClick = (tag) => {
    setSelectedTag(tag);
    setShowCommentModal(true);
    console.log('TAG_COMMENT_OPENED', { tagId: tag.id, userId, tagger: tag.taggerUsername });
  };

  const handleCommentAdded = (commentText) => {
    if (selectedTag) {
      const refreshed = getTaggedPosts();
      setTags(refreshed);
      const updatedTag = refreshed.find(t => t.id === selectedTag.id);
      if (updatedTag) setSelectedTag(updatedTag);
      console.log('TAG_COMMENTED', { tagId: selectedTag.id, userId, comment: commentText });
    }
    setShowCommentModal(false);
  };

  const handleShareClick = (tag) => {
    setSelectedTag(tag);
    setShowShareModal(true);
    console.log('TAG_SHARE_OPENED', { tagId: tag.id, userId });
  };

  const handleShare = (shareType) => {
    if (selectedTag) {
      setTags(prev =>
        prev.map(t =>
          t.id === selectedTag.id ? { ...t, shares: (t.shares || 0) + 1 } : t
        )
      );
      console.log('TAG_SHARED', { tagId: selectedTag.id, userId, shareType });
    }
    setShowShareModal(false);
  };

  const handleDMClick = (tag) => {
    console.log('TAG_DM_INITIATED', {
      taggerUsername: tag.taggerUsername,
      tagId: tag.id,
      userId,
      timestamp: new Date().toISOString()
    });
    alert('Opening DM with ' + tag.taggerUsername);
  };

  const getCommentCount = (tag) =>
    Array.isArray(tag.comments) ? tag.comments.length : 0;

  return (
    <div className="tab-content tags-feed-content">
      <h2>Tagged Posts</h2>
      <div className="tags-feed">
        {tags.map(tag => (
          <div key={tag.id} className="tag-feed-card">
            <div className="tag-card-header">
              <div className="tag-card-header-left">
                <span className="tag-avatar">{tag.taggerAvatar}</span>
                <div className="tag-header-info">
                  <span className="tag-username">{tag.taggerUsername}</span>
                  <span className="tag-label">tagged you</span>
                </div>
              </div>
              <span className={`tag-type-badge tag-type-${tag.type}`}>
                {tag.type === 'video' ? 'VIDEO' : 'PHOTO'}
              </span>
            </div>

            <div className="tag-thumbnail">
              <img src={tag.thumbnail} alt={tag.title} />
              {tag.type === 'video' && (
                <div className="tag-play-overlay">
                  <span className="tag-play-btn"></span>
                  {tag.duration && (
                    <span className="tag-duration">{tag.duration}</span>
                  )}
                </div>
              )}
            </div>

            <div className="tag-card-content">
              <h3 className="tag-title">{tag.title}</h3>
              <p className="tag-description">{tag.description}</p>
              <span className="tag-time">{tag.taggedAt}</span>
            </div>

            <div className="tag-actions">
              <span
                className={`tag-action-btn like-btn${tag.likedBy && tag.likedBy.includes(userId) ? ' liked' : ''}`}
                onClick={() => handleLike(tag.id)}
                title="Like this post"
              >
                LIKE <span className="action-count">{tag.likes || 0}</span>
              </span>
              <span
                className="tag-action-btn comment-btn"
                onClick={() => handleCommentClick(tag)}
                title="Comment on this post"
              >
                COMMENT <span className="action-count">{getCommentCount(tag)}</span>
              </span>
              <span
                className="tag-action-btn share-btn"
                onClick={() => handleShareClick(tag)}
                title="Share this post"
              >
                SHARE <span className="action-count">{tag.shares || 0}</span>
              </span>
              <span
                className="tag-action-btn dm-btn"
                onClick={() => handleDMClick(tag)}
                title={'DM ' + tag.taggerUsername}
              >
                DM
              </span>
            </div>
          </div>
        ))}

        {tags.length === 0 && (
          <div className="no-tags">No tagged posts yet. When friends tag you, their posts will appear here.</div>
        )}
      </div>

      {showCommentModal && selectedTag && (
        <CommentModal
          post={selectedTag}
          userId={userId}
          onClose={() => setShowCommentModal(false)}
          onAddComment={handleCommentAdded}
          onPostsUpdate={() => {
            const refreshed = getTaggedPosts();
            setTags(refreshed);
          }}
        />
      )}

      {showShareModal && selectedTag && (
        <ShareModal
          post={selectedTag}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default Tags;