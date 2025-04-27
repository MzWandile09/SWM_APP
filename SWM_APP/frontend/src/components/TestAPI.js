// src/components/TestAPI.js
import React, { useEffect } from 'react';
import api from './Axios';

const TestAPI = () => {
  useEffect(() => {
    const testEndpoint = async () => {
      try {
        const response = await api.get('/users/');
        console.log('API Response:', response.data);
      } catch (error) {
        console.error('API Error:', error.response);
      }
    };
    testEndpoint();
  }, []);

  return <div>Testing API Access...</div>;
};

export default TestAPI;
