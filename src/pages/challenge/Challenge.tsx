// src/pages/ChallengesPage.tsx
import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChallengeCard } from '../../component/ChallengeCard';
import { fetchChallenges, joinChallenge } from '../../services/challengeService';
import { Challenge } from '../../types/challenge';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoading(true);
        const data = await fetchChallenges();
        setChallenges(data);
        setError(null);
      } catch (error) {
        console.error('Failed to load challenges:', error);
        setError('Failed to load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadChallenges();
  }, []);

  const handleJoinChallenge = async (challengeId: number) => {
    try {
      await joinChallenge(challengeId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to join challenge:', error);
      setError('Failed to join challenge. Please try again.');
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <Header>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Challenges
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Join a challenge and start your coding journey
        </Typography>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {challenges.map((challenge) => (
            <Grid item key={challenge.id} xs={12} sm={6} md={4}>
              <ChallengeCard
                challenge={challenge}
                onJoin={handleJoinChallenge}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </StyledContainer>
  );
};

export default ChallengesPage;