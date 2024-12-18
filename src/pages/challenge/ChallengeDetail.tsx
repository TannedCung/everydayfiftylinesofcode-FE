// ChallengeDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Box, Avatar, Typography, Button, Divider,
  List, ListItem, ListItemAvatar, ListItemText,
  LinearProgress, Grid, Stack, Tooltip
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { fetchChallenge, joinChallenge } from '../../services/challengeService';
import { Challenge } from '../../types/challenge';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useChallengeUsers } from '../../hooks/useChallengeUsers';
import { styled } from '@mui/material/styles';
import { format, differenceInDays, isAfter } from 'date-fns';
import { 
  Flag,
  CategoryRounded,
  DateRange 
} from '@mui/icons-material';
import { fetchUserChallenges } from '../../services/userChallengeService';

const getChallengeGoalText = (challenge: Challenge): string => {
  const getDurationText = () => {
    if (!challenge.end_date) return 'unlimited time';
    const days = differenceInDays(new Date(challenge.end_date), new Date(challenge.start_date));
    return `${days} days`;
  };

  if (challenge.commitment_by === 'daily') {
    return `Do ${challenge.frequency} ${challenge.type} every day in ${getDurationText()}`;
  }
  
  if (challenge.target_value > 0) {
    return `Achieve ${challenge.target_value} ${challenge.type} in ${getDurationText()}`;
  }
  
  return `Do as many ${challenge.type} as possible in ${getDurationText()}`;
};

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
  const [isJoined, setIsJoined] = useState<boolean>(false);

  console.log(challenge);
  console.log(id);

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
    
    const checkJoinStatus = async () => {
      try {
        const response = await fetchUserChallenges(Number(id));
        const hasJoined = response.count > 0 || (Array.isArray(response.results) && response.results.length > 0);
        setIsJoined(hasJoined);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setIsJoined(false);
        }
      }
    };
    
    checkJoinStatus();
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

  const handleInviteFriends = () => {
    triggerSnackbar('Invite feature coming soon!', 'info');
  };

  if (loading || usersLoading || !challenge) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ width: '100%', borderRadius: 0, overflow: 'hidden' }}>
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

      <Box sx={{ mt: 10, p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Title Section - Centered */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 0,
              fontWeight: 600 
            }}
          >
            {challenge.name}
          </Typography>
          <Typography 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            {challenge.description}
          </Typography>
        </Box>
      
        {/* Info and Actions Grid */}
        <Grid container spacing={4}>
          {/* Left Column - Challenge Info */}
          <Grid item xs={12} md={8} textAlign='left'>
            <Box>
              <Typography variant="h6" gutterBottom>Challenge Details:</Typography>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Flag sx={{ color: 'action.active' }} />
                  <Typography variant="h6" color="text.secondary">
                    {getChallengeGoalText(challenge)}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <CategoryRounded sx={{ color: 'action.active' }} />
                  <Typography>
                    <strong>Type:</strong> {challenge.type}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <DateRange sx={{ color: 'action.active' }} />
                  <Typography>
                    {format(new Date(challenge.start_date), 'MMM dd, yyyy')}
                    {challenge.end_date && (
                      <span>
                        {' to '}
                        {format(new Date(challenge.end_date), 'MMM dd, yyyy')}
                        {isAfter(new Date(challenge.end_date), new Date()) && (
                          <Typography component="span" sx={{ color: 'info.main' }}>
                            {' - '}{differenceInDays(new Date(challenge.end_date), new Date())} days left
                          </Typography>
                        )}
                      </span>
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>
      
          {/* Right Column - Actions */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {isJoined ? (
                <Tooltip title="Leave Challenge" arrow>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={handleJoinChallenge}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'error.main',
                        color: 'error.contrastText',
                        borderColor: 'error.main',
                      }
                    }}
                  >
                    Challenge Joined
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleJoinChallenge}
                >
                  Join Challenge
                </Button>
              )}
              
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<PersonAddIcon />}
                onClick={handleInviteFriends}
              >
                Invite Friends
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Participants Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Leaderboard
          </Typography>
          <List>
            {users.map((user) => (
              <ListItem key={user.user_info.id}>
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
                        sx={{ height: 8, borderRadius: 2, mt: 1 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Paper>
  );
};