/**
 * Main App Component
 * 
 * Orchestrates the entire app:
 * - Fetches file list on load
 * - Handles uploads and deletions
 * - Manages global app state
 */

import { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { CloudQueue as CloudIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { listFiles, deleteFile } from './services/api';
import type { FileItem } from './types';

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load files on component mount
  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedFiles = await listFiles(50);
      setFiles(fetchedFiles);
    } catch (err: any) {
      setError(err.message || 'Failed to load files. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (key: string) => {
    try {
      await deleteFile(key);
      setSuccessMessage('File deleted successfully');
      loadFiles(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* App bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <CloudIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Cloud Storage
          </Typography>
          <Button
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={loadFiles}
            disabled={loading}
          >
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {/* Upload section */}
        <FileUpload onUploadComplete={loadFiles} />

        {/* File list */}
        <FileList
          files={files}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onRefresh={loadFiles}
        />
      </Container>

      {/* Success notification */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'grey.200',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Powered by Backblaze B2 Cloud Storage | Free Tier: 10GB Storage
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
