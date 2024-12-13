// src/component/Snackbar/SnackbarProvider.tsx
import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarContext } from '../../hooks/useSnackbar';
import { SnackbarOptions, SnackbarStatus } from '../../types/snackbar';

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<SnackbarOptions>({
    status: 'info',
    duration: 6000
  });

  const showSnackbar = (options: { message: string; status: SnackbarStatus }) => {
    setMessage(options.message);
    setOptions({ status: options.status, duration: 6000 });
    setOpen(true);
  };

  const hideSnackbar = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar open={open} autoHideDuration={options.duration} onClose={hideSnackbar}>
        <Alert onClose={hideSnackbar} severity={options.status} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};