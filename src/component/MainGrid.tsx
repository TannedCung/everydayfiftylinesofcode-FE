import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import StatCard, { StatCardProps } from './StatCard';
import Copyright from '../internals/components/Copyright';
import { fetchStats } from '../hooks/useFetchStats'; // Ensure the path to your fetchStats function is correct

export default function MainGrid() {
  const [statCards, setStatCards] = useState<StatCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dates, setDates] = useState<string[]>([]); // To store the dates

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { commits, changes, dates } = await fetchStats(); // Fetch stats from backend
        setStatCards([
          {
            title: 'Commits',
            value: `${commits.total}`,  // Total commits
            interval: 'Daily', // You can change this based on your preference
            data: commits.data, // Array of daily commits
            dates: dates, // Pass dates here
          },
          {
            title: 'Changes',
            value: `${changes.total}`,  // Total changes
            interval: 'Daily', // You can change this based on your preference
            data: changes.data, // Array of daily changes
            dates: dates, // Pass dates here
          },
        ]);
        setDates(dates); // Store dates for later usage (if needed)
      } catch (error) {
        console.error('Error fetching stats:', error); // Handle errors gracefully
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {loading ? (
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ height: 200 }}
            >
              <CircularProgress /> {/* Display loading spinner */}
            </Stack>
          </Grid>
        ) : (
          statCards.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} lg={6}>
              <StatCard {...card} /> {/* Render StatCard for each stat */}
            </Grid>
          ))
        )}
      </Grid>
      <Copyright sx={{ my: 4 }} /> {/* Footer */}
    </Box>
  );
}
