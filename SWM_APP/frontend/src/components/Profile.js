/*import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form'; // 🔺 Add Controller import
import { useNavigate } from 'react-router-dom';
import api from './Axios';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@mui/material';
import { useAuth } from './AuthContext';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if(user) {
      reset({
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone
      });
    }
  }, [user, reset]);

  const handleProfileUpdate = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch(`/users/${user.user_id}/`, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone
      });
      
      if(response.status === 200) {
        login({
          ...user,
          ...response.data,
        });
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/users/${user.user_id}/`);
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Deletion failed. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit(handleProfileUpdate)}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="First Name"
              error={!!errors.firstName}
              helperText={errors?.firstName?.message}
            />
          )}
          rules={{ required: 'First name is required' }}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Last Name"
              error={!!errors.lastName}
              helperText={errors?.lastName?.message}
            />
          )}
          rules={{ required: 'Last name is required' }}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Phone"
              error={!!errors.phone}
              helperText={errors?.phone?.message}
            />
          )}
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^\+?[0-9]{8,15}$/,
              message: 'Invalid phone number format'
            }
          }}
        />

        <Button 
          type="submit" 
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Profile'}
        </Button>

        <Box sx={{ mt: 4, borderTop: 1, borderColor: 'divider', pt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Danger Zone
          </Typography>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </Button>
        </Box>
      </form>

      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to permanently delete your account?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleAccountDelete}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Confirm Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Profile;
*/

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from './Axios';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@mui/material';
import { useAuth } from './AuthContext';

const Profile = () => {
  const { user, logout,refreshUserData  } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone
      });
    }
  }, [user, reset]);

  const handleProfileUpdate = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch(`/users/${user.user_id}/`, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone
      });
   
      if (response.status === 200) {
      /*  login({
          ...user,
          ...response.data,
        });*/
        await refreshUserData();
        setSuccess('Profile updated successfully!');
      
        // ✅ Redirect to dashboard after a short delay
        setTimeout(() => {
          setSuccess(null);
          navigate('/dashboard');
        }, 1000); // 1 second delay for UX feedback
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }

    const successRefresh = await refreshUserData(true);
if (!successRefresh) {
  setError('Profile updated, but failed to refresh user data.');
}

    
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/users/${user.user_id}/`);
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Deletion failed. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit(handleProfileUpdate)}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="First Name"
              error={!!errors.firstName}
              helperText={errors?.firstName?.message}
            />
          )}
          rules={{ required: 'First name is required' }}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Last Name"
              error={!!errors.lastName}
              helperText={errors?.lastName?.message}
            />
          )}
          rules={{ required: 'Last name is required' }}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Phone"
              error={!!errors.phone}
              helperText={errors?.phone?.message}
            />
          )}
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^\+?[0-9]{8,15}$/,
              message: 'Invalid phone number format'
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Profile'}
        </Button>

        <Box sx={{ mt: 4, borderTop: 1, borderColor: 'divider', pt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Danger Zone
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </Button>
        </Box>
      </form>

      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to permanently delete your account?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleAccountDelete}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Confirm Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Profile;
