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
    isJoined?: boolean;
  }

export interface UserInfo {
  id: number;
  username: string;
}

export interface ChallengeProgress {
  start_date: string;
  highest_streak: number;
  progress: number;
}

export interface ProgressDetail {
  date: string;
  total_commits: number;
  total_changes: number;
}

export interface ChallengeUser {
  user_info: UserInfo;
  challenge_progress: ChallengeProgress;
  progress_detail: ProgressDetail[];
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChallengeUser[];
}