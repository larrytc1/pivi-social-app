import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/Upload.css';

function Upload({ userId, userEmail, onLogout }) {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState('picture');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('📁 FILE_SELECTED', { 
        name: selectedFile.name, 
        size: selectedFile.size, 
        type: selectedFile.type 
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
        console.log('👁️ PREVIEW_LOADED');
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !title) {
      alert('Please select a file and add a title');
      return;
    }

    setUploading(true);
    console.log('📤 UPLOAD_START', { 
      userId, 
      type: uploadType, 
      fileName: file.name,
      title,
      description
    });

    // Simulate upload
    setTimeout(() => {
      console.log('✅ UPLOAD_SUCCESS', { 
        userId, 
        uploadType, 
        fileName: file.name,
        timestamp: new Date().toISOString()
      });
      setUploading(false);
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      alert('Upload successful!');
      navigate('/');
    }, 1500);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="feed-container">
      <Navigation 
        activeTab="upload" 
        onTabChange={() => {}}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <div className="upload-content">
        <div className="upload-card">
          <h2>📤 Upload Content</h2>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="upload-type-selector">
              <button 
                type="button"
                className={`type-btn ${uploadType === 'picture' ? 'active' : ''}`}
                onClick={() => {
                  setUploadType('picture');
                  console.log('📸 UPLOAD_TYPE_CHANGED', 'picture');
                }}
              >
                📸 Picture
              </button>
              <button 
                type="button"
                className={`type-btn ${uploadType === 'video' ? 'active' : ''}`}
                onClick={() => {
                  setUploadType('video');
                  console.log('🎥 UPLOAD_TYPE_CHANGED', 'video');
                }}
              >
                🎥 Video
              </button>
            </div>

            <div className="form-group">
              <label>Upload {uploadType === 'picture' ? 'Picture' : 'Video'}</label>
              <input
                type="file"
                accept={uploadType === 'picture' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            {preview && (
              <div className="preview-container">
                <h3>Preview</h3>
                {uploadType === 'picture' ? (
                  <img src={preview} alt="Preview" className="preview-image" />
                ) : (
                  <video src={preview} controls className="preview-video" />
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Give your post a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows="4"
              />
            </div>

            <button 
              type="submit" 
              className="upload-btn"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;