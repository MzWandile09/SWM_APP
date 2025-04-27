import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.user_role) {
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        case 'Clerk':
          navigate('/clerk-dashboard');
          break;
        case 'Manager':
          navigate('/manager-dashboard');
          break;
        case 'Driver':
          navigate('/driver-dashboard');
          break;
        case 'Resident':
          navigate('/resident-dashboard');
          break;
        default:
          navigate('/unauthorized');
      }
    }
  }, [user, navigate]);
  
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>Redirecting to your dashboard...</Typography>
    </Box>
  );
};

export default RoleBasedDashboard;