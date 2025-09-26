import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { JWTPayload } from '../types';
import { ROLE_PERMISSIONS } from './roleAuth';
import { Logger } from '../utils/logger';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required'
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as JWTPayload & { role?: string };
    
    // Get user permissions based on role
    const userPermissions = decoded.role ? ROLE_PERMISSIONS[decoded.role] || [] : [];
    
    req.user = {
      ...decoded,
      permissions: userPermissions
    };
    
    next();
  } catch (error) {
    Logger.error('Token verification failed:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch (error) {
      // Token is invalid, but we continue without user
      Logger.info('Invalid token in optional auth:', error);
    }
  }
  
  next();
};
