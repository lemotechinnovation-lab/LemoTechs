import { FileRepository } from '../../repositories/system/FileRepository';
import { UserRepository } from '../../repositories/user/UserRepository';
import { CreateFileRequest, FileProfile as FileModel } from '../../models/system/fileModel';
import { IFileService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';

export class FileService extends BaseService implements IFileService {
  constructor(
    private fileRepository: FileRepository,
    private userRepository: UserRepository
  ) {
    super();
  }

  /**
   * Save file
   */
  async saveFile(fileData: CreateFileRequest): Promise<FileModel | null> {
    this.logMethodEntry('saveFileModel', { filename: fileData.filename });
    
    try {
      const file = await this.fileRepository.create(fileData);
      
      this.logMethodExit('saveFileModel', { fileId: file?.id });
      return file;
    } catch (error) {
      this.handleError('saveFileModel', error);
    }
  }

  /**
   * Get user files
   */
  async getUserFiles(userId: string): Promise<FileModel[]> {
    this.logMethodEntry('getUserFileModels', { userId });
    
    try {
      const files = await this.fileRepository.findByUserId(userId);
      
      this.logMethodExit('getUserFileModels', { count: files.length });
      return files;
    } catch (error) {
      this.handleError('getUserFileModels', error);
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId: string): Promise<FileModel | null> {
    this.logMethodEntry('getFileModelById', { fileId });
    
    try {
      const file = await this.fileRepository.findById(fileId);
      
      this.logMethodExit('getFileModelById', { found: file !== null });
      return file;
    } catch (error) {
      this.handleError('getFileModelById', error);
    }
  }

  /**
   * Delete file
   */
  async deleteFileModel(fileId: string): Promise<boolean> {
    this.logMethodEntry('deleteFileModel', { fileId });
    
    try {
      const result = await this.fileRepository.delete(fileId);
      
      this.logMethodExit('deleteFileModel', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('deleteFileModel', error);
    }
  }

  /**
   * Update user avatar
   */
  async updateUserAvatar(userId: string, avatarUrl: string): Promise<boolean> {
    this.logMethodEntry('updateUserAvatar', { userId });
    
    try {
      const result = await this.userRepository.update(userId, { avatar: avatarUrl });
      
      this.logMethodExit('updateUserAvatar', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updateUserAvatar', error);
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<boolean> {
    this.logMethodEntry('deleteFile', { fileId });
    
    try {
      await this.fileRepository.delete(fileId);
      this.logMethodExit('deleteFile', { success: true });
      return true;
    } catch (error) {
      this.handleError('deleteFile', error);
    }
  }
}