/**
 * Cloud Storage Backend Server
 * 
 * This Express server acts as a security layer between your frontend and Backblaze B2.
 * It handles file uploads by proxying them to B2, avoiding CORS issues.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { b2Client, bucketName } from './b2Client.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL })); // Only allow requests from your frontend
app.use(express.json()); // Parse JSON request bodies

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});

/**
 * Health Check Endpoint
 * Test if server is running: http://localhost:5000/health
 */
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date() });
});

/**
 * Upload File Through Backend (CORS Workaround)
 * 
 * Frontend sends the actual file to backend, backend uploads to B2.
 * No CORS issues since server-to-server communication doesn't use CORS.
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const key = `uploads/${timestamp}-${randomId}-${file.originalname}`;

    // Upload to B2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalname: file.originalname,
        uploaddate: new Date().toISOString(),
      },
    });

    await b2Client.send(command);

    console.log(`✅ Uploaded file: ${file.originalname} (${key})`);

    // Generate download URL
    const downloadCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const downloadUrl = await getSignedUrl(b2Client, downloadCommand, { expiresIn: 3600 });

    res.json({
      success: true,
      key,
      name: file.originalname,
      size: file.size,
      downloadUrl,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
});

/**
 * Get Presigned Upload URL (Legacy - Optional)
 * 
 * Frontend sends: { fileName, fileType, fileSize }
 * Backend returns: { uploadUrl, key } - a temporary URL valid for 5 minutes
 * 
 * Note: This method may have CORS issues with B2. Use /api/upload instead.
 */
app.post('/api/upload-url', async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;

    // Validate input
    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    // Create a unique key (path) for the file in B2
    // Format: uploads/timestamp-randomId-filename.ext
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const key = `uploads/${timestamp}-${randomId}-${fileName}`;

    // Create a command to upload a file (PutObject)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
      // Store metadata for later retrieval
      Metadata: {
        originalname: fileName,
        uploaddate: new Date().toISOString(),
      },
    });

    // Generate a presigned URL that allows uploading for 5 minutes
    const uploadUrl = await getSignedUrl(b2Client, command, { expiresIn: 300 });

    console.log(`✅ Generated upload URL for: ${fileName}`);

    res.json({
      uploadUrl,
      key,
      message: 'Upload URL generated successfully',
    });
  } catch (error) {
    console.error('❌ Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL', details: error.message });
  }
});

/**
 * List Files in Bucket
 * 
 * Returns: Array of file objects with name, size, date, download URL
 * Supports pagination with maxKeys parameter
 */
app.get('/api/files', async (req, res) => {
  try {
    const maxKeys = parseInt(req.query.limit) || 50; // Default to 50 files

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: maxKeys,
      Prefix: 'uploads/', // Only list files in the uploads/ folder
    });

    const response = await b2Client.send(command);

    // Transform B2 response into user-friendly format
    const files = await Promise.all(
      (response.Contents || []).map(async (file) => {
        // Generate a presigned download URL (valid for 1 hour)
        const downloadCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: file.Key,
        });
        const downloadUrl = await getSignedUrl(b2Client, downloadCommand, { expiresIn: 3600 });

        return {
          key: file.Key,
          name: file.Key.split('-').slice(2).join('-'), // Extract original filename
          size: file.Size,
          lastModified: file.LastModified,
          downloadUrl,
        };
      })
    );

    console.log(`📂 Listed ${files.length} files`);

    res.json({
      files,
      count: files.length,
      isTruncated: response.IsTruncated, // More files available?
    });
  } catch (error) {
    console.error('❌ Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
});

/**
 * Delete File
 * 
 * Frontend sends: { key } - the file's unique identifier
 * Backend deletes the file from B2
 */
app.delete('/api/files/:key(*)', async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key);

    // Security check: Only allow deleting files in uploads/ folder
    if (!key.startsWith('uploads/')) {
      return res.status(403).json({ error: 'Access denied: Can only delete files in uploads/ folder' });
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await b2Client.send(command);

    console.log(`🗑️  Deleted file: ${key}`);

    res.json({ message: 'File deleted successfully', key });
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file', details: error.message });
  }
});

/**
 * Get Download URL for Specific File
 * 
 * Generates a fresh presigned URL (useful if the cached one expired)
 */
app.post('/api/download-url', async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'File key is required' });
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Generate presigned URL valid for 1 hour
    const downloadUrl = await getSignedUrl(b2Client, command, { expiresIn: 3600 });

    res.json({ downloadUrl, key });
  } catch (error) {
    console.error('❌ Error generating download URL:', error);
    res.status(500).json({ error: 'Failed to generate download URL', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📦 Connected to B2 bucket: ${bucketName}`);
  console.log(`🌐 Accepting requests from: ${process.env.FRONTEND_URL}\n`);
});
