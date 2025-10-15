/**
 * Backblaze B2 Client Configuration
 *
 * This file sets up the connection to Backblaze B2 using the S3-compatible API.
 * We use AWS SDK v3 because B2 supports S3 protocol, making it easier for beginners.
 */

import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Create an S3 client configured for Backblaze B2
 *
 * Why these settings:
 * - endpoint: Tells SDK to talk to Backblaze instead of Amazon S3
 * - region: Required by S3 protocol, matches your bucket's region
 * - credentials: Your B2 keys act like AWS access keys
 * - forcePathStyle: B2 requires this for S3 compatibility
 */
export const b2Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  // B2 requires path-style URLs: https://endpoint/bucket/key
  // (instead of subdomain style: https://bucket.endpoint/key)
  forcePathStyle: true,
});

// Export bucket name for easy access
export const bucketName = process.env.B2_BUCKET_NAME;
