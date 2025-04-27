// src/components/dashboards/DriverDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  Avatar,
  Button,
  CircularProgress,
  Box,
  ListItemText
} from '@mui/material';
import {
  DirectionsCar
} from '@mui/icons-material';
import DashboardWrapper from '../DashboardWrapper';
import { Link } from 'react-router-dom';
import api from '../Axios';

const DriverDashboard = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const response = await api.get('/collection-routes/');
        setRoutes(response.data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const getStatusActions = (currentStatus) => {
    switch (currentStatus) {
      case 'Planned':
        return [{ label: 'Start Route', status: 'In Progress' }];
      case 'In Progress':
        return [
          { label: 'Mark Completed', status: 'Completed' },
          { label: 'Delay Route', status: 'Delayed' }
        ];
      case 'Delayed':
        return [{ label: 'Resume Route', status: 'In Progress' }];
      default:
        return [];
    }
  };
  // Add real route status updates
const handleStatusUpdate = async (routeId, newStatus) => {
  try {
    await api.patch(`/collection-routes/${routeId}/update_status/`, {
      status: newStatus
    });
    const updatedRoutes = routes.map(route => 
      route.id === routeId ? {...route, status: newStatus} : route
    );
    setRoutes(updatedRoutes);
  } catch (error) {
    console.error('Status update failed:', error);
  }
};

  return (
    <DashboardWrapper>
      <Button 
        component={Link}
        to="/profile"
        variant="outlined"
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Edit Profile
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Assigned Routes"
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><DirectionsCar /></Avatar>}
            />
            <CardContent>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {routes.map(route => (
                    <ListItem key={route.id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      {getStatusActions(route.status).map((action) => (
                        <Button
                          key={action.status}
                          variant="outlined"
                          onClick={() => handleStatusUpdate(route.id, action.status)}
                          sx={{ ml: 1 }}
                        >
                          {action.label}
                        </Button>
                        ))} 
                      <ListItemText 
                        primary={`Route #${route.id}`}
                        secondary={`Status: ${route.status}`} 
                      />
                      <Button 
                        variant="outlined"
                        onClick={() => handleStatusUpdate(route.id, 'Completed')}
                      >
                        Mark Completed
                      </Button>
                  </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardWrapper>
  );
};
export default DriverDashboard;
