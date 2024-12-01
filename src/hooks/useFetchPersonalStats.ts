import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

// Define or import types
interface ActivityStreak {
  currentStreak: number;
  longestStreak: number;
}

interface DailyGoalProgress {
  progress: number;
  dailyGoal: number;
  today: number;
}

interface PersonalStats {
  activityStreak: ActivityStreak;
  dailyGoalProgress: DailyGoalProgress;
}

export const usePersonalStats = () => {
  const [stats, setStats] = useState<PersonalStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch the personal stats using axiosInstance
        const activityResponse = await axiosInstance.get('/api/github/commits/activity-streak');
        const goalResponse = await axiosInstance.get('/api/github/commits/daily-goal-progress');

        // Check if the responses are valid
        if (!activityResponse.data || !goalResponse.data) {
          throw new Error('Error fetching personal stats');
        }

        const activityStreak: ActivityStreak = {
          currentStreak: activityResponse.data.current_streak,  // Map current_streak to currentStreak
          longestStreak: activityResponse.data.longest_streak,  // Map longest_streak to longestStreak
        };

        // Map the data to the appropriate format
        const dailyGoalProgress = goalResponse.data;

        // Set the stats state
        setStats({
          activityStreak,
          dailyGoalProgress,
        })
      } catch (err) {
        setError('Failed to fetch personal stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
