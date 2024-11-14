import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:19981/'; // Adjust base URL as needed

/**
 * Initiates GitHub OAuth login by redirecting the user to the backend OAuth URL.
 */
export const loginWithGitHub = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/accounts/github/login/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Redirect user to the GitHub OAuth URL returned by the backend
    window.location.href = response.data.redirect_url;
  } catch (error) {
    console.error('Error initiating GitHub OAuth:', error);
  }
};
