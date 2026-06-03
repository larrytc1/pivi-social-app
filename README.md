# PiVi Social App

A vibrant social platform for sharing stories through pictures, videos, and real-time messaging.

## Features

- 📷 Share and discover pictures
- 🎥 Upload and watch videos
- 💬 Real-time direct messaging
- 🏷️ Tag friends in posts
- 👥 Build your friend network
- 🔍 Search friends and content
- ⚙️ Customizable account settings

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL
- JWT authentication

### Frontend
- React
- React Router
- Axios

## Project Structure

```
backend/
  ├── routes/
  │   └── auth.js
  ├── middleware/
  │   └── auth.js
  ├── db/
  │   ├── database.js
  │   └── schema.sql
  ├── server.js
  ├── package.json
  └── .env.example

frontend/
  ├── src/
  │   ├── pages/
  │   │   ├── LandingPage.jsx
  │   │   ├── SignupPage.jsx
  │   │   └── LoginPage.jsx
  │   ├── styles/
  │   └── App.jsx
  └── package.json
```

## Getting Started

### Backend Setup

1. Navigate to backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

2. Update `.env` with your database credentials

3. Set up PostgreSQL:
   ```bash
   psql -U postgres -d pivi_social_app -f db/schema.sql
   ```

4. Start server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Sprint 1: Complete ✅

- ✅ User authentication (signup/login)
- ✅ JWT token management
- ✅ Landing page
- ✅ Sign up/Login forms
- ✅ Database schema

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - User login

## Next Sprints

- Sprint 2: Picture/Video uploads
- Sprint 3: Real-time messaging
- Sprint 4: Social features (likes, comments)
- Sprint 5: Search & discovery

## License

MIT