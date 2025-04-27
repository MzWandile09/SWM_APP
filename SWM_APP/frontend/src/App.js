import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme';
import NavBar from './components/NavBar'; // ✅ re-added

// Pages
import Home from './components/Home';
import About from './components/About';
import Create from './components/Create';
import Login from './components/Login';
import Unauthorized from './components/Unauthorized';
import Profile from './components/Profile';
import Collections from './components/Collections';
import RoleBasedDashboard from './components/RoleBasedDashboard';

// Dashboards
import AdminDashboard from './components/dashboards/AdminDashboard';
import ClerkDashboard from './components/dashboards/ClerkDashboard';
import DriverDashboard from './components/dashboards/DriverDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import ResidentDashboard from './components/dashboards/ResidentDashboard';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {/* ✅ Always show NavBar (for authenticated users) */}
        <NavBar />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/about" element={<About />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<RoleBasedDashboard />} />
            <Route path="/profile" element={<Profile />} />

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Clerk']} />}>
              <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
              <Route path="/collections" element={<Collections />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Driver']} />}>
              <Route path="/driver-dashboard" element={<DriverDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route path="/collections" element={<Collections />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Resident']} />}>
              <Route path="/resident-dashboard" element={<ResidentDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
