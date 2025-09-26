import * as jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret';

export const generateAccessToken = (payload: Omit<JWTPayload, 'type'>): string => {
  const tokenPayload = { ...payload, type: 'access' };
  
  return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
};

export const generateRefreshToken = (payload: Omit<JWTPayload, 'type'>): string => {
  const tokenPayload = { ...payload, type: 'refresh' };
  
  return jwt.sign(tokenPayload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload;
};

export const generateTokenPair = (userId: string, email: string, role?: string) => {
  const payload = { userId, email, role };
  
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};
