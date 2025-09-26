import { Request, Response, NextFunction } from 'express';
import { FirebaseAdminService } from '../infrastructure/common/firebaseAdmin';
import { Logger } from '../utils/logger';

export const authenticateFirebaseToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Firebase ID token required'
      });
      return;
    }

    // Verify Firebase ID token
    const decodedToken = await FirebaseAdminService.verifyIdToken(token);
    
    // Get Firebase user details
    const firebaseUser = await FirebaseAdminService.getUser(decodedToken.uid);
    
    // Format user data
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || firebaseUser.displayName,
      picture: decodedToken.picture || firebaseUser.photoURL,
      phone_number: decodedToken.phone_number || firebaseUser.phoneNumber,
      email_verified: decodedToken.email_verified,
      provider: decodedToken.firebase.sign_in_provider
    };

    // Note: Database user lookup/creation will be handled by services in the request pipeline
    next();
  } catch (error) {
    Logger.error('Firebase authentication error:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid or expired Firebase token'
    });
  }
};

export const optionalFirebaseAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decodedToken = await FirebaseAdminService.verifyIdToken(token);
        const firebaseUser = await FirebaseAdminService.getUser(decodedToken.uid);
        
        req.firebaseUser = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || firebaseUser.displayName,
          picture: decodedToken.picture || firebaseUser.photoURL,
          phone_number: decodedToken.phone_number || firebaseUser.phoneNumber,
          email_verified: decodedToken.email_verified,
          provider: decodedToken.firebase.sign_in_provider
        };

        // Note: Database user lookup/creation will be handled by services in the request pipeline
      } catch (error) {
        // Token is invalid, but we continue without user
        Logger.info('Invalid Firebase token in optional auth:', error);
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
