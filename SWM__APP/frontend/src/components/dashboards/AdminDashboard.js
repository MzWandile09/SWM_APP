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
} from '@mui/material';
import { People } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DashboardWrapper from '../DashboardWrapper';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenEditModal = async (user) => {
    setSelectedUser(user);
    try {
      const response = await api.get(`/users/${user.user_id}/`);
      setFormData(response.data);
      setEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/users/${selectedUser.user_id}/`, formData);
      const response = await api.get('/users/');
      setUsers(response.data);
      handleCloseEditModal();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update user: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}/`);
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete user: ' + (error.response?.data?.error || 'Server error'));
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
        <div>
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
        </div>
      )
    }
  ];

  return (
    <DashboardWrapper>
      <Box sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Admin Dashboard
          </Typography>
          <Button 
            variant="outlined"
            sx={{ minWidth: 130 }}
          >
            Edit Profile
          </Button>
        </Box>

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
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained"
                color="primary"
              >
                Create New User
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            {selectedUser ? (
              <>
                <TextField
                  margin="dense"
                  label="First Name"
                  fullWidth
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  fullWidth
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  fullWidth
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <TextField
                  margin="dense"
                  label="Phone"
                  fullWidth
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <TextField
                  margin="dense"
                  label="Role"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  value={formData.user_role || ''}
                  onChange={(e) => setFormData({...formData, user_role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </TextField>
              </>
            ) : (
              <CircularProgress />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal}>Cancel</Button>
            <Button onClick={handleUpdateUser} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardWrapper>
  );
};

export default AdminDashboard;