// src/components/PersonalStatCard.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface PersonalStatCardProps {
  title: string;
  value: string | number;
}

const PersonalStatCard: React.FC<PersonalStatCardProps> = ({ title, value, description }) => {
  return (
    <Card sx={{ minWidth: 100, mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PersonalStatCard;
