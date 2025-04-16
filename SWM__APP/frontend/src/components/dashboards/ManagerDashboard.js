// src/components/dashboards/ManagerDashboard.js 
// Install:
// npm install @mui/x-charts

import React from 'react';
import { Grid, Card, CardHeader, CardContent, Avatar, Button } from '@mui/material';
import { Analytics, Map, Timeline } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // 👈 Import Link
import DashboardWrapper from '../DashboardWrapper';
import { PieChart } from '@mui/x-charts';

// MetricCard component to display each metric
const MetricCard = ({ title, value }) => (
  <Card>
    <CardContent>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <h3>{title}</h3>
        </Grid>
        <Grid item>
          <h4>{value}</h4>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const ManagerDashboard = () => {
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

      <Grid container spacing={{ xs: 1, md: 3 }}>
        {/* Key Metrics */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <MetricCard title="Total Waste" value="245t" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <MetricCard title="Recycled" value="68%" />
        </Grid>

        {/* Waste Heatmap */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Waste Distribution Heatmap"
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><Map /></Avatar>}
            />
            <CardContent>
              <div style={{
                height: 300,
                backgroundColor: '#f0f0f0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                Heatmap Placeholder
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics (PieChart) */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Performance Metrics"
              avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><Analytics /></Avatar>}
            />
            <CardContent>
            <PieChart
  series={[
    {
      data: [
        { id: 0, value: 60, label: 'Recycled' },
        { id: 1, value: 40, label: 'General Waste' }
      ],
    },
  ]}
  width={400}
  height={300}
  sx={{ 
    width: '100%', 
    height: 'auto',
    maxWidth: 500 
  }}
/>

            </CardContent>
          </Card>
        </Grid>

        {/* Trend Analysis - LineChart Placeholder */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Waste Trends Over Time"
              avatar={<Avatar sx={{ bgcolor: 'success.main' }}><Timeline /></Avatar>}
            />
            <CardContent>
              <div style={{
                height: 300,
                backgroundColor: '#f0f0f0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                LineChart Placeholder
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardWrapper>
  );
};

export default ManagerDashboard;
