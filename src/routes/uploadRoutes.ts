import { Router } from 'express';
import { injectServices } from '../infrastructure/di/injector';
import {
  uploadFile,
  uploadFiles,
  getUserFiles,
  deleteFile,
  updateAvatar
} from '../controllers/uploadController';
import { uploadSingle, uploadMultiple, uploadAvatar } from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Upload single file
router.post('/single', injectServices, authenticateToken, uploadSingle, uploadFile);

// Upload multiple files
router.post('/multiple', injectServices, authenticateToken, uploadMultiple, uploadFiles);

// Update user avatar
router.post('/avatar', injectServices, authenticateToken, uploadAvatar, updateAvatar);

// Get user's files
router.get('/', injectServices, authenticateToken, getUserFiles);

// Delete file
router.delete('/:id', injectServices, authenticateToken, deleteFile);

export default router;
