import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import './App.css';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { theme } from './theme/customizations/index';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  return (
    <Router>
      <CssVarsProvider theme={theme} defaultMode="system">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AppRouter />
        </LocalizationProvider>
      </CssVarsProvider>
    </Router>
  );
}

export default App;