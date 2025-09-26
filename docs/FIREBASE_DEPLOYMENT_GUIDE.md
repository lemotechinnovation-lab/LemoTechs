# 🔥 Firebase Deployment Guide

## Overview
This guide covers deploying the LemoTech frontend to Firebase Hosting and setting up Firebase for production.

## Prerequisites
- Firebase project created
- Firebase CLI installed
- Frontend built and ready

## 1. Frontend Deployment (Firebase Hosting)

### Step 1.1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 1.2: Login to Firebase
```bash
firebase login
```

### Step 1.3: Initialize Firebase in Frontend
```bash
cd frontend
firebase init hosting
```

### Step 1.4: Configure Firebase Hosting
```
? What do you want to use as your public directory? dist
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? Set up automatic builds and deploys with GitHub? Yes
? File dist/index.html already exists. Overwrite? No
```

### Step 1.5: Build and Deploy
```bash
npm run build
firebase deploy
```

## 2. Environment Variables for Firebase

### Step 2.1: Configure Environment Variables
Create `.env.production` in frontend:
```bash
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_APP_ENV=production

# Firebase (Frontend)
VITE_FIREBASE_PROJECT_ID=original-gasket-470103-u8
VITE_FIREBASE_AUTH_DOMAIN=original-gasket-470103-u8.firebaseapp.com
VITE_FIREBASE_API_KEY=AIzaSyDMtDunT3DOlEqoupCnw2K-Nzy0HWG0-kw

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Step 2.2: Update Firebase Configuration
Update `src/config/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export default app;
```

## 3. Backend Deployment Options

### Option 3.1: Railway (Recommended)
- Deploy backend to Railway
- Use PostgreSQL database
- Connect frontend to Railway API

### Option 3.2: Azure App Service
- Deploy backend to Azure
- Use Azure PostgreSQL
- Connect frontend to Azure API

### Option 3.3: Firebase Functions (Limited)
- Refactor backend to Firebase Functions
- Use Firestore database
- Requires significant code changes

## 4. Firebase Hosting Configuration

### Step 4.1: Custom Domain
1. **Go to Firebase Console**
2. **Select your project**
3. **Go to Hosting**
4. **Click "Add custom domain"**
5. **Follow DNS configuration instructions**

### Step 4.2: SSL Certificate
- Firebase automatically provides SSL certificates
- HTTPS is enabled by default

## 5. Firebase Features

### Step 5.1: Firebase Authentication
- User authentication
- Social login providers
- Custom authentication

### Step 5.2: Firebase Firestore
- NoSQL database
- Real-time updates
- Offline support

### Step 5.3: Firebase Storage
- File uploads
- Image storage
- Document storage

## 6. Deployment Commands

### Step 6.1: Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Step 6.2: Firebase Commands
```bash
# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy with preview
firebase hosting:channel:deploy preview

# Open hosting URL
firebase hosting:channel:open
```

## 7. Monitoring and Analytics

### Step 7.1: Firebase Analytics
- User behavior tracking
- Performance monitoring
- Custom events

### Step 7.2: Firebase Performance
- App performance monitoring
- Network monitoring
- Crash reporting

## 8. Security Rules

### Step 8.1: Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 8.2: Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 9. CI/CD with GitHub

### Step 9.1: GitHub Actions
Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Build
        run: cd frontend && npm run build
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: original-gasket-470103-u8
```

## 10. Troubleshooting

### Common Issues
1. **Build failures**: Check environment variables
2. **Deployment errors**: Verify Firebase CLI version
3. **Routing issues**: Check rewrite rules
4. **API connection**: Verify CORS settings

### Debug Commands
```bash
# Check Firebase CLI version
firebase --version

# Check project configuration
firebase projects:list

# View hosting logs
firebase hosting:channel:open

# Test locally
firebase serve
```

## 11. Production Checklist

- [ ] Firebase project configured
- [ ] Environment variables set
- [ ] Build process working
- [ ] Deployment successful
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Security rules configured
- [ ] CI/CD pipeline working
- [ ] Monitoring set up

## 12. Next Steps

1. **Deploy backend** to Railway or Azure
2. **Connect frontend** to backend API
3. **Set up monitoring**
4. **Configure backups**
5. **Test all functionality**

---

**Firebase Hosting URL**: https://original-gasket-470103-u8.web.app
**Last Updated**: September 2024
