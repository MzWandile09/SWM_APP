import React, { useState, useEffect } from 'react';
import api from '../Axios';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Avatar,
  Button
} from '@mui/material';
import { Warning, DirectionsCar } from '@mui/icons-material';
import DashboardWrapper from '../DashboardWrapper';
import { Link } from 'react-router-dom';

const ClerkDashboard = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/hazardous-alerts/');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, []);

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
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Hazardous Waste Alerts"
              avatar={<Avatar sx={{ bgcolor: 'error.main' }}><Warning /></Avatar>}
            />
            <CardContent>
                {alerts.map(alert => (
                  <Chip
                    key={alert.report_id}
                    icon={<Warning />}
                    label={`${alert.waste_type} - (${alert.gps_lat}, ${alert.gps_lon})`}
                    sx={{ m: 1 }}
                    color="error"
                  />
                ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Route Optimization"
              avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><DirectionsCar /></Avatar>}
            />
            <CardContent>
              Route visualization content
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardWrapper>
  );
};

export default ClerkDashboard;