import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export interface ProgressDetail {
  date: string;
  total_commits: number;
  total_changes: number;
}

export interface Challenge {
  id: number;
  challenge: number;
  start_date: string;
  progress: number;
  progress_detail: ProgressDetail[] | Record<string, never>;
  highest_streak: number;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Challenge[];
}

export function useFetchChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<PaginatedResponse>('/api/challenge/my-participated/');
        const { results, count } = response.data;

        if (!Array.isArray(results) || results.length === 0) {
          throw new Error('No challenge data available');
        }

        setChallenges(results);
        setTotalCount(count);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching challenge data');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, totalCount, loading, error };
}