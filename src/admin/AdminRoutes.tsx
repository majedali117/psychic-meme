import React from 'react';
// FIXED: Removed BrowserRouter. Routes are now managed by the parent App.tsx.
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import DashboardManagementPage from './pages/DashboardManagementPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MissionsPage from './pages/MissionsPage';
import ProtocolsPage from './pages/ProtocolsPage';
import MentorsPage from './pages/MentorsPage';
import SettingsPage from './pages/SettingsPage'; // Placeholder for settings
import CareerFieldsPage from './pages/CareerFieldsPage';

const AdminRoutes: React.FC = () => {
  return (
    // AuthProvider now correctly wraps all routes without a conflicting router.
    <AuthProvider>
      <Routes>
        {/* All paths here are relative to "/admin" */}
        <Route path="login" element={<LoginPage />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="mentors" element={<MentorsPage />} />
          <Route path="missions" element={<MissionsPage />} />
          <Route path="protocols" element={<ProtocolsPage />} />
          <Route path="dashboards" element={<DashboardManagementPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="career-fields" element={<CareerFieldsPage />} />
          {/* This correctly redirects from any invalid /admin/path to /admin/ */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default AdminRoutes;