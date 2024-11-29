import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import StatCard, { StatCardProps } from './StatCard';
import Copyright from '../internals/components/Copyright';
import { fetchStats } from '../hooks/useFetchStats'; // Stat fetcher
import { fetchGitHubActivity } from '../hooks/useFetchGitHubActivity'; // GitHub activity fetcher
import { GitHubActivityList } from './GitHubActivityList'; // Heatmap component

export default function MainGrid() {
  const [statCards, setStatCards] = useState<StatCardProps[]>([]);
  const [activityStats, setActivityStats] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      try {
        // Fetch GitHub activity stats for the current year
        const activityData = await fetchGitHubActivity(startDate, endDate);
        setActivityStats(activityData);

        // Fetch general stats (e.g., commits and changes)
        const { commits, changes, dates } = await fetchStats();
        setStatCards([
          {
            title: 'Commits',
            value: `${commits.total}`,
            data: commits.data,
            dates,
          },
          {
            title: 'Changes',
            value: `${changes.total}`,
            data: changes.data,
            dates,
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
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
          <>
            {/* Stat Cards */}
            {statCards.map((card, index) => (
              <Grid item key={index} xs={12} sm={6} lg={6}>
                <StatCard {...card} />
              </Grid>
            ))}

            {/* GitHub Activity Heatmap */}
            <Grid item xs={6}>
              <GitHubActivityList
                stats={activityStats} // Pass the activity data
              />
            </Grid>
          </>
        )}
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
