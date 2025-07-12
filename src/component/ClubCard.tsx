// src/components/ClubCard.tsx
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Club } from '../types/club';
import { useNavigate } from 'react-router-dom';

interface Props {
  club: Club;
}

export const ClubCard: React.FC<Props> = ({ club }) => {
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
      onClick={() => navigate(`/clubs/${club.id}`)}
    >
      <CardMedia
        component="img"
        height="140"
        image={club.background_image || '/default-club.jpg'}
        alt={club.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {club.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {club.description}
        </Typography>
      </CardContent>
    </Card>
  );
};