import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as SignupIcon,
  ManageAccounts as UserManagementIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useTheme } from '@mui/material/styles';

export default function NavBar({ drawerWidth = 240 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => setOpen(!open);
  const handleNavigation = () => isMobile && setOpen(false);

  const NavigationItem = ({ to, icon, text }) => (
    <ListItemButton
      component={Link}
      to={to}
      selected={location.pathname === to}
      onClick={handleNavigation}
      sx={{
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          borderRight: `3px solid ${theme.palette.primary.main}`,
          fontWeight: 'bold'
        },
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        }
      }}
    >
      <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#ffffff'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#1976d2'
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              color: '#1976d2',
              fontWeight: 'bold' 
            }}
          >
            Smart Waste Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none'
            }
          }}
        >
          <Toolbar />
          <List>
            {user ? (
              <>
                <NavigationItem to="/dashboard" icon={<HomeIcon />} text="Dashboard" />

                {user.user_role === 'Admin' && (
                  <NavigationItem to="/admin-dashboard" icon={<UserManagementIcon />} text="Dashboard"/>
                )}

                {['Clerk', 'Manager'].includes(user.user_role) && (
                  <NavigationItem to="/collections" icon={<AssignmentIcon />} text="Collections" />
                )}

                {/* Added Profile link here */}
                <NavigationItem to="/profile" icon={<PersonIcon />} text="My Profile" />

                <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <>
                <NavigationItem to="/login" icon={<LoginIcon />} text="Login" />
                <NavigationItem to="/create" icon={<SignupIcon />} text="Create Account" />
              </>
            )}
            <NavigationItem to="/about" icon={<InfoIcon />} text="About" />
          </List>
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
