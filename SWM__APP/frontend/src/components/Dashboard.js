// src/components/Dashboard.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Welcome, {user?.first_name} {user?.last_name}
      </Typography>
      <Typography variant="h5">
        Role: {user?.user_role}
      </Typography>
    </Box>
  );
};

export default Dashboard;
