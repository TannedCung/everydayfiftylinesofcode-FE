import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import StatCard, { StatCardProps } from './StatCard';
import Copyright from '../internals/components/Copyright';
import { fetchStats } from '../hooks/useFetchStats'; // Stat fetcher
import { fetchGitHubActivity } from '../hooks/useFetchGitHubActivity'; // GitHub activity fetcher
import { GitHubActivityList } from './GitHubActivityList'; // Heatmap component
import { usePersonalStats } from '../hooks/useFetchPersonalStats'; // Personal stats fetcher
import { useFetchChallenge } from '../hooks/useFetchChallenge'; // Challenge stats fetcher
import PersonalStatCard from './PersonalStatCard'; // Personal stats component
import { Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material'; // Import Select and MenuItem

export default function MainGrid() {
  const [statCards, setStatCards] = useState<StatCardProps[]>([]);
  const [activityStats, setActivityStats] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Default to current year

  // Use personal stats hook
  const { stats: personalStats, loading: personalLoading } = usePersonalStats();

  // Use challenge stats hook
  const { challenges, loading: challengeLoading } = useFetchChallenge();

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    const year = Number(event.target.value); // Ensure the value is treated as a number
    setSelectedYear(year);
  };

  useEffect(() => {
    const fetchData = async () => {
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;

      try {
        const activityData = await fetchGitHubActivity(startDate, endDate);
        setActivityStats(activityData);

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
  }, [selectedYear]); // Re-fetch when the year changes

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {loading || personalLoading || challengeLoading ? (
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
              <CircularProgress />
            </Stack>
          </Grid>
        ) : (
          <>
            {/* Personal Stat Cards */}
            {personalStats && (
              <>
                <Grid item xs={12} sm={6} lg={3}>
                  <PersonalStatCard title="Current Streak" value={`${personalStats.activityStreak.currentStreak} days`} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <PersonalStatCard title="Longest Streak" value={`${personalStats.activityStreak.longestStreak} days`} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <PersonalStatCard title="Daily Goal" value={`${personalStats.dailyGoalProgress.progress} %`} />
                </Grid>
              </>
            )}
            {/* Challenge Count Card */}
            {challenges && (
              <Grid item xs={12} sm={6} lg={3}>
                <PersonalStatCard title="Challenges" value={`${challenges.length}`} />
              </Grid>
            )}
            {/* Stat Cards */}
            {statCards.map((card, index) => (
              <Grid item key={index} xs={12} sm={6} lg={6}>
                <StatCard {...card} />
              </Grid>
            ))}
            {/* GitHub Activity Heatmap */}
            <Grid item xs={10} sm={10} lg={10}>
              <GitHubActivityList stats={activityStats} />
            </Grid>
            {/* Year Selector Dropdown */}
            <Grid item xs={2} sm={2} lg={2}>
              <FormControl fullWidth>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select labelId="year-select-label" value={selectedYear} label="Year" onChange={handleYearChange}>
                  {Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
