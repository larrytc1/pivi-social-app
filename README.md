# 🎬 PiVi Social App

A modern social media platform for sharing pictures and videos with your community.

## 🚀 Project Overview

PiVi Social App is a full-stack web application that allows users to:
- Create accounts and authenticate securely
- Upload and share pictures and videos
- Like and comment on posts
- View a personalized feed
- Manage their user profile

## 📋 Sprint Progress

### ✅ Sprint 1: Authentication & Foundation (Complete)
- User registration and login
- JWT token-based authentication
- Protected routes
- Basic frontend structure
- Landing page

### ✅ Sprint 2: Picture/Video Uploads (Complete)
- Media upload functionality
- AWS S3 integration for file storage
- Post creation with captions
- Feed display with media
- Like and comment features
- User profile with post history
- Responsive design

### 📌 Future Sprints
- User following/friends system
- Direct messaging
- Post filtering and search
- Notifications
- Advanced media editing
- Stories feature

## 🏗️ Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

### Frontend
- **Library**: React
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3
- **State Management**: React Hooks (useState, useEffect)

## 📦 Project Structure

```
pivi-social-app/
├── backend/
│   ├── db/
│   │   ├── database.js          # Database connection pool
│   │   └── schema.sql           # Database schema
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── posts.js             # Posts and media routes
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server setup
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Landing/home page
│   │   │   ├── SignupPage.jsx   # User registration
│   │   │   ├── LoginPage.jsx    # User login
│   │   │   ├── HomePage.jsx     # Main feed
│   │   │   ├── UploadPage.jsx   # Media upload
│   │   │   └── ProfilePage.jsx  # User profile
│   │   ├── utils/
│   │   │   └── api.js           # API client and endpoints
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── LandingPage.css
│   │   │   ├── AuthPages.css
│   │   │   ├── HomePage.css
│   │   │   ├── UploadPage.css
│   │   │   └── ProfilePage.css
│   │   ├── App.jsx              # Main app component with routing
│   │   └── index.js
│   ├── package.json             # Frontend dependencies
│   └── .env                     # Environment variables
│
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- AWS S3 bucket
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```
   Update with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pivi_social_app
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=7d
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   FRONTEND_URL=http://localhost:3000
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb pivi_social_app
   ```

5. **Run database schema**
   ```bash
   psql -U postgres -d pivi_social_app -f db/schema.sql
   ```

6. **Start backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start frontend development server**
   ```bash
   npm start
   ```
   App will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup`
- Register a new user
- Body: `{ username, email, password }`
- Returns: `{ user, token }`

**POST** `/api/auth/login`
- Authenticate user
- Body: `{ email, password }`
- Returns: `{ user, token }`

**GET** `/api/auth/profile`
- Get current user profile (requires token)
- Returns: `{ id, username, email, bio, profile_picture_url }`

**PUT** `/api/auth/profile`
- Update user profile (requires token)
- Body: `{ bio, profile_picture_url }`
- Returns: `{ user }`

### Posts Endpoints

**POST** `/api/posts/upload`
- Create a new post with media (requires token)
- Form Data: `caption`, `media` (multipart)
- Returns: `{ post }`

**GET** `/api/posts/feed`
- Get user feed (requires token)
- Query: `?limit=20&offset=0`
- Returns: `[{ post with media, likes, comments }]`

**GET** `/api/posts/user/:userId`
- Get posts by specific user
- Query: `?limit=20&offset=0`
- Returns: `[{ post }]`

**POST** `/api/posts/:postId/like`
- Like a post (requires token)
- Returns: `{ message }`

**DELETE** `/api/posts/:postId/like`
- Unlike a post (requires token)
- Returns: `{ message }`

**POST** `/api/posts/:postId/comments`
- Add comment to post (requires token)
- Body: `{ content }`
- Returns: `{ comment }`

**GET** `/api/posts/:postId/comments`
- Get comments for post
- Returns: `[{ comment }]`

## 🎨 Features

### Implemented
- ✅ User authentication (signup/login)
- ✅ Media upload (images and videos)
- ✅ Post creation with captions
- ✅ Feed display
- ✅ Like/unlike posts
- ✅ Comments on posts
- ✅ User profile management
- ✅ Responsive design
- ✅ AWS S3 integration

### Coming Soon
- 🔄 User following system
- 🔄 Direct messaging
- 🔄 Post search and filtering
- 🔄 Notifications
- 🔄 Stories
- 🔄 Advanced profile customization

## 🧪 Testing

1. **Sign up** at `/signup` with a new account
2. **Login** at `/login`
3. **Upload** a post at `/upload` with image or video
4. **View** your feed at `/home`
5. **Like** and **comment** on posts
6. **Visit** your profile at `/profile`

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `.env` database credentials
- Verify database exists: `createdb pivi_social_app`

### File Upload Error
- Verify AWS credentials in `.env`
- Check S3 bucket name and permissions
- Ensure bucket is public or has correct CORS settings

### CORS Error
- Verify `FRONTEND_URL` in backend `.env`
- Ensure frontend is running on correct port
- Check CORS middleware in `server.js`

### Token Expiry
- Clear localStorage and login again
- Token expiry is set to 7 days by default
- Change `JWT_EXPIRY` in `.env` to adjust

## 📞 Support

For issues or questions, please create an issue in the repository.

## 📄 License

This project is open source and available under the MIT License.

---

**Made with ❤️ by the PiVi Team**
