import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Link,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateEmailField = (value: string) => {
    const result = validateEmail(value);
    setEmailError(result.isValid ? '' : result.message || '');
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (!validateEmailField(email)) {
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 450,
          width: '100%',
        }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, textAlign: 'center' }}>
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Sign in to your library account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) {
                validateEmailField(e.target.value);
              }
            }}
            onBlur={() => validateEmailField(email)}
            error={!!emailError}
            helperText={emailError}
            required
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 254 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            inputProps={{ maxLength: 128 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Google />}
          onClick={handleGoogleLogin}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{ cursor: 'pointer' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

