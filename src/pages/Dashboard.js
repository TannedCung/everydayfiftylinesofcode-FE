import { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import axios from 'axios';

export default function Dashboard() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    axios.get('/api/user_activity').then(res => setActivity(res.data));
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Paper style={{ padding: 16, marginTop: 20 }}>
        <Typography variant="h6">Your Activity</Typography>
        {/* Map through activity data and display it */}
      </Paper>
    </Container>
  );
}
