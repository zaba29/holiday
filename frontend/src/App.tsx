import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { JSX } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLeavePage } from './pages/AdminLeavePage';
import { AdminRegistrationPage } from './pages/AdminRegistrationPage';
import { AdminEmployeesPage } from './pages/AdminEmployeesPage';
import { useAuth } from './context/AuthContext';
import { SetupPage } from './pages/SetupPage';

const PrivateRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AdminLeavePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/registrations"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AdminRegistrationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AdminEmployeesPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);
