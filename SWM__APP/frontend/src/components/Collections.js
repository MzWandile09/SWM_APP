// src/components/Collections.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Collections = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h3" gutterBottom>
      Collections Management
    </Typography>
    {/* Add clerk-specific content here */}
  </Box>
);

// Only ONE default export per file
export default Collections;