// src/components/Axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ensure this matches your backend
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});


// Automatically add access token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token if expired
// Update the response interceptor to handle refresh loops
/*api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await api.post('/token/refresh/', { refresh: refreshToken });
        
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other 401 cases (like expired refresh token)
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);*/

// src/components/Axios.js
/*
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.post('/token/refresh/', { refresh: refreshToken });
        
        // Store BOTH new tokens
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh); // This was missing
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);*/


// Request Interceptor – Adds the access token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor – Handles token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // ✅ Don't retry refresh if:
    // 1. We're already retrying
    // 2. We're hitting the refresh endpoint itself
    const isUnauthorized = error.response?.status === 401;
    const isNotRetrying = !originalRequest._retry;
    const isNotRefreshEndpoint = !originalRequest.url.includes('/token/refresh/');

    if (isUnauthorized && isNotRetrying && isNotRefreshEndpoint) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post('/api/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // Update headers and retry the original request
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('🔁 Refresh failed:', refreshError);

        // ✅ Log out on refresh failure to avoid infinite loop
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // or handle logout

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// API helpers
export const wasteApi = {
  getAll: () => api.get('/waste-reports/'),
  create: (data) => {
    const formData = new FormData();
    formData.append('photo', data.photo);
    formData.append('lat', data.lat);
    formData.append('lon', data.lon);
    formData.append('description', data.description);
    formData.append('waste_type', data.waste_type);
    return api.post('/waste-reports/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, data) => api.patch(`/waste-reports/${id}/`, data),
  delete: (id) => api.delete(`/waste-reports/${id}/`)
};

export const userApi = {
  getAll: () => api.get('/users/'),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.patch(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`)
};

// Login handler
export const handleLogin = async (email, password) => {
  try {
    const response = await api.post('/token/', { email, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
