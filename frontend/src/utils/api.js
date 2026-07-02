import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (username, email, password) => 
    apiClient.post('/auth/signup', { username, email, password }),
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  getProfile: () => 
    apiClient.get('/auth/profile'),
  updateProfile: (bio, profile_picture_url) => 
    apiClient.put('/auth/profile', { bio, profile_picture_url })
};

// Posts API
export const postsAPI = {
  uploadPost: (formData) => 
    apiClient.post('/posts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getFeed: (limit = 20, offset = 0) => 
    apiClient.get(`/posts/feed?limit=${limit}&offset=${offset}`),
  getUserPosts: (userId, limit = 20, offset = 0) => 
    apiClient.get(`/posts/user/${userId}?limit=${limit}&offset=${offset}`),
  likePost: (postId) => 
    apiClient.post(`/posts/${postId}/like`),
  unlikePost: (postId) => 
    apiClient.delete(`/posts/${postId}/like`),
  addComment: (postId, content) => 
    apiClient.post(`/posts/${postId}/comments`, { content }),
  getComments: (postId) => 
    apiClient.get(`/posts/${postId}/comments`)
};

export default apiClient;
