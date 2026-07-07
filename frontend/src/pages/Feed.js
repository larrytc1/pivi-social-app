import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';
import '../styles/Feed.css';

function Feed({ userId, userEmail, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pictures');
  const [posts, setPosts] = useState([
    {
      id: 1,
      userId: 'user_demo',
      author: '@youngshootsfx',
      title: 'Upper Deck',
      description: 'The dawn horizon.',
      image: 'https://images.unsplash.com/photo-1495562569356-c9a22aed24e7?w=500&h=500&fit=crop',
      likes: 2,
      comments: 2,
      shares: 1,
      liked: false,
      uploadedAt: '2 hours ago'
    },
    {
      id: 2,
      userId: 'user_demo2',
      author: '@wanderlust',
      title: 'Mountain View',
      description: 'Breathtaking mountain scenery at sunset.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
      likes: 5,
      comments: 3,
      shares: 2,
      liked: false,
      uploadedAt: '1 hour ago'
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
        console.log('❤️ LIKE_TOGGLED', { postId, userId, liked: newLiked, totalLikes: newLiked ? post.likes + 1 : post.likes - 1 });
        return {
          ...post,
          liked: newLiked,
          likes: newLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    console.log('💬 COMMENT_OPENED', { postId, userId });
  };

  const handleShare = (postId) => {
    console.log('📤 SHARE_CLICKED', { postId, userId, timestamp: new Date().toISOString() });
  };

  const handleMessage = (postId) => {
    console.log('💌 MESSAGE_CLICKED', { postId, userId });
  };

  const filteredPosts = activeTab === 'pictures' ? posts : [];

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
          <input 
            type="text" 
            placeholder="Search pictures..." 
            className="search-input"
            onChange={(e) => console.log('🔍 SEARCH_INPUT', { query: e.target.value, userId })}
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
                onComment={handleComment}
                onShare={handleShare}
                onMessage={handleMessage}
              />
            ))
          ) : (
            <div className="no-posts">No posts in this category</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;