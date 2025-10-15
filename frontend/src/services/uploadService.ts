/**
 * Upload Service
 * 
 * Handles file uploads by sending files to backend (which uploads to B2)
 */

import axios from 'axios';
import type { UploadProgress } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const uploadFile = async (
  file: File,
  onProgress: (progress: UploadProgress) => void
): Promise<{ success: boolean; key?: string; error?: string }> => {
  try {
    // Initialize progress
    onProgress({
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    });

    // Create FormData with the file
    const formData = new FormData();
    formData.append('file', file);

    // Upload to backend (backend will upload to B2)
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            fileName: file.name,
            progress: percentCompleted,
            status: 'uploading',
          });
        }
      },
    });

    // Mark as complete
    onProgress({
      fileName: file.name,
      progress: 100,
      status: 'complete',
    });

    return { success: true, key: response.data.key };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
    
    onProgress({
      fileName: file.name,
      progress: 0,
      status: 'error',
      error: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

/**
 * Upload multiple files sequentially with individual progress tracking
 */
export const uploadMultipleFiles = async (
  files: File[],
  onProgress: (allProgress: Map<string, UploadProgress>) => void
): Promise<void> => {
  const progressMap = new Map<string, UploadProgress>();

  // Initialize progress for all files
  files.forEach((file) => {
    progressMap.set(file.name, {
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    });
  });
  onProgress(new Map(progressMap));

  // Upload files one by one
  for (const file of files) {
    await uploadFile(file, (progress) => {
      progressMap.set(file.name, progress);
      onProgress(new Map(progressMap));
    });
  }
};
