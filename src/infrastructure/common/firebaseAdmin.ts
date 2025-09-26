import admin from 'firebase-admin';
import { Logger } from '../../utils/logger';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // For development, use service account key file
    // For production, use environment variables or service account
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : require('../../firebase-service-account.json'); // Create this file

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    
    Logger.info('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    Logger.warn('⚠️ Firebase Admin SDK not initialized - Firebase features will be disabled');
    Logger.warn('To enable Firebase, add FIREBASE_SERVICE_ACCOUNT_KEY to environment variables or create firebase-service-account.json');
  }
}

export const firebaseAdmin = admin;
export const auth = admin.apps.length > 0 ? admin.auth() : null;

export class FirebaseAdminService {
  // Check if Firebase is initialized
  private static isFirebaseInitialized(): boolean {
    return admin.apps.length > 0;
  }

  // Verify Firebase ID token
  static async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.isFirebaseInitialized() || !auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      Logger.error('Error verifying Firebase ID token:', error);
      throw new Error('Invalid or expired token');
    }
  }

  // Get user by UID
  static async getUser(uid: string): Promise<admin.auth.UserRecord> {
    if (!this.isFirebaseInitialized() || !auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    try {
      return await auth.getUser(uid);
    } catch (error) {
      Logger.error('Error fetching user:', error);
      throw new Error('User not found');
    }
  }

  // Create custom token
  static async createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
    if (!this.isFirebaseInitialized() || !auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    try {
      return await auth.createCustomToken(uid, additionalClaims);
    } catch (error) {
      Logger.error('Error creating custom token:', error);
      throw error;
    }
  }

  // Set custom user claims (for roles/permissions)
  static async setCustomClaims(uid: string, claims: object): Promise<void> {
    if (!this.isFirebaseInitialized() || !auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    try {
      await auth.setCustomUserClaims(uid, claims);
    } catch (error) {
      Logger.error('Error setting custom claims:', error);
      throw error;
    }
  }

  // Disable/Enable user
  static async updateUser(uid: string, properties: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> {
    if (!this.isFirebaseInitialized() || !auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    try {
      return await auth.updateUser(uid, properties);
    } catch (error) {
      Logger.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(uid: string): Promise<void> {
    if (!this.isFirebaseInitialized() || !auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    try {
      await auth.deleteUser(uid);
    } catch (error) {
      Logger.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default FirebaseAdminService;
