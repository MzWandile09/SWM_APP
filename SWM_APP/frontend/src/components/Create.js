// src/components/Create.js
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import MyTextField from './forms/MyTextFields';
import MySelectField from './forms/MySelectField';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from './Axios';
import { useAuth } from './AuthContext';

const Create = () => {
    const navigate = useNavigate();
    const defaultValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',  // Changed from phone_number
        password: '',
        user_role: ''
    };

    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    // Add state
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await api.post('/users/', {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email.toLowerCase().trim(),
                phone: data.phone.replace(/\D/g, ''),
                password: data.password,
                user_role: data.user_role
            });
    
            if (response.status === 201) {
                alert('User created successfully!');
                navigate('/admin-dashboard');  // ✅ Send Admin back to dashboard

            }
        } catch (error) {
            const errorDetails = error.response?.data || {};
            const errorMessages = Object.entries(errorDetails)
                .flatMap(([field, errors]) => 
                    Array.isArray(errors) 
                        ? errors.map(msg => `${field}: ${msg}`)
                        : `${field}: ${errors}`
                )
                .join('\n');
                
            alert(`Creation failed:\n${errorMessages || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const { user } = useAuth();
    const roles = user?.user_role === 'Admin'
    ? [
        { value: 'Resident', label: 'Resident' },
        { value: 'Clerk', label: 'Clerk' },
        { value: 'Driver', label: 'Driver' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Admin', label: 'Admin' },
      ]
    : [
        { value: 'Resident', label: 'Resident' },
        ];

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
                    Create New User
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <MyTextField 
                        label="First Name"
                        name="first_name"
                        control={control}
                        rules={{ required: 'First name is required' }}
                        error={!!errors.first_name}
                        helperText={errors?.first_name?.message}
                    />
                    <MyTextField 
                        label="Last Name"
                        name="last_name"
                        control={control}
                        rules={{ required: 'Last name is required' }}
                        error={!!errors.last_name}
                        helperText={errors?.last_name?.message}
                    />
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
                    label="Phone Number"
                    name="phone"
                    control={control}
                    rules={{ 
                        required: 'Phone number is required',
                        pattern: {
                        value: /^(\+?[0-9]{8,15}|[0-9]{8,15})$/,
                        message: 'Invalid phone number format'
                        }
                    }}
                    render={({ field }) => (
                        <input
                            {...field}
                            onChange={(e) => {
                                const formatted = e.target.value.replace(/\D/g, '');
                                field.onChange(formatted);
                            }}
                        />
                    )}
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

                    {/* Pass roles dynamically */}
                    <MySelectField 
                        label="User Role"
                        name="user_role"
                        control={control}
                        options={roles}
                        rules={{ required: 'User role is required' }}
                        error={!!errors.user_role}
                        helperText={errors?.user_role?.message}
                    />

                    <Button 
                        type="submit"
                        variant="contained" 
                        disabled={loading}
                        sx={{ mt: 2, width: '100%' }}
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </Button>

                </Box>
            </Box>
        </Box>
    );
};

export default Create;
