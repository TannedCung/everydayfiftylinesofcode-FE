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

interface Props {
  challenge: Challenge;
  onJoin: (id: number) => void;
}

export const ChallengeCard: React.FC<Props> = ({ challenge, onJoin }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={challenge.background_image || '/default-challenge.jpg'}
        alt={challenge.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {challenge.name}
        </Typography>
        <Typography>
          {challenge.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Type: {challenge.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Commitment: {challenge.commitment_by}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Target: {challenge.target_value} {challenge.type === 'commits' ? 'commits' : 'lines'}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => onJoin(challenge.id)}
        >
          Join Now
        </Button>
      </Box>
    </Card>
  );
};