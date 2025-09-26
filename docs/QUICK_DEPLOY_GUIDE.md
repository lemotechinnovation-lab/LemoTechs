# ⚡ Quick Production Deployment Guide

## 🚀 Deploy in 5 Minutes

### Prerequisites
- GitHub repository with your code
- Railway account (free tier available)
- Vercel account (free tier available)

## Step 1: Deploy Backend (Railway)

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub** (connects your Microsoft GitHub account)
3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Railway will show all your GitHub repositories
   - Choose your `lemotechinnovations` repository
   - Select `backend` folder as root directory

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-configure

5. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   BACKEND_URL=https://your-backend-url.railway.app
   FRONTEND_URL=https://your-frontend-url.vercel.app
   JWT_SECRET=your-super-secure-secret
   ENABLE_RATE_LIMITING=true
   ENABLE_LOGGING=true
   
   # PayFast (Production)
   PAYFAST_MERCHANT_ID=your-merchant-id
   PAYFAST_MERCHANT_KEY=your-merchant-key
   PAYFAST_PASSPHRASE=your-passphrase
   PAYFAST_ENVIRONMENT=production
   
   # Firebase
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_API_KEY=your-api-key
   # ... (add all Firebase config)
   
   # Twilio
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=your-phone-number
   ```

6. **Deploy**
   - Railway will auto-deploy
   - Wait for deployment to complete
   - Copy your backend URL

## Step 2: Deploy Frontend (Vercel)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub** (connects your Microsoft GitHub account)
3. **Import Project**
   - Click "New Project"
   - Vercel will show all your GitHub repositories
   - Select your `lemotechinnovations` repository
   - Set Root Directory to `frontend`
   - Framework: Vite (auto-detected)

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_APP_ENV=production
   
   # Firebase (Frontend)
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_API_KEY=your-api-key
   # ... (add all Firebase config)
   
   # Google Maps
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Copy your frontend URL

## Step 3: Update URLs

1. **Update Backend CORS**
   - In Railway, update `CORS_ORIGIN` with your Vercel URL
   - Redeploy backend

2. **Update Frontend API URL**
   - In Vercel, update `VITE_API_URL` with your Railway URL
   - Redeploy frontend

## Step 4: Test Deployment

1. **Health Check**
   ```
   curl https://your-backend-url.railway.app/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Test login/registration
   - Test booking flow

3. **Test PayFast**
   - Create a test payment
   - Verify webhook works

## Step 5: Database Setup

1. **Run Migrations**
   ```bash
   # Connect to Railway database
   npm run migrate:prod
   ```

2. **Verify Tables**
   - Check Railway database dashboard
   - Ensure all tables are created

## 🎉 You're Live!

Your LemoTech application is now deployed and accessible at:
- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend**: `https://your-backend-url.railway.app`

## 🔧 Next Steps

1. **Set up monitoring**
2. **Configure custom domains**
3. **Set up SSL certificates**
4. **Configure backups**
5. **Set up alerts**

## 📞 Support

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- LemoTech Team: [Your contact info]

---

**Deployment Time**: ~5 minutes
**Cost**: Free tier available on both platforms
