import React from 'react';
import '../styles/Tags.css';

function Tags({ userId, userEmail }) {
  const popularTags = [
    { name: '#nature', posts: 234 },
    { name: '#photography', posts: 567 },
    { name: '#travel', posts: 345 },
    { name: '#city', posts: 123 },
    { name: '#sunset', posts: 89 },
    { name: '#adventure', posts: 456 }
  ];

  return (
    <div className="tab-content tags-content">
      <h2>Popular Tags</h2>
      <div className="tags-grid">
        {popularTags.map((tag, index) => (
          <div key={index} className="tag-card">
            <span className="tag-name">{tag.name}</span>
            <span className="tag-count">{tag.posts} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tags;