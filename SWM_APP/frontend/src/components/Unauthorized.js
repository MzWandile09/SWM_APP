// src/components/Unauthorized.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        403 - Unauthorized Access
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You don't have permission to access this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;
