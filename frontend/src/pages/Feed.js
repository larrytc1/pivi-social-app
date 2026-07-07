import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';
import CommentModal from '../components/CommentModal';
import ShareModal from '../components/ShareModal';
import '../styles/Feed.css';

function Feed({ userId, userEmail, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pictures');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      userId: 'user_demo',
      author: '@samwilson',
      username: 'samwilson',
      avatar: '👨‍🎨',
      title: 'City lights at night',
      description: 'Downtown never sleeps',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
      likes: 1,
      comments: 10,
      shares: 7,
      liked: false,
      uploadedAt: '2 hours ago',
      type: 'picture'
    },
    {
      id: 2,
      userId: 'user_demo2',
      author: '@wanderlust',
      username: 'wanderlust',
      avatar: '🌍',
      title: 'Mountain View',
      description: 'Breathtaking mountain scenery at sunset.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      likes: 5,
      comments: 3,
      shares: 2,
      liked: false,
      uploadedAt: '1 hour ago',
      type: 'picture'
    },
    {
      id: 3,
      userId: 'user_demo3',
      author: '@oceanvibes',
      username: 'oceanvibes',
      avatar: '🌊',
      title: 'Beach Sunset',
      description: 'Golden hour at the beach',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      likes: 12,
      comments: 8,
      shares: 5,
      liked: false,
      uploadedAt: '30 minutes ago',
      type: 'picture'
    }
  ]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    console.log('🔄 TAB_CHANGED', { from: activeTab, to: tab, userId });
    setActiveTab(tab);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLiked = !post.liked;
        const newLikes = newLiked ? post.likes + 1 : post.likes - 1;
        console.log('❤️ LIKE_TOGGLED', { 
          postId, 
          userId, 
          liked: newLiked, 
          totalLikes: newLikes,
          timestamp: new Date().toISOString()
        });
        return {
          ...post,
          liked: newLiked,
          likes: newLikes
        };
      }
      return post;
    }));
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
      setPosts(posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: post.comments + 1
          };
        }
        return post;
      }));
      console.log('💬 COMMENT_ADDED', {
        postId: selectedPost.id,
        userId,
        comment: commentText,
        timestamp: new Date().toISOString()
      });
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
        shareType, // 'public' or 'friends'
        timestamp: new Date().toISOString()
      });
    }
    setShowShareModal(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('🔍 SEARCH_QUERY', { query, userId, timestamp: new Date().toISOString() });
  };

  // Filter posts based on search and tab
  const filteredPosts = posts.filter(post => {
    const matchesTab = activeTab === 'pictures' || post.type === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="feed-container">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

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

      {showCommentModal && selectedPost && (
        <CommentModal
          post={selectedPost}
          onClose={() => setShowCommentModal(false)}
          onAddComment={handleAddComment}
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