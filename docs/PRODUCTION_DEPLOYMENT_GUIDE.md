# 🚀 LemoTech Production Deployment Guide

## Overview
This guide covers deploying the LemoTech application to production using Railway (backend) and Vercel (frontend).

## Prerequisites
- Azure DevOps repository with your code
- Railway account (supports Azure DevOps)
- Vercel account (supports Azure DevOps)
- Domain name (optional)

## 1. Backend Deployment (Railway)

### Step 1.1: Prepare Backend for Production

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with Azure DevOps
   - Connect your Azure DevOps repository

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from Azure DevOps repo"
   - Choose your LemoTech repository
   - Select the `backend` folder

### Step 1.2: Configure Environment Variables

Add these environment variables in Railway dashboard:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://lemotech-frontend.vercel.app

# URLs
BACKEND_URL=https://lemotech-backend.railway.app
FRONTEND_URL=https://lemotech-frontend.vercel.app

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
ENABLE_RATE_LIMITING=true
ENABLE_LOGGING=true

# PayFast (Production)
PAYFAST_MERCHANT_ID=your-production-merchant-id
PAYFAST_MERCHANT_KEY=your-production-merchant-key
PAYFAST_PASSPHRASE=your-production-passphrase
PAYFAST_ENVIRONMENT=production

# Firebase (Production)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_API_KEY=your-api-key

# Twilio (Production)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### Step 1.3: Add PostgreSQL Database

1. In Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create and configure the database
4. Copy the `DATABASE_URL` and add it to your environment variables

### Step 1.4: Deploy

Railway will automatically deploy when you push to your main branch.

## 2. Frontend Deployment (Vercel)

### Step 2.1: Prepare Frontend

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with Azure DevOps
   - Import your Azure DevOps repository

2. **Configure Project**
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 2.2: Environment Variables

Add these in Vercel dashboard:

```bash
# API Configuration
VITE_API_URL=https://lemotech-backend.railway.app/api
VITE_APP_ENV=production

# Firebase (Frontend)
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_API_KEY=your-api-key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Step 2.3: Deploy

Vercel will automatically deploy when you push to your main branch.

## 3. Database Migration

### Step 3.1: Run Database Migrations

```bash
# Connect to production database
npm run migrate:prod

# Or manually run the migration script
node scripts/migrate.js
```

### Step 3.2: Verify Database Schema

Check that all tables are created correctly:
- users
- drivers
- shops
- bookings
- payment_transactions
- payment_methods
- etc.

## 4. Domain Configuration (Optional)

### Step 4.1: Custom Domain

1. **Backend (Railway)**
   - Go to Railway project settings
   - Add custom domain
   - Configure DNS records

2. **Frontend (Vercel)**
   - Go to Vercel project settings
   - Add custom domain
   - Configure DNS records

### Step 4.2: SSL Certificates

Both Railway and Vercel provide automatic SSL certificates.

## 5. Testing Production Deployment

### Step 5.1: Health Check

```bash
# Test backend
curl https://lemotech-backend.railway.app/health

# Test frontend
curl https://lemotech-frontend.vercel.app
```

### Step 5.2: API Testing

Use your Postman collection to test all endpoints:
- Authentication
- Bookings
- Payments
- Shop Management

### Step 5.3: PayFast Integration

Test PayFast payments with production credentials.

## 6. Monitoring & Logs

### Step 6.1: Railway Monitoring

- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

### Step 6.2: Vercel Analytics

- Enable Vercel Analytics
- Monitor performance
- Track user behavior

## 7. Security Checklist

- [ ] All environment variables are set
- [ ] JWT secrets are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] SSL certificates are active
- [ ] Database credentials are secure
- [ ] API keys are production-ready

## 8. Backup Strategy

### Step 8.1: Database Backups

Railway provides automatic database backups.

### Step 8.2: Code Backups

Your code is backed up in GitHub.

## 9. Rollback Plan

If deployment fails:

1. **Railway**: Revert to previous deployment
2. **Vercel**: Revert to previous deployment
3. **Database**: Restore from backup

## 10. Post-Deployment

1. **Update Documentation**
2. **Notify Team**
3. **Monitor Performance**
4. **Set up Monitoring Alerts**

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify build commands
   - Check dependencies

2. **Database Connection Issues**
   - Verify DATABASE_URL
   - Check firewall settings
   - Ensure database is running

3. **CORS Issues**
   - Verify CORS_ORIGIN
   - Check frontend URL
   - Update backend CORS settings

## Support

- Railway Documentation: https://docs.railway.app
- Vercel Documentation: https://vercel.com/docs
- LemoTech Team: [Your contact info]

---

**Last Updated**: September 2024
**Version**: 1.0
