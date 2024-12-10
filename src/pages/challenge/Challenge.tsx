// Challenge.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert, Container, Pagination } from '@mui/material';
import { fetchChallenges } from '../../services/challengeService';
import { Challenge } from '../../types/challenge';
import { styled } from '@mui/material/styles';
import { ChallengeCard } from '../../component/ChallengeCard';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Challenge[];
}

interface ChallengeState extends PaginatedResponse {
  page: number;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ChallengesPage: React.FC = () => {
  const [myChallenges, setMyChallenges] = useState<ChallengeState>({
    results: [],
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  
  const [availableChallenges, setAvailableChallenges] = useState<ChallengeState>({
    results: [],
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  
  const [loading, setLoading] = useState({
    myChallenges: false,
    availableChallenges: false
  });
  
  const [error, setError] = useState<string | null>(null);

  const loadChallenges = async (isMyChallenges: boolean, page: number = 1) => {
    const loadingKey = isMyChallenges ? 'myChallenges' : 'availableChallenges';
    const setterFunction = isMyChallenges ? setMyChallenges : setAvailableChallenges;

    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      const response = await fetchChallenges(isMyChallenges, page);
      
      setterFunction({
        ...response,
        page,
      });
    } catch (error) {
      setError(`Failed to load ${isMyChallenges ? 'your' : 'available'} challenges`);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  useEffect(() => {
    loadChallenges(true);
    loadChallenges(false);
  }, []);

  const renderChallengeSection = (
    title: string,
    subtitle: string,
    data: ChallengeState,
    isLoading: boolean,
    onPageChange: (page: number) => void
  ) => (
    <Box mb={6}>
      <Header>
        <Typography variant="h4" component="h1" gutterBottom>{title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">{subtitle}</Typography>
      </Header>
      
      {isLoading && data.page === 1 ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {data.results.map((challenge) => (
              <Grid 
                item 
                key={challenge.id}
                sx={{
                  width: '320px', // Fixed width for card
                  maxWidth: '100%', // Ensures responsiveness on very small screens
                  flexGrow: 0, // Prevents growing beyond fixed width
                  margin: '0 auto', // Centers items if not filling row
                }}
              >
                <ChallengeCard
                  challenge={challenge}
                  isJoined={title === 'Your Challenges'}
                  onJoin={() => {}}
                />
              </Grid>
            ))}
          </Grid>
          
          {data.count > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(data.count / 9)}
                page={data.page}
                onChange={(_e, page) => onPageChange(page)}
                disabled={isLoading}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );

  return (
    <StyledContainer maxWidth="lg">
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      
      {renderChallengeSection(
        'Your Challenges',
        'Track your ongoing challenges',
        myChallenges,
        loading.myChallenges,
        (page) => loadChallenges(true, page)
      )}
      
      {renderChallengeSection(
        'Available Challenges',
        'Join a new challenge and start your coding journey',
        availableChallenges,
        loading.availableChallenges,
        (page) => loadChallenges(false, page)
      )}
    </StyledContainer>
  );
};