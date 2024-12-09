// src/pages/ChallengeDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { fetchChallenge, joinChallenge } from '../../services/challengeService';
import { Challenge } from '../../types/challenge';

export const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true);
        const data = await fetchChallenge(Number(id));
        setChallenge(data);
      } catch (error) {
        setError('Failed to load challenge details');
      } finally {
        setLoading(false);
      }
    };
    loadChallenge();
  }, [id]);

  const handleJoinChallenge = async () => {
    try {
      await joinChallenge(Number(id));
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to join challenge');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!challenge) return <Alert severity="error">Challenge not found</Alert>;

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {challenge.name}
        </Typography>
        
        <Box>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <Typography>{challenge.description}</Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>Details</Typography>
          <Typography>Type: {challenge.type}</Typography>
          <Typography>Target: {challenge.target_value}</Typography>
          <Typography>Duration: {challenge.end_date}</Typography>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleJoinChallenge}
        >
          Join Challenge
        </Button>
      </Stack>
    </Paper>
  );
};