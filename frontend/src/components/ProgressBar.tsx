/**
 * Progress Bar Component
 *
 * Visual indicator showing upload progress (0-100%)
 */

import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import type { UploadProgress } from "../types";

interface ProgressBarProps {
  upload: UploadProgress;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ upload }) => {
  const getColor = () => {
    switch (upload.status) {
      case "complete":
        return "success";
      case "error":
        return "error";
      default:
        return "primary";
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ maxWidth: "70%" }}
        >
          {upload.fileName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {upload.status === "complete" ? "✓" : `${upload.progress}%`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={upload.progress}
        color={getColor()}
        sx={{ height: 8, borderRadius: 1 }}
      />
      {upload.error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {upload.error}
        </Typography>
      )}
    </Box>
  );
};
