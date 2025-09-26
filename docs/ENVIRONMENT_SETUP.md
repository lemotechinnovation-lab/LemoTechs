# 🔧 Environment Setup Guide

## 📋 Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Application Settings
VITE_APP_TITLE=LemoTech
VITE_ENVIRONMENT=development

# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Stripe Configuration  
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Firebase Configuration (for social authentication)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BACKEND_URL=http://localhost:3001
```

## 🗺️ Google Maps API Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing project
3. **Enable the following APIs**:
   - Maps JavaScript API
   - Places API (for autocomplete)
   - Geocoding API (for address conversion)
4. **Create credentials**:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the API key to `VITE_GOOGLE_MAPS_API_KEY`
5. **Restrict the API key** (recommended):
   - HTTP referrers: `localhost:5173/*`, `yourdomain.com/*`

## 💳 Stripe Setup

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Switch to Test Mode** (toggle in dashboard)
3. **Get your test keys**:
   - Go to "Developers" → "API keys"
   - Copy "Publishable key" to `VITE_STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" to `VITE_STRIPE_SECRET_KEY`
4. **Set up webhooks** (for backend):
   - Go to "Developers" → "Webhooks"
   - Add endpoint: `http://localhost:3001/api/webhooks/stripe`
   - Copy webhook secret to `VITE_STRIPE_WEBHOOK_SECRET`

## 🛠️ Quick Setup Commands

```bash
# 1. Copy the environment template
cp ENVIRONMENT_SETUP.md .env.local

# 2. Edit the file with your actual keys
# Replace all "your_*_here" placeholders

# 3. Test the setup
npm run dev
```

## ⚠️ Security Notes

- ✅ **Never commit `.env.local`** to version control
- ✅ **Use test keys** for development
- ✅ **Restrict API keys** to specific domains
- ✅ **Rotate keys** if compromised
- ✅ **Use environment variables** for all secrets

## 🔍 Verify Setup

After setup, verify everything works:

1. **Google Maps**: Address autocomplete should work in booking form
2. **Stripe**: Payment forms should initialize without errors
3. **Console**: No API key errors in browser console

## 📞 Support

If you encounter issues:
1. Check browser console for specific error messages
2. Verify API keys are correctly copied (no extra spaces)
3. Ensure all required APIs are enabled in Google Cloud Console
4. Confirm Stripe is in test mode
