// pages/challenges.js
import { useState, useEffect } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import axios from 'axios';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get('/api/challenges').then(res => setChallenges(res.data));
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Typography variant="h4">Challenges</Typography>
      <Paper style={{ padding: 16, marginTop: 20 }}>
        {challenges.map((challenge) => (
          <div key={challenge.id}>
            <Typography variant="h6">{challenge.name}</Typography>
            <Typography>{challenge.description}</Typography>
          </div>
        ))}
      </Paper>
    </Container>
  );
}
