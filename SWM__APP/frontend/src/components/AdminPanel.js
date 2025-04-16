// src/components/AdminPanel.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const AdminPanel = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h3" gutterBottom>
      Admin Dashboard
    </Typography>
    <Typography variant="body1">
      Administrator control panel
    </Typography>
  </Box>
);

export default AdminPanel;
