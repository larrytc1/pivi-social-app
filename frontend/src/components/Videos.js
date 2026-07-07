import React from 'react';
import '../styles/Videos.css';

function Videos({ userId, userEmail }) {
  const videos = [
    {
      id: 1,
      title: 'Summer Vibes',
      author: '@traveler_john',
      avatar: '🎥',
      thumbnail: 'https://images.unsplash.com/photo-1611339555312-e607c04352fa?w=600&h=400&fit=crop',
      views: 1234,
      likes: 89,
      duration: '2:34'
    },
    {
      id: 2,
      title: 'Nature Documentary',
      author: '@nature_lover',
      avatar: '🌿',
      thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=400&fit=crop',
      views: 5678,
      likes: 234,
      duration: '5:12'
    }
  ];

  return (
    <div className="tab-content videos-content">
      <h2>Videos</h2>
      <div className="videos-grid">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-duration">{video.duration}</div>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p className="video-author">{video.author}</p>
              <div className="video-stats">
                <span>👁️ {video.views} views</span>
                <span>❤️ {video.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Videos;