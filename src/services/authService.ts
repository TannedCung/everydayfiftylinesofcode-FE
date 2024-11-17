import axios from 'axios';

const API_BASE_URL = 'http://localhost:19981'; // Update with your backend URL

/**
 * Fetch tokens by calling the backend's GitHub callback endpoint.
 * @param {string} code - Authorization code received from GitHub.
 * @returns {Promise<object>} Tokens and user info.
 */
export const redirectUrl = async (code: string): Promise<{ tokens: any; user: any }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/accounts/github/callback/`, {
      params: { code },
    });
    return response.data; // Tokens and user info
  } catch (error: any) {
    console.error('Error fetching tokens from backend:', error.response?.data || error.message);
    throw error;
  }
};
