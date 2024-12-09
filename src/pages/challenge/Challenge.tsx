// Challenge.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert, Container } from '@mui/material';
import { fetchChallenges } from '../../services/challengeService';
import { fetchUserChallenges, joinChallenge } from '../../services/userChallengeService';
import { Challenge } from '../../types/challenge';
import { styled } from '@mui/material/styles';
import { ChallengeCard } from '../../component/ChallengeCard';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ChallengesPage: React.FC = () => {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningChallenge, setJoiningChallenge] = useState(false);

  const handleJoinChallenge = async (challengeId: number) => {
    try {
      setJoiningChallenge(true);
      await joinChallenge(challengeId);
      
      // Update challenge lists after joining
      const joinedChallenge = availableChallenges.find(c => c.id === challengeId);
      if (joinedChallenge) {
        setJoinedChallenges([...joinedChallenges, joinedChallenge]);
        setAvailableChallenges(availableChallenges.filter(c => c.id !== challengeId));
      }
    } catch (error) {
      setError('Failed to join challenge');
    } finally {
      setJoiningChallenge(false);
    }
  };

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoading(true);
        const [allChallenges, userChallenges] = await Promise.all([
          fetchChallenges(),
          fetchUserChallenges()
        ]);
        
        const joinedIds = new Set(userChallenges.map(c => c.id));
        setJoinedChallenges(userChallenges);
        setAvailableChallenges(allChallenges.filter(c => !joinedIds.has(c.id)));
        
      } catch (error) {
        setError('Failed to load challenges');
      } finally {
        setLoading(false);
      }
    };
    loadChallenges();
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Your Challenges Section */}
          <Box mb={6}>
            <Header>
              <Typography variant="h4" component="h1" gutterBottom>
                Your Challenges
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Track your ongoing challenges
              </Typography>
            </Header>
            <Grid container spacing={3}>
              {joinedChallenges.map((challenge) => (
                <Grid item key={challenge.id} xs={12} sm={6} md={4}>
                  <ChallengeCard
                    challenge={challenge}
                    isJoined={true}
                    onJoin={() => {}}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Available Challenges Section */}
          <Box>
            <Header>
              <Typography variant="h4" component="h1" gutterBottom>
                Available Challenges
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Join a new challenge and start your coding journey
              </Typography>
            </Header>
            <Grid container spacing={3}>
              {availableChallenges.map((challenge) => (
                <Grid item key={challenge.id} xs={12} sm={6} md={4}>
                  <ChallengeCard
                    challenge={challenge}
                    isJoined={false}
                    onJoin={handleJoinChallenge}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </StyledContainer>
  );
};