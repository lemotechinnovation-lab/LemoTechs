# Firebase Social Authentication Setup Guide

This guide will walk you through setting up Google and Microsoft Sign-In with Firebase for the LemoTech application.

## Prerequisites

- Firebase project created
- Google Cloud Console access
- Microsoft account (for Microsoft Sign-In)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enter project name: `lemotechinnovations` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Add Web App to Firebase
1. In Firebase Console, click the web icon `</>`
2. Enter app nickname: `LemoTech Web App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

### 1.3 Update Environment Variables
Create/update your `.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 2: Google Sign-In Setup

### 2.1 Enable Google Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click on "Google" provider
3. Toggle "Enable" to ON
4. Set Project support email (required)
5. Click "Save"

### 2.2 Configure OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to "APIs & Services" → "OAuth consent screen"
4. Choose "External" user type
5. Fill in required fields:
   - App name: `LemoTech`
   - User support email: your email
   - Developer contact: your email
6. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
7. Add test users (for development)
8. Save and continue

### 2.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
6. Click "Create"
7. Copy the Client ID

### 2.4 Update Firebase Google Provider
1. Back in Firebase Console → Authentication → Sign-in method
2. Click on "Google" provider
3. Paste the Client ID from step 2.3
4. Click "Save"

## Step 3: Microsoft Sign-In Setup

### 3.1 Enable Microsoft Authentication
1. In Firebase Console → Authentication → Sign-in method
2. Click on "Microsoft" provider
3. Toggle "Enable" to ON
4. Click "Save"

### 3.2 Create Azure App Registration
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Fill in app details:
   - Name: `LemoTech`
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: `http://localhost:5173` (for development)
5. Click "Register"

### 3.3 Get Microsoft Credentials
1. In your Azure App dashboard
2. Copy the "Application (client) ID" (this is your Client ID)
3. Go to "Certificates & secrets" → "New client secret"
4. Copy the secret value (this is your Client Secret)

### 3.4 Configure Redirect URIs
1. In Azure App → "Authentication"
2. Click "Add a platform" → "Single-page application"
3. Add redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)

### 3.5 Update Firebase Microsoft Provider
1. Back in Firebase Console → Authentication → Sign-in method
2. Click on "Microsoft" provider
3. Enter:
   - Client ID: from step 3.3
   - Client Secret: from step 3.3
4. Click "Save"

## Step 4: Domain Configuration

### 4.1 Add Authorized Domains
1. In Firebase Console → Authentication → Settings
2. Add authorized domains:
   - `localhost` (development)
   - `yourdomain.com` (production)
   - Any other domains you use

### 4.2 Update Apple Service ID (if needed)
1. In Apple Developer Console → Service IDs
2. Edit your Service ID
3. Update domains and return URLs to match your production domain

## Step 5: Testing

### 5.1 Development Testing
1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Test Google Sign-In:
   - Click "Continue with Google"
   - Should open Google OAuth popup
   - Complete authentication flow
4. Test Microsoft Sign-In:
   - Click "Continue with Microsoft"
   - Should open Microsoft OAuth popup
   - Complete authentication flow

### 5.2 Production Testing
1. Deploy your application
2. Test both authentication methods on production domain
3. Verify user data is properly stored
4. Test logout functionality

## Step 6: Security Considerations

### 6.1 Environment Variables
- Never commit `.env` files to version control
- Use different Firebase projects for development and production
- Rotate API keys regularly

### 6.2 Domain Restrictions
- Only add necessary domains to authorized origins
- Remove development domains from production configuration
- Use HTTPS in production

### 6.3 User Data
- Implement proper user data validation
- Set up user profile completion flow
- Handle account linking for existing users

## Troubleshooting

### Common Issues

1. **"This app is not verified" warning**
   - Complete OAuth consent screen verification
   - Add test users for development

2. **"Invalid redirect URI" error**
   - Check authorized redirect URIs in Google Cloud Console
   - Ensure exact match with your domain

3. **Microsoft Sign-In not working**
   - Verify Microsoft Client ID and Secret
   - Check OAuth redirect URIs configuration
   - Ensure Azure App is properly configured

4. **Firebase configuration errors**
   - Verify environment variables are correct
   - Check Firebase project settings
   - Ensure web app is properly registered

### Debug Steps

1. Check browser console for errors
2. Verify Firebase configuration in Network tab
3. Test with different browsers
4. Check Firebase Console logs
5. Verify domain configuration

## Next Steps

After successful setup:

1. Implement user profile management
2. Add account linking functionality
3. Set up user role management
4. Implement proper error handling
5. Add analytics tracking
6. Set up email verification flow

## Support

For additional help:
- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
