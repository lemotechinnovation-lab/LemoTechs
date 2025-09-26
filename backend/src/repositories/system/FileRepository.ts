// File Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { FileConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { File } from '../../infrastructure/entities/databaseSchema';

export class FileRepository extends Repository<File> {
  constructor(client: PoolClient) {
    super(client, FileConfiguration, EntityMappers.file);
  }

  // Find files by user ID
  async findByUserId(userId: string): Promise<File[]> {
    return await this.findWhere(file => file.userId === userId);
  }

  // Find files by type
  async findByMimeType(mimeType: string): Promise<File[]> {
    return await this.findWhere(file => file.mimetype.startsWith(mimeType));
  }

  // Find image files
  async findImageFiles(): Promise<File[]> {
    return await this.findByMimeType('image/');
  }

  // Find document files
  async findDocumentFiles(): Promise<File[]> {
    return await this.findByMimeType('application/');
  }
}

export default FileRepository;
