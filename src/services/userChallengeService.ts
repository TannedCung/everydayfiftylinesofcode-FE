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
interface PaginatedUserChallenges {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserChallenge[];
}

export const fetchUserChallenges = async (challenge_id?: number): Promise<PaginatedUserChallenges> => {
  try {
    const response = await axiosInstance.get(`/api/challenge/${challenge_id}/member-stats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    throw error;
  }
};

export const fetchUserChallenge = async (id: number): Promise<UserChallenge> => {
  try {
    const response = await axiosInstance.get(`/api/challenge/${id}/member-stats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user challenge:', error);
    throw error;
  }
};

export const leaveChallenge = async (challengeId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/api/challenge/${challengeId}/leave/`);
  } catch (error) {
    console.error('Error leaving challenge:', error);
    throw error;
  }
};