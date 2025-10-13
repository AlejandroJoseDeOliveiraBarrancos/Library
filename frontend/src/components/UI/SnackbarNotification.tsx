import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface SnackbarNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  autoHideDuration?: number;
}

const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({
  open,
  onClose,
  message,
  severity,
  title,
  autoHideDuration = 6000,
}) => {
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          backgroundColor: 'background.paper',
          color: 'text.primary',
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
