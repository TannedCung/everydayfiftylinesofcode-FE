// src/services/clubService.ts
import axiosInstance from './axiosInstance';
import { Club } from '../types/club';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchClubs = async (): Promise<PaginatedResponse<Club>> => {
  const response = await axiosInstance.get('/api/club/');
  return response.data;
};

export const createClub = async (data: any): Promise<Club> => {
  const response = await axiosInstance.post('/api/club/', data);
  return response.data;
};