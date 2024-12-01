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
  progress_detail: ProgressDetail[];
  highest_streak: number;
}

export function useFetchChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]); // Stores all challenges from the BE
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Challenge[]>('/api/user_challenges'); // API returns an array of Challenge
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No challenge data available');
        }

        console.log('Fetched challenges: ', data); // Debug log
        setChallenges(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching challenge data');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, loading, error };
}
