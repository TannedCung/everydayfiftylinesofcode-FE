import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { redirectUrl } from '../../services/authService'; // Your function to interact with the backend

const GitHubCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code'); // The 'code' parameter from the URL

    if (code) {
      // Call the backend to exchange the code for tokens
      redirectUrl(code)
        .then((data) => {

          // Store the tokens in localStorage (you could also use sessionStorage)
          localStorage.setItem('authTokens', JSON.stringify(data.tokens));
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect the user to the dashboard
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return <div>Loading...</div>; // You could show a loading spinner or message here
};

export default GitHubCallback;