// src/services/clubService.ts
import axiosInstance from './axiosInstance';
import { Club } from '../types/club';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchClubs = async (myClubs?: boolean, page: number = 1): Promise<PaginatedResponse<Club>> => {
  const response = await axiosInstance.get('/api/club/', {
    params: {
      my_clubs: myClubs,
      page
    }
  });
  return response.data;
};

export const createClub = async (data: any): Promise<Club> => {
  const response = await axiosInstance.post('/api/club/', data);
  return response.data;
};