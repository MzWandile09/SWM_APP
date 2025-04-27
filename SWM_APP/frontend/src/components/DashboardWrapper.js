import React from 'react';
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  Skeleton,
  Fab 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { People as PeopleIcon } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import NavBar from './NavBar';

const DashboardWrapper = ({ children, isLoading }) => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <NavBar />

      <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 3,
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}>
        <Toolbar />

        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        ) : (
          children
        )}
      </Box>

      {/* Floating Action Button for Admin to navigate to user creation */}
      {user?.user_role === 'Admin' && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
          }}
          component={Link}
          to="/create" // ✅ Navigates to Create New User form
        >
          <PeopleIcon />
        </Fab>
      )}
    </Box>
  );
};

export default DashboardWrapper;
