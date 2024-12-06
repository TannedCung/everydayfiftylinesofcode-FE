// githubCallback.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { redirectUrl } from '../../services/authService';
import { User } from '../../types/user';

const GitHubCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      redirectUrl(code)
        .then((data) => {
          const { tokens, user } = data;
          
          // Ensure user data includes avatar_url
          const userData: User = {
            ...user,
            avatar_url: user.avatar_url || '' // GitHub avatar URL
          };

          localStorage.setItem('authTokens', JSON.stringify(tokens));
          localStorage.setItem('user', JSON.stringify(userData));

          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('GitHub authentication error:', error);
          // navigate('/');
        });
    }
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default GitHubCallback;