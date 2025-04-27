// src/components/dashboards/ResidentDashboard.js
import React from 'react';
import { Grid, Card, CardHeader, CardContent, Button, Avatar } from '@mui/material';
import { AddAlert, History } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // 👈 Add this line
import ReportWasteForm from '../forms/ReportWasteForm';
import DashboardWrapper from '../DashboardWrapper';

const ResidentDashboard = () => {
  return (
    <DashboardWrapper>
      {/* 👇 Edit Profile button added */}
      <Button 
        component={Link}
        to="/profile"
        variant="outlined"
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Edit Profile
      </Button>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Quick Actions"
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><AddAlert /></Avatar>}
            />
            <CardContent>
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<AddAlert />}
                sx={{ mb: 2 }}
              >
                Report New Waste
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<History />}
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Waste Reporting Form */}
        <Grid item xs={12} md={8}>
          <ReportWasteForm />
        </Grid>

        {/* Current Reports */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Your Current Reports"
              subheader="Last 30 days"
            />
            {/* Table component would go here */}
          </Card>
        </Grid>
      </Grid>
    </DashboardWrapper>
  );
};

export default ResidentDashboard;
