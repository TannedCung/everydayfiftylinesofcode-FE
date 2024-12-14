// src/hooks/useChallengeUsers.ts
import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useSnackbar } from './useSnackbar';
import { ChallengeUser, ApiResponse } from '../types/challenge';

export const useChallengeUsers = (challengeId: number) => {
  const [users, setUsers] = useState<ChallengeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { triggerSnackbar } = useSnackbar();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ApiResponse>(`/api/challenge/${challengeId}/users/`);
      setUsers(response.data.results);
      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to fetch challenge users';
      setError(errorMessage);
      triggerSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (challengeId) {
      fetchUsers();
    }
  }, [challengeId]);

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch
  };
};