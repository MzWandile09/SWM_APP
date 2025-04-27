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
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { People } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DashboardWrapper from '../DashboardWrapper';

const ROLE_OPTIONS = [
  { value: 'Admin', label: 'Administrator' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Clerk', label: 'Clerk' },
  { value: 'Driver', label: 'Driver' },
  { value: 'Resident', label: 'Regular User' }, // Changed from 'user'
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEditModal = async (user) => {
    try {
      const response = await api.get(`/users/${user.user_id}/`);
      setFormData(response.data);
      setSelectedUser(user);
      setEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load user details',
        severity: 'error',
      });
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleUpdateUser = async () => {
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setSnackbar({
          open: true,
          message: 'Invalid email format',
          severity: 'error',
        });
        return;
      }

      await api.patch(`/users/${selectedUser.user_id}/`, formData);
      await fetchUsers();
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success',
      });
      handleCloseEditModal();
    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({
        open: true,
        message: `Update failed: ${error.response?.data?.error || 'Server error'}`,
        severity: 'error',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${userId}/`);
      await fetchUsers();
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: `Deletion failed: ${error.response?.data?.error || 'Server error'}`,
        severity: 'error',
      });
    }
  };

  const columns = [
    { field: 'user_id', headerName: 'ID', width: 90 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'user_role', headerName: 'Role', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => handleOpenEditModal(params.row)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteUser(params.row.user_id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <DashboardWrapper>
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardHeader
                title="User Management"
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <People />
                  </Avatar>
                }
              />
              <CardContent>
                <Box sx={{ height: 500, width: '100%' }}>
                  <DataGrid
                    loading={loading}
                    rows={users}
                    getRowId={(row) => row.user_id}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent dividers>
            {selectedUser ? (
              <>
                <TextField
                  margin="dense"
                  label="First Name"
                  fullWidth
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  fullWidth
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  fullWidth
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Phone"
                  fullWidth
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Role"
                  fullWidth
                  select
                  value={formData.user_role || ''}
                  onChange={(e) => setFormData({ ...formData, user_role: e.target.value })}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal}>Cancel</Button>
            <Button onClick={handleUpdateUser} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardWrapper>
  );
};

export default AdminDashboard;
