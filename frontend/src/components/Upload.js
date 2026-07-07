import React, { useState } from 'react';
import '../styles/Upload.css';

function Upload({ userId, userEmail }) {
  const [uploadType, setUploadType] = useState('picture');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log('📁 FILE_SELECTED', { fileName: e.target.files[0]?.name, type: uploadType });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file || !title) {
      alert('Please select a file and add a title');
      return;
    }
    console.log('📤 UPLOAD_INITIATED', { title, description, userId, type: uploadType });
    alert(`Uploading ${uploadType}: ${title}`);
    setTitle('');
    setDescription('');
    setFile(null);
  };

  return (
    <div className="tab-content upload-content">
      <h2>Upload {uploadType === 'picture' ? 'Picture' : 'Video'}</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <div className="upload-type-selector">
          <label>
            <input
              type="radio"
              value="picture"
              checked={uploadType === 'picture'}
              onChange={(e) => setUploadType(e.target.value)}
            />
            Picture
          </label>
          <label>
            <input
              type="radio"
              value="video"
              checked={uploadType === 'video'}
              onChange={(e) => setUploadType(e.target.value)}
            />
            Video
          </label>
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>

        <div className="file-upload">
          <input
            type="file"
            onChange={handleFileChange}
            accept={uploadType === 'picture' ? 'image/*' : 'video/*'}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `✅ ${file.name}` : `Click to select ${uploadType}...`}
          </label>
        </div>

        <button type="submit" className="upload-btn">Upload</button>
      </form>
    </div>
  );
}

export default Upload;