import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Simulating an auth check (replace this with actual authentication logic)
const isAuthenticated = () => !!localStorage.getItem('authTokens');

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
