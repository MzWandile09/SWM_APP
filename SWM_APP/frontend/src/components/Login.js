import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import MyTextField from './forms/MyTextFields';
import api from './Axios';


const Login = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/token/', { // Correct endpoint
        email: data.email,
        password: data.password
      });
  
      if (response.data.access) {
        await login({
          access: response.data.access,
          refresh: response.data.refresh
        });
        navigate('/dashboard'); // Correct navigation
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Login failed';
      alert(`Error: ${errorMsg}`);
    }
  };
  return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            minHeight: '100vh',
            p: 3,
            backgroundColor: '#f5f5f5'
        }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ 
                width: '100%', 
                maxWidth: 800,
                bgcolor: 'background.paper',
                p: 3,
                borderRadius: 2,
                boxShadow: 1
            }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Login
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <MyTextField 
                        label="Email"
                        name="email"
                        control={control}
                        rules={{ 
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        }}
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                    />
                    <MyTextField 
                        label="Password"
                        name="password"
                        type="password"
                        control={control}
                        rules={{ required: 'Password is required' }}
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                    />

                    <Button 
                        type="submit"
                        variant="contained" 
                        size="large"
                        sx={{ mt: 2, width: '100%' }}
                    >
                        Login
                    </Button>
                    
                    <Button 
                        variant="text" 
                        onClick={() => navigate('/create')}
                        sx={{ mt: 1 }}
                    >
                        Create New Account
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
