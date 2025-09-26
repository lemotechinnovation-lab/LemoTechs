import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { getServices } from '../infrastructure/di/injector';
import { deleteFromCloudinary } from '../middleware/upload';

// Upload single file
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }

    const userId = req.user?.userId;
    const file = req.file;

    // Save file info to database
    const { fileService } = getServices(req);
    const savedFile = await fileService.saveFile({
      filename: file.filename || file.originalname,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: (file as any).path || file.filename,
      userId: userId!
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: savedFile.id,
        filename: savedFile.filename,
        originalName: savedFile.original_name,
        mimetype: savedFile.mimetype,
        size: savedFile.size,
        url: savedFile.url,
        uploadedAt: savedFile.created_at
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Upload file error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error during file upload'
    });
  }
};

// Upload multiple files
export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
      return;
    }

    const userId = req.user?.userId;
    const files = req.files as Express.Multer.File[];
    const uploadedFiles = [];

    // Save each file to database
    for (const file of files) {
      const { fileService } = getServices(req);
    const savedFile = await fileService.saveFile({
        filename: file.filename || file.originalname,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: (file as any).path || file.filename,
        userId: userId!
      });

      uploadedFiles.push({
        id: savedFile.id,
        filename: savedFile.filename,
        originalName: savedFile.original_name,
        mimetype: savedFile.mimetype,
        size: savedFile.size,
        url: savedFile.url,
        uploadedAt: savedFile.created_at
      });
    }

    res.json({
      success: true,
      message: `${files.length} files uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    Logger.error('Upload files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during files upload'
    });
  }
};

// Get user's files
export const getUserFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { fileService } = getServices(req);
    const result = await fileService.getUserFiles(userId!, { page, limit });

    const files = result.files.map((file: any) => ({
      id: file.id,
      filename: file.filename,
      originalName: file.original_name,
      mimetype: file.mimetype,
      size: file.size,
      url: file.url,
      uploadedAt: file.created_at
    }));

    res.json({
      success: true,
      message: 'Files retrieved successfully',
      data: files,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    Logger.error('Get user files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete file
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Get file info
    const { fileService } = getServices(req);
    const file = await fileService.getFileById(id!, userId!);

    if (!file) {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
      return;
    }

    // Delete from Cloudinary if using cloud storage
    if (file.url.includes('cloudinary.com')) {
      const publicId = file.filename.split('.')[0]; // Extract public ID
      await deleteFromCloudinary(publicId!);
    }

    // Delete from database
    await fileService.deleteFile(id!);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    Logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during file deletion'
    });
  }
};

// Update user avatar
export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No avatar file uploaded'
      });
      return;
    }

    const userId = req.user?.userId;
    const file = req.file;
    const avatarUrl = (file as any).path || file.filename;

    // Update user's avatar
    const { userService } = getServices(req);
    const user = await userService.updateAvatar(userId!, avatarUrl);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    Logger.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during avatar update'
    });
  }
};
