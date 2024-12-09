// src/services/challengeService.ts
import axiosInstance from './axiosInstance';
import { Challenge } from '../types/challenge';

export const fetchChallenges = async (): Promise<Challenge[]> => {
  const response = await axiosInstance.get('/api/challenge/');
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