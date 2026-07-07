import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';
import CommentModal from '../components/CommentModal';
import ShareModal from '../components/ShareModal';
import Videos from '../components/Videos';
import Tags from '../components/Tags';
import Messages from '../components/Messages';
import Upload from '../components/Upload';
import Settings from '../components/Settings';
import Profile from '../components/Profile';
import { getAllPosts, toggleLike, initializeDefaultPosts, initializeDefaultVideos } from '../utils/userDatabase';
import '../styles/Feed.css';

function Feed({ userId, userEmail, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pictures');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [posts, setPosts] = useState([]);

  // Initialize posts from localStorage on mount
  useEffect(() => {
    initializeDefaultPosts();
    initializeDefaultVideos();
    const loadedPosts = getAllPosts().filter(p => !p.type || p.type === 'picture');
    setPosts(loadedPosts);
    console.log('📥 POSTS_LOADED_FROM_STORAGE', { count: loadedPosts.length });
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    console.log('🔄 TAB_CHANGED', { from: activeTab, to: tab, userId });
    setActiveTab(tab);
  };

  const handleLike = (postId) => {
    const updatedPost = toggleLike(postId, userId);
    if (updatedPost) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return updatedPost;
        }
        return post;
      }));
    }
  };

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
    console.log('💬 COMMENT_OPENED', { postId: post.id, userId, author: post.author });
  };

  const handleShareClick = (post) => {
    setSelectedPost(post);
    setShowShareModal(true);
    console.log('📤 SHARE_OPENED', { postId: post.id, userId });
  };

  const handleDMClick = (post) => {
    console.log('💌 DM_INITIATED', { 
      recipientId: post.userId, 
      recipientUsername: post.author, 
      senderId: userId,
      timestamp: new Date().toISOString()
    });
    alert(`Opening DM with ${post.author}`);
  };

  const handleAddComment = (commentText) => {
    if (selectedPost) {
      const updatedPosts = posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: post.comments || []
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setSelectedPost(updatedPosts.find(p => p.id === selectedPost.id));
    }
    setShowCommentModal(false);
  };

  const handleShare = (shareType) => {
    if (selectedPost) {
      setPosts(posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            shares: post.shares + 1
          };
        }
        return post;
      }));
      console.log('📤 SHARE_EXECUTED', {
        postId: selectedPost.id,
        userId,
        shareType,
        timestamp: new Date().toISOString()
      });
    }
    setShowShareModal(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('🔍 SEARCH_QUERY', { query, userId, timestamp: new Date().toISOString() });
  };

  // Filter posts based on search (Pictures tab only shows picture-type posts)
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="feed-container">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {activeTab === 'pictures' && (
        <div className="feed-content">
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search pictures..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="posts-container">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard 
                  key={post.id}
                  post={post}
                  userId={userId}
                  onLike={handleLike}
                  onComment={() => handleCommentClick(post)}
                  onShare={() => handleShareClick(post)}
                  onDM={() => handleDMClick(post)}
                />
              ))
            ) : (
              <div className="no-posts">No pictures found. Try a different search.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'videos' && <Videos userId={userId} userEmail={userEmail} />}
      {activeTab === 'tags' && <Tags userId={userId} userEmail={userEmail} />}
      {activeTab === 'messages' && <Messages userId={userId} userEmail={userEmail} />}
      {activeTab === 'upload' && <Upload userId={userId} userEmail={userEmail} />}
      {activeTab === 'settings' && <Settings userId={userId} userEmail={userEmail} onLogout={handleLogout} />}
      {activeTab === 'profile' && <Profile userId={userId} userEmail={userEmail} onLogout={handleLogout} />}

      {showCommentModal && selectedPost && (
        <CommentModal
          post={selectedPost}
          userId={userId}
          onClose={() => setShowCommentModal(false)}
          onAddComment={handleAddComment}
          onPostsUpdate={(updatedPosts) => setPosts(updatedPosts)}
        />
      )}

      {showShareModal && selectedPost && (
        <ShareModal
          post={selectedPost}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default Feed;