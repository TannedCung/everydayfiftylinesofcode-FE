import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { Chip } from '@mui/material';

export type StatCardProps = {
  title: string;
  value: string;
  data: number[]; // Trend data (daily commits/changes)
  dates: string[]; // Dates corresponding to the data
};

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function StatCard({
  title,
  value,
  data,
  dates,
}: StatCardProps) {
  const theme = useTheme();
  const daysInMonth = getDaysInMonth(11, 2024); // Adjust the month and year dynamically as needed

  const chartColor =
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.primary.dark;

  // Ensure data length matches the days of the month (fill missing days with 0)
  const chartData = daysInMonth.map((day, index) => {
    const commitData = data[index] || 0; // If no data, set to 0
    return {
      label: day,
      value: commitData,
    };
  });

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h4" component="p">
              {value} {/* This will display total commits or changes */}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%'}}>
            <BarChart
              borderRadius={5}
              colors={[chartColor]}
              data={chartData}
              xAxis={[
                {
                  scaleType: 'band',
                  data: dates, // The dates are now correctly passed as part of an array
                },
              ]}
              height={150}
              margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              series={[
                {
                  id: 'commits',
                  label: 'Commits',
                  data: chartData.map((item) => item.value),
                  stack: 'A',
                },
              ]}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
