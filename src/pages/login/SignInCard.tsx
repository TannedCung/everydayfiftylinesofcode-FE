import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import MuiCard from '@mui/material/Card';
import { useNavigate } from 'react-router-dom'; // Updated import to use 'useNavigate'
import { redirectUrl } from '../../services/authService';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  maxWidth: '450px',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));


const SignInCard: React.FC = () => {  
  const handleGitHubLogin = () => {
    // Redirect user to GitHub OAuth login page
    const clientId = 'Ov23lipyEXKYHFMECXA3';
    const redirectUri = 'http://localhost:5173/github/callback'; // Your frontend callback URL
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

    // Redirect to GitHub for OAuth authorization
    window.location.href = githubAuthUrl;
  };

  return (
    <Card variant="outlined">
      <Typography component="h1" variant="h4" align="center">
        Sign in with GitHub
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGitHubLogin}
          startIcon={<GitHubIcon />}
        >
          Sign in with GitHub
        </Button>
      </Box>
    </Card>
  );
};

export default SignInCard;
