// src/types/challenge.ts
export interface Challenge {
    id: number;
    name: string;
    description: string;
    type: 'commits' | 'lines_of_code';
    commitment_by: 'daily' | 'accumulate';
    frequency: number;
    target_value: number;
    start_date: string;
    end_date: string;
    background_image?: string;
    logo?: string;
  }