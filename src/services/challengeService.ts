// src/services/challengeService.ts
import axiosInstance from './axiosInstance';
import { Challenge } from '../types/challenge';

// src/services/challengeService.ts
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchChallenges = async (
  myChallenges?: boolean,
  page: number = 1
): Promise<PaginatedResponse<Challenge>> => {
  const response = await axiosInstance.get('/api/challenge/', {
    params: {
      my_challenges: myChallenges,
      page
    }
  });
  return response.data;
};
export const joinChallenge = async (challengeId: number) => {
  const response = await axiosInstance.post('/api/user_challenges/', {
    challenge: challengeId
  });
  return response.data;
};

export const fetchChallenge = async (id: number): Promise<Challenge> => {
  const response = await axiosInstance.get(`/api/challenge/${id}/`);
  return response.data;
};