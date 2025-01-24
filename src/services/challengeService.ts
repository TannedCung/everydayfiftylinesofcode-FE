import axiosInstance from './axiosInstance';
import { Challenge } from '../types/challenge';

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
  const response = await axiosInstance.post(`/api/challenge/${challengeId}/join/`, {
  });
  return response.data;
};

export const fetchChallenge = async (id: number): Promise<Challenge> => {
  const response = await axiosInstance.get(`/api/challenge/${id}/`);
  return response.data;
};

export const createChallenge = async (formData: FormData): Promise<Challenge> => {
  const response = await axiosInstance.post('/api/challenge/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};