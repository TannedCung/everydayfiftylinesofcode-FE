// src/components/ChallengeCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Challenge } from '../types/challenge';
import { useNavigate } from 'react-router-dom';

interface Props {
  challenge: Challenge;
  isJoined: boolean;
  onJoin: (id: number) => void;
}

export const ChallengeCard: React.FC<Props> = ({ challenge, isJoined, onJoin }) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        cursor: 'pointer', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        width: '280px',
        textAlign: 'left',
      }} 
      onClick={() => navigate(`/challenges/${challenge.id}`)}
    >
      <CardMedia sx={{ mt: 0.5 }}
        component="img"
        height="120"
        image={challenge.background_image || '/default-challenge.jpg'}
        alt={challenge.name}
      />
      <CardContent sx={{ flexGrow: 1, p: 0.5 }}>
        <Typography 
          gutterBottom 
          variant="h6"
          component="h2"
          sx={{ mb: 0.5 }}
        >
          {challenge.name}
        </Typography>
        <Typography variant="body2">
          {challenge.description}
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {challenge.commitment_by} x {challenge.type} x {challenge.target_value} {challenge.type === 'commits' ? 'commits' : 'lines'}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ mt: 0.5 }}>
        {!isJoined && onJoin && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onJoin(challenge.id);
            }}
          >
            Join Now
          </Button>
        )}
        {isJoined && (
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            size="small" // Smaller button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/challenges/${challenge.id}`);
            }}
          >
            View Progress
          </Button>
        )}
      </Box>
    </Card>
  );
};