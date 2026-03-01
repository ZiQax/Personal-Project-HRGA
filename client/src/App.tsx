import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MobilityList from './pages/MobilityList';
import LeaveList from './pages/LeaveList';
import EmployeeList from './pages/EmployeeList';
import OrgManagement from './pages/OrgManagement';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';
import Validator from './pages/Validator';
import NotificationToast from './components/NotificationToast';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mobility" 
          element={
            <ProtectedRoute>
              <MobilityList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leave" 
          element={
            <ProtectedRoute>
              <LeaveList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employees" 
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/organization" 
          element={
            <ProtectedRoute>
              <OrgManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logs" 
          element={
            <ProtectedRoute>
              <ActivityLogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/validator" 
          element={
            <ProtectedRoute>
              <Validator />
            </ProtectedRoute>
          } 
        />
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <NotificationToast />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
