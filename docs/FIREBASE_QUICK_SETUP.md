# Firebase Social Auth - Quick Setup Reference

## 🚀 Quick Start (5 minutes)

### 1. Run Setup Script
```bash
cd frontend
npm run setup-firebase
```

### 2. Get Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Project Settings → General
3. Scroll down to "Your apps" → Web app
4. Copy the config object values

### 3. Verify Configuration
```bash
npm run verify-firebase
```

## 🔧 Manual Setup Steps

### Firebase Console Setup
1. **Create Project**: Firebase Console → Create project
2. **Add Web App**: Project Settings → General → Add app → Web
3. **Enable Auth**: Authentication → Sign-in method → Enable Google & Microsoft

### Google Sign-In Setup
1. **OAuth Consent**: Google Cloud Console → OAuth consent screen
2. **Credentials**: APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. **Authorized Origins**: Add `http://localhost:5173` and your production domain

### Microsoft Sign-In Setup
1. **Create App**: Azure Portal → App registrations → New registration
2. **Get Credentials**: Copy Client ID and create Client Secret
3. **Configure Redirect URIs**: Add development and production domains
4. **Configure Firebase**: Add Client ID and Client Secret to Firebase

## 📋 Required Environment Variables

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🧪 Testing

### Development
```bash
npm run dev
# Navigate to /login
# Test Google and Microsoft buttons
```

### Production
- Deploy to your domain
- Update authorized domains in Firebase Console
- Test both authentication methods

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "App not verified" | Complete OAuth consent screen verification |
| "Invalid redirect URI" | Check authorized redirect URIs in Google Cloud Console |
| Microsoft Sign-In fails | Verify Microsoft Client ID and Client Secret configuration |
| Firebase config errors | Run `npm run verify-firebase` to check configuration |

## 📚 Full Documentation

For detailed step-by-step instructions, see: [FIREBASE_SOCIAL_AUTH_SETUP.md](./FIREBASE_SOCIAL_AUTH_SETUP.md)

## 🆘 Support

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform Docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
