import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';

// Firebase configuration - Add your config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX'
};

// Check if Firebase is properly configured
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                            import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                            !import.meta.env.VITE_FIREBASE_API_KEY.includes('demo');

// Initialize Firebase only if properly configured
let app: any = null;
let auth: any = null;

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    // Initialize with demo config for development (silent)
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (error) {
  console.error('🔥 Firebase: Failed to initialize:', error);
  // Create mock auth object to prevent crashes
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
    signOut: () => Promise.resolve()
  };
}

export { auth };

// Configure providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Facebook Sign-In provider
const microsoftProvider = new OAuthProvider('microsoft.com');

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  providerId: string;
  accessToken?: string;
  createdAt?: Date;
  lastSignIn?: Date;
}

export class FirebaseAuthService {
  // Check if Firebase is available
  private static isAvailable(): boolean {
    const isAvailable = auth !== null && auth !== undefined;
    console.log('🔥 Firebase Auth Available:', isAvailable, 'Auth object:', auth);
    return isAvailable;
  }

  // Phone Number Authentication
  static async signInWithPhoneNumber(phoneNumber: string): Promise<string> {
    console.log('🔥 Phone Auth: Starting with number:', phoneNumber);
    
    // For now, always use demo mode since Firebase phone auth requires proper setup
    console.log('🔥 Phone Auth: Using demo mode - SMS will not be sent');
    console.log('🔥 Phone Auth: In production, configure Firebase phone auth and reCAPTCHA');
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return demo verification ID
    const demoVerificationId = 'demo_verification_id_' + Date.now();
    console.log('🔥 Phone Auth: Demo verification ID created:', demoVerificationId);
    
    return demoVerificationId;
    
    /* 
    // Real Firebase implementation (commented out until properly configured)
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication is not configured. Please set up your environment variables.');
    }
    
    try {
      // Check if reCAPTCHA container exists
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        throw new Error('reCAPTCHA container not found. Please ensure the container exists in the DOM.');
      }

      // Create reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('🔥 reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('🔥 reCAPTCHA expired');
        }
      });

      console.log('🔥 Phone Auth: Sending verification code...');
      
      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('🔥 Phone Auth: Code sent successfully, verification ID:', confirmationResult.verificationId);
      
      return confirmationResult.verificationId;
    } catch (error: any) {
      console.error('🔥 Phone Auth Error:', error);
      throw this.handleAuthError(error);
    }
    */
  }

  static async verifyPhoneNumber(verificationId: string, code: string): Promise<AuthUser> {
    console.log('🔥 Phone Verify: Starting with ID:', verificationId, 'Code:', code);
    
    // For demo mode, accept any 6-digit code
    if (verificationId.startsWith('demo_verification_id_')) {
      console.log('🔥 Phone Verify: Demo mode - accepting any 6-digit code');
      
      if (code.length !== 6) {
        throw new Error('Please enter a 6-digit verification code');
      }
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return demo user
      const demoUser = {
        uid: 'demo-phone-user-' + Date.now(),
        email: null,
        displayName: 'Demo Phone User',
        photoURL: null,
        phoneNumber: '+27821234567',
        emailVerified: false,
        providerId: 'phone',
        createdAt: new Date(),
        lastSignIn: new Date()
      };
      
      console.log('🔥 Phone Verify: Demo verification successful!', demoUser);
      return demoUser;
    }
    
    // Real Firebase implementation (for when properly configured)
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication is not configured. Please set up your environment variables.');
    }
    
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(auth, credential);
      console.log('🔥 Phone Verify: Success!', result.user);
      return this.formatUser(result.user);
    } catch (error: any) {
      console.error('🔥 Phone Verify Error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Email/Password Authentication
  static async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication is not configured. Please set up your environment variables.');
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return this.formatUser(result.user);
    } catch (error: any) {
      console.error('Email sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  static async signUpWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return this.formatUser(result.user);
    } catch (error: any) {
      console.error('Email sign up error:', error);
      throw this.handleAuthError(error);
    }
  }


  // Sign Out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback(this.formatUser(user));
      } else {
        callback(null);
      }
    });
  }

  // Get Firebase ID Token (for backend verification)
  static async getIdToken(): Promise<string | null> {
    console.log('🔥 getIdToken: Starting...');
    
    if (!this.isAvailable()) {
      console.log('🔥 getIdToken: Firebase not available, returning demo token');
      return 'demo_token_' + Date.now();
    }
    
    const user = auth.currentUser;
    console.log('🔥 getIdToken: Current user:', user);
    
    if (user) {
      try {
        const token = await user.getIdToken();
        console.log('🔥 getIdToken: Real token received:', token);
        return token;
      } catch (error) {
        console.error('🔥 getIdToken: Error getting real token:', error);
        return 'demo_token_' + Date.now();
      }
    }
    
    console.log('🔥 getIdToken: No user, returning demo token');
    return 'demo_token_' + Date.now();
  }

  // Social Authentication
  static async signInWithGoogle(): Promise<AuthUser> {
    console.log('🔥 Google Sign-In: Starting...');
    if (!this.isAvailable()) {
      console.log('🔥 Google Sign-In: Firebase not available, using demo user');
      // Return demo user for development
      return {
        uid: 'demo-google-user',
        email: 'demo@lemotech.co.za',
        displayName: 'Demo Google User',
        photoURL: null,
        phoneNumber: null,
        emailVerified: true,
        providerId: 'google.com',
        createdAt: new Date(),
        lastSignIn: new Date()
      };
    }
    try {
      console.log('🔥 Google Sign-In: Calling signInWithPopup...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('🔥 Google Sign-In: Success!', result);
      return this.formatUser(result.user);
    } catch (error: any) {
      console.error('🔥 Google Sign-In: Error:', error);
      throw this.handleAuthError(error);
    }
  }

  static async signInWithMicrosoft(): Promise<AuthUser> {
    console.log('🔥 Microsoft Sign-In: Starting...');
    if (!this.isAvailable()) {
      console.log('🔥 Microsoft Sign-In: Firebase not available, using demo user');
      // Return demo user for development
      return {
        uid: 'demo-microsoft-user',
        email: 'demo@lemotech.co.za',
        displayName: 'Demo Microsoft User',
        photoURL: null,
        phoneNumber: null,
        emailVerified: true,
        providerId: 'microsoft.com',
        createdAt: new Date(),
        lastSignIn: new Date()
      };
    }
    try {
      console.log('🔥 Microsoft Sign-In: Calling signInWithPopup...');
      const result = await signInWithPopup(auth, microsoftProvider);
      console.log('🔥 Microsoft Sign-In: Success!', result);
      return this.formatUser(result.user);
    } catch (error: any) {
      console.error('🔥 Microsoft Sign-In: Error:', error);
      throw this.handleAuthError(error);
    }
  }


  // Format Firebase user to our AuthUser interface
  private static formatUser(user: FirebaseUser): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      providerId: user.providerData[0]?.providerId || 'email',
      createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : undefined,
      lastSignIn: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : undefined
    };
  }

  // Handle Firebase auth errors
  private static handleAuthError(error: any): Error {
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('No account found with this email address.');
      case 'auth/wrong-password':
        return new Error('Incorrect password.');
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists.');
      case 'auth/weak-password':
        return new Error('Password is too weak. Please choose a stronger password.');
      case 'auth/invalid-email':
        return new Error('Invalid email address.');
      case 'auth/popup-closed-by-user':
        return new Error('Sign-in popup was closed before completing.');
      case 'auth/cancelled-popup-request':
        return new Error('Sign-in was cancelled.');
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your connection and try again.');
      case 'auth/invalid-phone-number':
        return new Error('Invalid phone number format. Please use international format (+27xxxxxxxxx).');
      case 'auth/too-many-requests':
        return new Error('Too many requests. Please try again later.');
      case 'auth/invalid-verification-code':
        return new Error('Invalid verification code. Please check and try again.');
      case 'auth/invalid-verification-id':
        return new Error('Invalid verification ID. Please request a new code.');
      case 'auth/code-expired':
        return new Error('Verification code has expired. Please request a new one.');
      case 'auth/missing-phone-number':
        return new Error('Phone number is required.');
      case 'auth/quota-exceeded':
        return new Error('SMS quota exceeded. Please try again later.');
      default:
        return new Error(error.message || 'An authentication error occurred.');
    }
  }
}

export default FirebaseAuthService;
