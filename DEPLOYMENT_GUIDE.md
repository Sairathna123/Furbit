# Furbit Deployment Guide

## Why Deploy?

Currently, your QR codes only work on the same WiFi network. By deploying online, users anywhere in the world can scan QR codes and view pet passports!

## Deployment Options (Free Tier Available)

### Option 1: Quick Deploy (Recommended for Beginners)

#### Frontend → Vercel
1. Push code to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "New Project"
5. Import your GitHub repository
6. Vercel auto-detects React and builds it
7. You get: `https://your-app.vercel.app`

#### Backend → Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add your MONGO_URI, JWT_SECRET, etc.
6. You get: `https://your-api.onrender.com`

#### Database → MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier)
3. Create a cluster
4. Get connection string
5. Add to Render environment variables

### Option 2: Alternative Platforms

#### Frontend Alternatives:
- **Netlify**: Similar to Vercel, very easy
- **GitHub Pages**: Free but requires some config
- **Cloudflare Pages**: Fast and free

#### Backend Alternatives:
- **Railway**: Great free tier, easy deployment
- **Fly.io**: Fast, global deployment
- **Heroku**: Classic choice (limited free tier)

## After Deployment Setup

### 1. Update Environment Variables

**Backend (.env on Render/Railway):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/furbit
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=https://your-app.vercel.app
PUBLIC_CLIENT_URL=https://your-app.vercel.app
PORT=5000
```

**Frontend (Environment Variables on Vercel):**
```env
REACT_APP_API_URL=https://your-api.onrender.com
```

### 2. Update CORS Settings

In `backend/index.js` or `backend/server.js`, update CORS to allow your frontend:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 3. Test Your Deployment

1. Visit your frontend URL: `https://your-app.vercel.app`
2. Create a pet passport
3. Generate QR code
4. Scan QR from ANY device (even on mobile data!)
5. ✅ Public passport should load!

## Development Alternative: ngrok (Testing Only)

If you just want to test QR codes without full deployment:

1. Install ngrok: `npm install -g ngrok`
2. Start your backend: `npm start` (in backend folder)
3. In new terminal: `ngrok http 3000` (for frontend)
4. You get a temporary public URL: `https://abc123.ngrok.io`
5. Use this URL in QR codes (expires when ngrok stops)

**Note**: ngrok is for testing only, not production!

## Step-by-Step: Deploy to Vercel + Render (Fastest Method)

### Step 1: Prepare Your Code

1. Make sure you have a GitHub account
2. Push your Furbit project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/furbit.git
   git push -u origin main
   ```

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your `furbit` repository
4. **Root Directory**: Leave as is (or select root)
5. **Framework Preset**: Create React App (auto-detected)
6. **Build Command**: `npm run build`
7. **Output Directory**: `build`
8. Click "Deploy"
9. **Save your URL**: `https://furbit-xyz.vercel.app`

### Step 3: Deploy Backend to Render

1. Go to [render.com](https://render.com) → Sign up
2. Click "New +" → "Web Service"
3. Connect GitHub → Select `furbit` repo
4. Configure:
   - **Name**: `furbit-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Advanced" → Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_URL=https://furbit-xyz.vercel.app
   PUBLIC_CLIENT_URL=https://furbit-xyz.vercel.app
   PORT=5000
   ```
6. Click "Create Web Service"
7. **Save your API URL**: `https://furbit-backend.onrender.com`

### Step 4: Connect Frontend to Backend

1. Go back to Vercel → Your Project → Settings → Environment Variables
2. Add:
   ```
   REACT_APP_API_URL=https://furbit-backend.onrender.com
   ```
3. Redeploy: Deployments → Click ⋯ → Redeploy

### Step 5: Setup MongoDB Atlas

1. [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create free cluster
3. Database Access → Add user (save username/password)
4. Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
5. Connect → Get connection string
6. Update `MONGO_URI` on Render with this string

### Step 6: Test Everything!

1. Visit `https://furbit-xyz.vercel.app`
2. Sign up → Create pet passport → Generate QR
3. Scan QR from phone (even on mobile data!)
4. ✅ Should work globally!

## Cost Breakdown

- **Frontend (Vercel)**: FREE forever
- **Backend (Render)**: FREE tier (sleeps after inactivity, wakes on request)
- **Database (MongoDB Atlas)**: FREE tier (512MB)
- **Total**: $0/month for hobby projects!

## Troubleshooting

### QR Code Still Not Working?
1. Check `PUBLIC_CLIENT_URL` points to Vercel URL
2. Restart backend on Render
3. Regenerate QR codes (old ones have old URL)

### Backend Not Responding?
- Render free tier "sleeps" after 15min inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast

### CORS Errors?
- Ensure `CLIENT_URL` in backend matches exact Vercel URL
- Check CORS middleware in backend code

## Going Production Ready

For serious deployment:
- **Backend**: Upgrade to paid tier ($7/month) for no sleep
- **Domain**: Buy custom domain (e.g., furbit.com)
- **SSL**: Auto-included with Vercel/Render
- **Monitoring**: Add error tracking (Sentry)
- **Analytics**: Add usage tracking

---

**Bottom Line**: Deploy to Vercel + Render, and your QR codes will work globally! 🌍
