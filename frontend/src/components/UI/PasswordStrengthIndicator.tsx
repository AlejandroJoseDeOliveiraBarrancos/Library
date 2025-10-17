import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    const strength = Math.min(score, 6);
    const percentage = (strength / 6) * 100;

    if (strength <= 2) {
      feedback = 'Weak';
    } else if (strength <= 4) {
      feedback = 'Fair';
    } else if (strength <= 5) {
      feedback = 'Good';
    } else {
      feedback = 'Strong';
    }

    return { percentage, feedback, strength };
  };

  const { percentage, feedback, strength } = calculateStrength(password);

  if (!password) return null;

  const getColor = () => {
    if (strength <= 2) return 'error';
    if (strength <= 4) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={getColor()}
          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 50 }}>
          {feedback}
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordStrengthIndicator;
