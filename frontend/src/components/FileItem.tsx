/**
 * File Item Component
 * 
 * Displays a single file as a card with metadata and actions (download, delete)
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import type { FileItem as FileItemType } from '../types';

interface FileItemProps {
  file: FileItemType;
  onDelete: (key: string) => void;
}

export const FileItem: React.FC<FileItemProps> = ({ file, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Format file size (bytes to KB/MB)
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Check if file is an image
  const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

  const handleDelete = () => {
    onDelete(file.key);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* File preview or icon */}
        <Box
          sx={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            overflow: 'hidden',
          }}
        >
          {isImage ? (
            <img
              src={file.downloadUrl}
              alt={file.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Fallback to icon if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <FileIcon sx={{ fontSize: 64, color: 'grey.500' }} />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          {/* File name */}
          <Typography variant="subtitle1" noWrap title={file.name} gutterBottom>
            {file.name}
          </Typography>

          {/* File metadata */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Chip label={formatFileSize(file.size)} size="small" />
            <Chip label={formatDate(file.lastModified)} size="small" variant="outlined" />
          </Box>
        </CardContent>

        {/* Action buttons */}
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <IconButton
            color="primary"
            href={file.downloadUrl}
            download={file.name}
            title="Download"
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete File?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{file.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
