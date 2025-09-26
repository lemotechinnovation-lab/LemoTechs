// Simple File Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateFileRequest {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  userId: string;
}

export interface FileProfile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  userId: string;
}

export interface FileUploadResponse {
  file: FileProfile;
  uploadUrl?: string;
}

export interface FileSearchFilters {
  userId?: string;
  mimetype?: string;
  fileType?: 'image' | 'document' | 'video' | 'audio';
  minSize?: number;
  maxSize?: number;
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
}