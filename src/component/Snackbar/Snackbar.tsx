import React from 'react';
import { Snackbar as MuiSnackbar, SnackbarContent } from '@mui/material';
import { SnackbarProps } from './types';

const Snackbar: React.FC<SnackbarProps> = ({ message, status, open, onClose }) => {
  const getBackgroundColor = () => {
    switch (status) {
      case 'success':
        return '#4caf50'; // Green
      case 'error':
        return '#f44336'; // Red
      case 'info':
        return '#2196f3'; // Blue
      case 'warning':
        return '#ff9800'; // Orange
      default:
        return '#333'; // Default color
    }
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <SnackbarContent
        style={{ backgroundColor: getBackgroundColor() }}
        message={message}
        action={
          <button onClick={onClose} style={{ color: 'white' }}>
            Close
          </button>
        }
      />
    </MuiSnackbar>
  );
};

export default Snackbar;