// src/services/userChallengeService.ts
import axiosInstance from './axiosInstance';

export interface UserChallenge {
  id: number;
  user: number;
  challenge: number;
  start_date: string;
  highest_streak: number;
  progress: number;
  progress_detail: Record<string, any>;
}

export const fetchUserChallenges = async (): Promise<UserChallenge[]> => {
  try {
    const response = await axiosInstance.get('/api/user_challenges/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    throw error;
  }
};

export const joinChallenge = async (challengeId: number): Promise<UserChallenge> => {
  try {
    const response = await axiosInstance.post('/api/user_challenges/', {
      challenge: challengeId,
    });
    return response.data;
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};