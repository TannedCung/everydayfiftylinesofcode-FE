import * as React from 'react';
import { Box, Button, CssBaseline, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import MuiCard from '@mui/material/Card';
import { loginWithGitHub } from '../../services/authService';

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
    loginWithGitHub();
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
