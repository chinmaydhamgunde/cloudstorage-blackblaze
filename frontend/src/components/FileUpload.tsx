/**
 * File Upload Component
 * 
 * Drag-and-drop zone + file picker button
 * Shows upload progress for each file
 */

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { ProgressBar } from './ProgressBar';
import { uploadMultipleFiles } from '../services/uploadService';
import type { UploadProgress } from '../types';

interface FileUploadProps {
  onUploadComplete: () => void; // Callback to refresh file list
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadProgress(new Map());

    try {
      await uploadMultipleFiles(files, (progress) => {
        setUploadProgress(progress);
      });

      // Wait 1 second to show completion, then clear progress
      setTimeout(() => {
        setUploadProgress(new Map());
        setUploading(false);
        onUploadComplete(); // Refresh file list
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    disabled: uploading,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB max per file
  });

  return (
    <Box sx={{ mb: 4 }}>
      {/* Drag-and-drop zone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
        elevation={isDragActive ? 6 : 1}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or
        </Typography>
        <Button variant="contained" component="span" disabled={uploading}>
          Browse Files
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
          Maximum file size: 100MB
        </Typography>
      </Paper>

      {/* Upload progress bars */}
      {uploadProgress.size > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Uploading {uploadProgress.size} file(s)...
          </Typography>
          {Array.from(uploadProgress.values()).map((upload) => (
            <ProgressBar key={upload.fileName} upload={upload} />
          ))}
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
