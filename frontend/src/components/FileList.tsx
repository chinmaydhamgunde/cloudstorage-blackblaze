/**
 * File List Component
 * 
 * Grid layout displaying all uploaded files
 */

import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { FileItem } from './FileItem';
import type { FileItem as FileItemType } from '../types';

interface FileListProps {
  files: FileItemType[];
  loading: boolean;
  error: string | null;
  onDelete: (key: string) => void;
  onRefresh: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  loading,
  error,
  onDelete,
  onRefresh,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (files.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No files yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your first file to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Files ({files.length})
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',  // 1 column on mobile
            sm: 'repeat(2, 1fr)',  // 2 columns on tablet
            md: 'repeat(3, 1fr)',  // 3 columns on desktop
            lg: 'repeat(4, 1fr)',  // 4 columns on large screens
          },
          gap: 3,
          mt: 1,
        }}
      >
        {files.map((file) => (
          <FileItem
            key={file.key}
            file={file}
            onDelete={(key) => {
              onDelete(key);
              onRefresh();
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
