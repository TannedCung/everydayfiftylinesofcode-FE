// src/pages/ChallengeDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Stack,
  LinearProgress,
  Skeleton,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchChallenge, joinChallenge } from '../../services/challengeService';
import { useChallengeUsers } from '../../hooks/useChallengeUsers';
import { useSnackbar } from '../../hooks/useSnackbar';
import { Challenge } from '../../types/challenge';

const BackgroundWrapper = styled(Box)({
  height: '400px',
  width: '100%',
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: 0
});

const AvatarWrapper = styled(Box)({
  position: 'absolute',
  bottom: '-75px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1
});

export const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerSnackbar } = useSnackbar();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const { users, loading: usersLoading } = useChallengeUsers(Number(id));

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const data = await fetchChallenge(Number(id));
        setChallenge(data);
      } catch (error) {
        triggerSnackbar('Failed to load challenge details', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadChallenge();
  }, [id]);

  const handleJoinChallenge = async () => {
    try {
      await joinChallenge(Number(id));
      triggerSnackbar('Successfully joined challenge!', 'success');
      navigate('/dashboard');
    } catch (error) {
      triggerSnackbar('Failed to join challenge', 'error');
    }
  };

  if (loading || usersLoading) {
    return <Skeleton variant="rectangular" height={600} sx={{ width: '100%' }} />;
  }

  if (!challenge) return null;

  return (
    // <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Paper 
        elevation={3}
        sx={{ 
          width: '100%',
          borderRadius: 0,
          margin: 0,
          overflow: 'hidden'
        }}
      >
        <BackgroundWrapper
          sx={{ 
            backgroundImage: `url(${challenge.background_image})`,
            backgroundSize: 'cover'
          }}
        >
          <AvatarWrapper>
            <Avatar
              src={challenge.logo}
              sx={{
                width: 150,
                height: 150,
                border: '4px solid white',
                boxShadow: 3
              }}
            />
          </AvatarWrapper>
        </BackgroundWrapper>

        <Box 
          sx={{ 
            mt: 10,
            p: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Stack 
            spacing={4} 
            sx={{ 
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            <Stack 
              spacing={2} 
              alignItems="center" 
              sx={{ width: '100%' }}
            >
              <Typography variant="h4">{challenge.name}</Typography>
              <Typography 
                color="text.secondary" 
                textAlign="center"
                sx={{ maxWidth: '800px' }}
              >
                {challenge.description}
              </Typography>
              <Stack 
                direction="row" 
                spacing={2}
                flexWrap="wrap"
                justifyContent="center"
                sx={{ gap: 1 }}
              >
                <Chip label={`Type: ${challenge.type}`} />
                <Chip label={`Target: ${challenge.target_value}`} />
                <Chip label={`Frequency: ${challenge.frequency}`} />
              </Stack>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleJoinChallenge}
              >
                Join Challenge
              </Button>
            </Stack>

            <Divider />

            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Participants ({users.length})
              </Typography>
              <List sx={{ width: '100%' }}>
                {users.map((user) => (
                  <ListItem 
                    key={user.user_info.id}
                    sx={{ width: '100%' }}
                  >
                    <ListItemAvatar>
                      <Avatar>{user.user_info.username[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.user_info.username}
                      secondary={
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="body2">
                            Highest Streak: {user.challenge_progress.highest_streak}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={user.challenge_progress.progress}
                            sx={{ 
                              height: 8, 
                              borderRadius: 2, 
                              mt: 1,
                              width: '100%'
                            }}
                          />
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </Box>
      </Paper>
    // </Box>
  );
};