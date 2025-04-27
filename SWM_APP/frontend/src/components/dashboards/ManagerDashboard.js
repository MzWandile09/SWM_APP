import React, { useState, useEffect } from 'react';
import api from '../Axios';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { 
  Analytics, 
  Map, 
  Timeline, 
  People, 
  Edit,
  Report,
  ListAlt,
  FilterList
} from '@mui/icons-material';
import { PieChart, LineChart } from '@mui/x-charts';
import { DataGrid } from '@mui/x-data-grid';
import DashboardWrapper from '../DashboardWrapper';
import { useTheme } from '@mui/material/styles';

const ManagerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [managerData, setManagerData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [reportType, setReportType] = useState('waste');
  const [timeRange, setTimeRange] = useState('monthly');
  const [userFilter, setUserFilter] = useState('all');

  // Tabs configuration
  const tabs = [
    { label: 'Overview', icon: <Analytics /> },
    { label: 'Reports', icon: <Report /> },
    { label: 'User Management', icon: <People /> },
    { label: 'Operations', icon: <ListAlt /> }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileResponse, usersResponse] = await Promise.all([
          api.get('/users/me/'),
          api.get('/users/')
        ]);
        
        setManagerData(profileResponse.data);
        setFormData(profileResponse.data);
        
        // Validate and format user data
        const validatedUsers = usersResponse.data.map(user => ({
          ...user,
          first_name: user.first_name || 'Unknown',
          last_name: user.last_name || 'User',
          user_id: user.user_id || Math.random().toString(36).substr(2, 9),
          email: user.email || 'No email',
          phone: user.phone || 'No phone',
          user_role: user.user_role || 'Unknown'
        }));
        
        setUsers(validatedUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load data',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await api.patch(`/users/${managerData.user_id}/`, formData);
      setManagerData(response.data);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      setEditModalOpen(false);
    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({
        open: true,
        message: `Update failed: ${error.response?.data?.error || 'Server error'}`,
        severity: 'error',
      });
    }
  };

  // Enhanced DataGrid columns for User Management
  const userColumns = [
    { 
      field: 'fullName', 
      headerName: 'Name', 
      flex: 1,
      valueGetter: (params) => {
        if (!params?.row) return 'Unknown User';
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`.trim() || 'Unknown User';
      }
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1.5,
      valueGetter: (params) => params?.row?.email || 'No email'
    },
    { 
      field: 'user_role', 
      headerName: 'Role', 
      flex: 0.5,
      valueGetter: (params) => params?.row?.user_role || 'Unknown'
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 1,
      valueGetter: (params) => params?.row?.phone || 'No phone'
    }
  ];

  // Metric card component
  const MetricCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', bgcolor: `${color}.light` }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: `${color}.main` }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" color="text.primary">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Filter users based on role selection
  const filteredUsers = userFilter === 'all' 
    ? users 
    : users.filter(user => user.user_role === userFilter);

  return (
    <DashboardWrapper>
      <Box sx={{ px: { xs: 1, md: 3 }, py: 2 }}>
        {/* Navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          {isMobile ? (
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                inputProps={{ 'aria-label': 'Dashboard sections' }}
              >
                {tabs.map((tab, index) => (
                  <MenuItem key={tab.label} value={index}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {tab.icon}
                      {tab.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab) => (
                <Tab 
                  key={tab.label} 
                  label={tab.label} 
                  icon={tab.icon} 
                  iconPosition="start" 
                />
              ))}
            </Tabs>
          )}
          
          <IconButton
            onClick={() => setEditModalOpen(true)}
            color="primary"
            sx={{ ml: 2 }}
          >
            <Edit />
          </IconButton>
        </Box>

        {/* Dashboard Content */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress size={80} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Total Waste Collected"
                    value="2,450 kg"
                    icon={<Analytics />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Recycling Rate"
                    value="68%"
                    icon={<Timeline />}
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Active Users"
                    value={users.length}
                    icon={<People />}
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Hazardous Cases"
                    value="24"
                    icon={<Map />}
                    color="warning"
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card>
                    <CardHeader
                      title="Waste Collection Trends"
                      action={
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Time Range</InputLabel>
                          <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            label="Time Range"
                          >
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                          </Select>
                        </FormControl>
                      }
                    />
                    <CardContent sx={{ height: 400 }}>
                      <LineChart
                        series={[
                          {
                            data: [2450, 2100, 2650, 2400, 2800, 3000, 3200],
                            label: 'Waste Collected (kg)',
                          },
                        ]}
                        xAxis={[{ scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }]}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader title="Waste Composition" />
                    <CardContent>
                      <PieChart
                        series={[{
                          data: [
                            { id: 0, value: 35, label: 'Organic' },
                            { id: 1, value: 25, label: 'Recyclables' },
                            { id: 2, value: 20, label: 'Hazardous' },
                            { id: 3, value: 20, label: 'Other' }
                          ],
                        }]}
                        width={400}
                        height={300}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Reports Tab */}
            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      title="Generate Reports"
                      action={
                        <Box display="flex" gap={2}>
                          <FormControl size="small">
                            <InputLabel>Report Type</InputLabel>
                            <Select
                              value={reportType}
                              onChange={(e) => setReportType(e.target.value)}
                              label="Report Type"
                            >
                              <MenuItem value="waste">Waste Distribution</MenuItem>
                              <MenuItem value="recycling">Recycling Trends</MenuItem>
                              <MenuItem value="hazardous">Hazardous Cases</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              value={timeRange}
                              onChange={(e) => setTimeRange(e.target.value)}
                            >
                              <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      }
                    />
                    <CardContent sx={{ height: 500 }}>
                      {reportType === 'waste' && (
                        <Box component="img" 
                          src="/path-to-waste-map.png" 
                          alt="Waste Distribution Map"
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                      {reportType === 'recycling' && (
                        <LineChart
                          series={[
                            {
                              data: [65, 59, 80, 81, 56, 55, 40],
                              label: 'Recycling Rate (%)',
                            },
                          ]}
                          xAxis={[{ scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }]}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* User Management Tab */}
            <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
              <Card>
                <CardHeader
                  title="User Directory"
                  action={
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Filter by Role</InputLabel>
                      <Select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        label="Filter by Role"
                      >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="Resident">Resident</MenuItem>
                        <MenuItem value="Driver">Driver</MenuItem>
                        <MenuItem value="Clerk">Clerk</MenuItem>
                      </Select>
                    </FormControl>
                  }
                />
                <CardContent>
                  <Box sx={{ height: 600 }}>
                    <DataGrid
                      rows={filteredUsers}
                      columns={userColumns}
                      pageSizeOptions={[5, 10, 25]}
                      disableRowSelectionOnClick
                      initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                      }}
                      slots={{ toolbar: FilterList }}
                      getRowId={(row) => row.user_id}
                      loading={loading}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </>
        )}

        {/* Profile Edit Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent dividers>
            {managerData ? (
              <>
                <TextField
                  margin="normal"
                  label="First Name"
                  fullWidth
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                <TextField
                  margin="normal"
                  label="Last Name"
                  fullWidth
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
                <TextField
                  margin="normal"
                  label="Email"
                  fullWidth
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                  margin="normal"
                  label="Phone"
                  fullWidth
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </>
            ) : (
              <CircularProgress />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProfile} color="primary" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardWrapper>
  );
};

export default ManagerDashboard;