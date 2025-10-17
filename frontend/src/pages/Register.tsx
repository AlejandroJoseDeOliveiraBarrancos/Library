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
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  validatePasswordConfirmation,
} from '@/utils/validation';
import PasswordStrengthIndicator from '@/components/UI/PasswordStrengthIndicator';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { user, register, loginWithGoogle } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [displayNameError, setDisplayNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateDisplayNameField = (value: string) => {
    const result = validateDisplayName(value);
    setDisplayNameError(result.isValid ? '' : result.message || '');
    return result.isValid;
  };

  const validateEmailField = (value: string) => {
    const result = validateEmail(value);
    setEmailError(result.isValid ? '' : result.message || '');
    return result.isValid;
  };

  const validatePasswordField = (value: string) => {
    const result = validatePassword(value);
    setPasswordError(result.isValid ? '' : result.message || '');
    return result.isValid;
  };

  const validateConfirmPasswordField = (value: string) => {
    const result = validatePasswordConfirmation(password, value);
    setConfirmPasswordError(result.isValid ? '' : result.message || '');
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    setDisplayNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const isDisplayNameValid = validateDisplayNameField(displayName);
    const isEmailValid = validateEmailField(email);
    const isPasswordValid = validatePasswordField(password);
    const isConfirmPasswordValid = validateConfirmPasswordField(confirmPassword);

    if (!isDisplayNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
      setError(err.message || 'Failed to sign up with Google');
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
          Create Account
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Join our library community
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (displayNameError) {
                validateDisplayNameField(e.target.value);
              }
            }}
            onBlur={() => validateDisplayNameField(displayName)}
            error={!!displayNameError}
            helperText={displayNameError}
            required
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 50 }}
          />
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
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) {
                validatePasswordField(e.target.value);
              }
              if (confirmPassword) {
                validateConfirmPasswordField(confirmPassword);
              }
            }}
            onBlur={() => validatePasswordField(password)}
            error={!!passwordError}
            helperText={passwordError}
            required
            sx={{ mb: 1 }}
            inputProps={{ maxLength: 128 }}
          />
          <PasswordStrengthIndicator password={password} />
          
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              Password Requirements:
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              • At least 8 characters long
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              • Contains uppercase and lowercase letters
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              • Contains at least one number
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              • Contains at least one special character
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) {
                validateConfirmPasswordField(e.target.value);
              }
            }}
            onBlur={() => validateConfirmPasswordField(confirmPassword)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
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
            Sign Up
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
            Already have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ cursor: 'pointer' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;

