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

interface CreateChallengeData {
  name: string;
  type: 'commits' | 'lines_of_code';
  commitment_by: 'daily' | 'accumulate';
  description: string;
  target_value: number;
  frequency: number;
  start_date: string;
  end_date?: string | null;
  background_image?: File;
  logo?: File;
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

export const createChallenge = async (data: CreateChallengeData): Promise<Challenge> => {
  // Create FormData for file uploads
  const formData = new FormData();
  
  // Add all non-file fields
  Object.keys(data).forEach(key => {
    if (key !== 'background_image' && key !== 'logo') {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key].toString());
      }
    }
  });

  // Add file fields if present
  if (data.background_image) {
    formData.append('background_image', data.background_image);
  }
  if (data.logo) {
    formData.append('logo', data.logo);
  }

  const response = await axiosInstance.post('/api/challenge/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};