//src/components/Home.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h3" gutterBottom>
      Smart Waste Management System
    </Typography>
    <Typography variant="body1">
      Welcome to our advanced waste management solution
    </Typography>
  </Box>
);

export default Home;
