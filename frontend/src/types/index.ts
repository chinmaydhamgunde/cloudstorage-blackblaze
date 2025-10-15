/**
 * TypeScript Type Definitions
 * 
 * These interfaces define the "shape" of data used in our app.
 * TypeScript catches errors before you run code (e.g., typos in property names).
 */

export interface FileItem {
  key: string;           // Unique identifier in B2 (e.g., "uploads/123-abc-photo.jpg")
  name: string;          // Original filename (e.g., "photo.jpg")
  size: number;          // File size in bytes
  lastModified: string;  // ISO date string
  downloadUrl: string;   // Presigned URL to download the file
}

export interface UploadProgress {
  fileName: string;
  progress: number;      // 0-100 percentage
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
