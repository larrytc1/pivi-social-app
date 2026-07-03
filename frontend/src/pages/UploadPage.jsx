import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import '../styles/UploadPage.css';

function UploadPage() {
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Only images and videos are allowed');
      return;
    }

    if (validFiles.length > 5) {
      setError('Maximum 5 files allowed');
      return;
    }

    setFiles(validFiles);
    setError('');

    // Generate previews
    const newPreviews = validFiles.map(file => ({
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      preview: URL.createObjectURL(file)
    }));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      files.forEach(file => {
        formData.append('media', file);
      });

      await postsAPI.uploadPost(formData);
      setSuccess('Post uploaded successfully!');
      
      // Reset form
      setCaption('');
      setFiles([]);
      setPreviews([]);
      
      // Redirect to home after 2 seconds
      setTimeout(() => navigate('/home'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload post');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1>📸 Create a Post</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="caption">Caption (optional)</label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              maxLength="500"
              rows="4"
            />
            <small>{caption.length}/500</small>
          </div>

          <div className="form-group">
            <label htmlFor="files">Upload Media</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="files"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <p>Click to select or drag and drop (up to 5 files)</p>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="previews-container">
              <h3>Preview ({previews.length})</h3>
              <div className="preview-grid">
                {previews.map((item, index) => (
                  <div key={index} className="preview-item">
                    {item.type === 'image' ? (
                      <img src={item.preview} alt={`Preview ${index}`} />
                    ) : (
                      <video src={item.preview} controls />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                    <span className="file-type-badge">{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || files.length === 0}
            className="submit-btn"
          >
            {isLoading ? 'Uploading...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
