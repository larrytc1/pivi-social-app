import React, { useState, useEffect } from 'react';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';
import { getAllPosts, toggleLike, updatePost, initializeDefaultVideos, incrementVideoViews } from '../utils/userDatabase';
import '../styles/Videos.css';

function Videos({ userId, userEmail }) {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    initializeDefaultVideos();
    const allPosts = getAllPosts();
    const videoData = allPosts.filter(p => p.type === 'video');
    setVideos(videoData);
    console.log('VIDEO_FEED_LOADED', { count: videoData.length, userId });
  }, [userId]);

  const handleLike = (videoId) => {
    const updatedVideo = toggleLike(videoId, userId);
    if (updatedVideo) {
      setVideos(prev => prev.map(v => v.id === videoId ? updatedVideo : v));
      const isLiked = updatedVideo.likedBy && updatedVideo.likedBy.includes(userId);
      console.log('VIDEO_LIKED', { videoId, liked: isLiked, totalLikes: updatedVideo.likes, userId });
    }
  };

  const handleCommentClick = (video) => {
    setSelectedVideo(video);
    setShowCommentModal(true);
    console.log('VIDEO_COMMENTED', { videoId: video.id, userId, author: video.author });
  };

  const handleShareClick = (video) => {
    setSelectedVideo(video);
    setShowShareModal(true);
    console.log('VIDEO_SHARE_OPENED', { videoId: video.id, userId });
  };

  const handleDMClick = (video) => {
    console.log('VIDEO_DM_INITIATED', {
      recipientId: video.userId,
      recipientUsername: video.author,
      senderId: userId,
      timestamp: new Date().toISOString()
    });
    alert(`Opening DM with ${video.author}`);
  };

  const handlePlayClick = (video) => {
    const newViews = incrementVideoViews(video.id);
    if (newViews !== null) {
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, views: newViews } : v));
    }
    console.log('VIDEO_VIEWED', { videoId: video.id, title: video.title, userId });
    alert(`Playing: ${video.title}`);
  };

  const handleAddComment = (commentText) => {
    if (selectedVideo) {
      const allPosts = getAllPosts();
      const updated = allPosts.find(p => p.id === selectedVideo.id);
      if (updated) {
        setVideos(prev => prev.map(v => v.id === selectedVideo.id ? { ...v, comments: updated.comments } : v));
        setSelectedVideo(updated);
      }
      console.log('VIDEO_COMMENT_ADDED', { videoId: selectedVideo.id, userId, text: commentText });
    }
    setShowCommentModal(false);
  };

  const handleShare = (shareType) => {
    if (selectedVideo) {
      const newShares = (selectedVideo.shares || 0) + 1;
      updatePost(selectedVideo.id, { shares: newShares });
      setVideos(prev => prev.map(v =>
        v.id === selectedVideo.id ? { ...v, shares: newShares } : v
      ));
      console.log('VIDEO_SHARE_EXECUTED', {
        videoId: selectedVideo.id,
        userId,
        shareType,
        timestamp: new Date().toISOString()
      });
    }
    setShowShareModal(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('VIDEO_SEARCH_QUERY', { query, userId, timestamp: new Date().toISOString() });
  };

  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (video.title || '').toLowerCase().includes(q) ||
      (video.description || '').toLowerCase().includes(q) ||
      (video.author || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="videos-feed-container">
      <div className="videos-feed-content">
        <div className="search-bar-container">
          <span className="video-search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search videos..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="video-posts-container">
          {filteredVideos.length > 0 ? (
            filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                userId={userId}
                onLike={() => handleLike(video.id)}
                onComment={() => handleCommentClick(video)}
                onShare={() => handleShareClick(video)}
                onDM={() => handleDMClick(video)}
                onPlay={() => handlePlayClick(video)}
              />
            ))
          ) : (
            <div className="no-posts">No videos found. Try a different search.</div>
          )}
        </div>
      </div>

      {showCommentModal && selectedVideo && (
        <CommentModal
          post={selectedVideo}
          userId={userId}
          onClose={() => setShowCommentModal(false)}
          onAddComment={handleAddComment}
          onPostsUpdate={() => {}}
        />
      )}

      {showShareModal && selectedVideo && (
        <ShareModal
          post={selectedVideo}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

function VideoCard({ video, userId, onLike, onComment, onShare, onDM, onPlay }) {
  const isLiked = video.likedBy && video.likedBy.includes(userId);
  const commentCount = Array.isArray(video.comments) ? video.comments.length : (video.comments || 0);

  return (
    <div className="video-post-card">
      <div className="video-post-header">
        <div className="post-header-left">
          <span className="video-avatar-badge">{video.avatar}</span>
          <div className="post-header-info">
            <span className="post-author">{video.author}</span>
            <span className="post-time">{video.uploadedAt}</span>
          </div>
        </div>
      </div>

      <div className="video-thumbnail-wrap" onClick={onPlay}>
        <img src={video.thumbnail} alt={video.title} className="video-thumb-img" />
        <div className="video-play-overlay">
          <div className="video-play-triangle"></div>
        </div>
        {video.duration && (
          <div className="video-duration-badge">{video.duration}</div>
        )}
      </div>

      <div className="post-content">
        <h3 className="post-title">{video.title}</h3>
        <p className="post-description">{video.description}</p>
      </div>

      <div className="post-stats">
        <div className="stat">
          <span
            className={`stat-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={onLike}
            title="Like this video"
          >
            LIKE <span className="stat-count">{video.likes || 0}</span>
          </span>
        </div>
        <div className="stat">
          <span
            className="stat-btn comment-btn"
            onClick={onComment}
            title="Comment on this video"
          >
            COMMENT <span className="stat-count">{commentCount}</span>
          </span>
        </div>
        <div className="stat">
          <span
            className="stat-btn share-btn"
            onClick={onShare}
            title="Share this video"
          >
            SHARE <span className="stat-count">{video.shares || 0}</span>
          </span>
        </div>
        <div className="stat">
          <span className="stat-btn views-btn" title="Total views">
            VIEWS <span className="stat-count">{video.views || 0}</span>
          </span>
        </div>
        <div className="stat">
          <span
            className="stat-btn dm-btn"
            onClick={onDM}
            title="Send DM to this user"
          >
            DM
          </span>
        </div>
      </div>
    </div>
  );
}

export default Videos;