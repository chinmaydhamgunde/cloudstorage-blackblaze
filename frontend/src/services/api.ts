/**
 * API Service
 * 
 * Centralized functions to communicate with the backend server.
 * All API calls go through here for consistency and error handling.
 */

import axios from 'axios';
import type { FileItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch list of all files in the bucket
 */
export const listFiles = async (limit: number = 50): Promise<FileItem[]> => {
  const response = await apiClient.get(`/api/files?limit=${limit}`);
  return response.data.files;
};

/**
 * Delete a file from B2
 */
export const deleteFile = async (key: string): Promise<void> => {
  await apiClient.delete(`/api/files/${encodeURIComponent(key)}`);
};

/**
 * Get a fresh download URL for a file
 */
export const getDownloadUrl = async (key: string): Promise<string> => {
  const response = await apiClient.post('/api/download-url', { key });
  return response.data.downloadUrl;
};
