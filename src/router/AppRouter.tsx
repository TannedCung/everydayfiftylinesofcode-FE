import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import GitHubCallback from '../pages/login/githubCallback';
import Dashboard from '../pages/dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { ChallengesPage } from '../pages/challenge/Challenge';
import MainLayout from '../layouts/MainLayout';
import { ChallengeDetail } from '../pages/challenge/ChallengeDetail';
import { ClubPage } from '../pages/club/ClubPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/github/callback" element={<GitHubCallback />} />      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/clubs/" element={<ClubPage />} />

        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
