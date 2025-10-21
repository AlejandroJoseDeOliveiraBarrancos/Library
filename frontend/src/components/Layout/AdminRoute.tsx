import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setCheckingAdmin(false);
      return;
    }

    try {
      setCheckingAdmin(true);
      setError(null);
      
      if (user.email === 'olvunnamed@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err: any) {
      setError('Failed to verify admin status');
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (loading || checkingAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Box>Verifying admin access...</Box>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={checkAdminStatus}>
          Retry
        </Button>
      </Box>
    );
  }

  if (isAdmin === false) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
          Access denied. Admin privileges required.
        </Alert>
        <Button variant="contained" href="/">
          Go Home
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
