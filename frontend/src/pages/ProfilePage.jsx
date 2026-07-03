import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, postsAPI } from '../utils/api';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const userRes = await authAPI.getProfile();
      setUser(userRes.data);
      setBio(userRes.data.bio || '');

      const postsRes = await postsAPI.getUserPosts(userRes.data.id);
      setUserPosts(postsRes.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    try {
      const updatedUser = await authAPI.updateProfile(bio, user.profile_picture_url);
      setUser(updatedUser.data.user);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="profile-container"><p>Loading profile...</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {user?.profile_picture_url && (
          <img src={user.profile_picture_url} alt={user.username} className="profile-picture" />
        )}
        <div className="profile-info">
          <h1>{user?.username}</h1>
          <p className="email">{user?.email}</p>
          <div className="stats">
            <div className="stat">
              <strong>{userPosts.length}</strong>
              <span>Posts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-bio">
        {isEditing ? (
          <div className="bio-edit">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength="150"
              placeholder="Tell us about yourself"
            />
            <div className="bio-buttons">
              <button onClick={handleUpdateBio} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="bio-view">
            <p>{user?.bio || 'No bio yet'}</p>
            <button onClick={() => setIsEditing(true)} className="edit-btn">✏️ Edit Bio</button>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate('/upload')} className="upload-btn">📸 Upload Post</button>
        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="user-posts">
        <h2>My Posts</h2>
        {userPosts.length === 0 ? (
          <p className="no-posts">No posts yet. Start sharing!</p>
        ) : (
          <div className="posts-grid">
            {userPosts.map(post => (
              <div key={post.id} className="post-thumbnail">
                {post.media && post.media[0] && (
                  post.media[0].type === 'image' ? (
                    <img src={post.media[0].url} alt="Post" />
                  ) : (
                    <div className="video-thumbnail">
                      <video>
                        <source src={post.media[0].url} type="video/mp4" />
                      </video>
                      <span className="play-icon">▶️</span>
                    </div>
                  )
                )}
                <div className="post-overlay">
                  <span>❤️ {post.likes_count}</span>
                  <span>💬 {post.comments_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
