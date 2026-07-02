# 🚀 Deployment Guide: Vercel + Railway

This guide will help you deploy **PiVi Social App** to production with a live URL.

## **What We're Deploying**
- **Backend API**: Railway (Node.js + PostgreSQL)
- **Frontend App**: Vercel (React)
- **Database**: Railway PostgreSQL
- **File Storage**: AWS S3

---

## **Pre-Requisites**
- GitHub account (already have it ✓)
- Railway account (free)
- Vercel account (free)
- AWS account for S3 (optional, can use local storage)

---

## **Part 1: Deploy Backend on Railway**

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start Project"
3. Sign in with GitHub
4. Authorize Railway to access your GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Search for and select `larrytc1/pivi-social-app`
4. Select the `sprint-2-media-upload` branch

### Step 3: Add PostgreSQL Database
1. In Railway dashboard, click "New" → "Database"
2. Select "PostgreSQL"
3. Wait for it to provision (1-2 minutes)

### Step 4: Configure Environment Variables
In the Railway project settings, add these variables:

```
PORT=5000
NODE_ENV=production
DB_HOST=(Railway will auto-fill)
DB_PORT=(Railway will auto-fill)
DB_NAME=pivi_social_app
DB_USER=(Railway will auto-fill)
DB_PASSWORD=(Railway will auto-fill)
JWT_SECRET=your_super_secret_key_change_this_to_something_random
JWT_EXPIRY=7d
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

**Note**: You'll get the DB credentials from the PostgreSQL plugin. Copy them directly.

### Step 5: Deploy Backend Service
1. Click "Services" → "New Service"
2. Select "GitHub Repo"
3. Choose `pivi-social-app` repo, `sprint-2-media-upload` branch
4. Set root directory to `backend`
5. Railway will auto-detect Node.js and start deploying

### Step 6: Get Backend URL
1. Once deployed, click on the backend service
2. Go to the "Settings" tab
3. Copy the "Service URL" (looks like `https://railway-app-xxxxx.railway.app`)
4. **Save this URL** - you'll need it for frontend

---

## **Part 2: Deploy Database Schema on Railway**

### Step 1: Connect to PostgreSQL
1. In Railway, click on the PostgreSQL plugin
2. Click "Connect"
3. Copy the connection string

### Step 2: Run Schema
You have two options:

**Option A: Using Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Connect to your project
railway link

# Run the schema
railway run psql < backend/db/schema.sql
```

**Option B: Using pgAdmin**
1. Go to https://pgadmin.org
2. Create account
3. Add Railway PostgreSQL connection
4. Run the schema SQL manually

**Option C: Manual (Easiest)**
1. In Railway dashboard, click PostgreSQL
2. Click "Data" tab
3. Click "Query Editor"
4. Copy and paste the contents of `backend/db/schema.sql`
5. Click "Execute"

---

## **Part 3: Deploy Frontend on Vercel**

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign in with GitHub
4. Authorize Vercel

### Step 2: Import Project
1. Click "New Project"
2. Import Git Repository
3. Search for and select `larrytc1/pivi-social-app`
4. Select `sprint-2-media-upload` branch

### Step 3: Configure Project
1. **Root Directory**: Select `frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `build`

### Step 4: Add Environment Variables
In the environment variables section, add:

```
REACT_APP_API_URL=https://your-railway-backend-url/api
```

(Replace with your actual Railway backend URL from Part 1, Step 6)

### Step 5: Deploy
Click "Deploy" and wait for it to finish (2-3 minutes)

### Step 6: Get Frontend URL
Once deployed, you'll see a "Visit" button or URL that looks like:
```
https://pivi-social-app-xxxxx.vercel.app
```

**This is your live app URL!** 🎉

---

## **Part 4: Configure Backend for Frontend**

Go back to Railway backend settings and update:

```
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

---

## **Part 5: Test Your Deployed App**

1. Open your frontend URL in browser
2. Click "Sign Up"
3. Create an account
4. Upload a photo or video
5. View feed, like, and comment

---

## **Common Issues & Solutions**

### ❌ 404 Backend Not Found
- Check that `REACT_APP_API_URL` in Vercel matches your Railway backend URL
- Make sure to include `/api` at the end
- Example: `https://railway-app-xxxxx.railway.app/api`

### ❌ Database Connection Error
- Check PostgreSQL connection string in Railway
- Make sure schema is imported
- Verify DB credentials in environment variables

### ❌ File Upload Not Working
- Ensure AWS S3 credentials are correct
- Check S3 bucket name
- Verify S3 bucket allows public uploads

### ❌ CORS Error
- Update `FRONTEND_URL` in Railway backend
- Must match your Vercel domain exactly
- Include https://

---

## **Useful Links**

- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

---

## **Next Steps**

Once deployed, you can:
- ✅ Share the Vercel URL with others
- ✅ Test the full application
- ✅ Upload real photos/videos
- ✅ Invite friends to test

---

**Need help? Check the troubleshooting section above!** 🚀
