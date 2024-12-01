import React from 'react';
import { useTheme } from '@mui/material/styles';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import 'react-calendar-heatmap/dist/styles.css';
import '../styles/calendarHeatmap.css';
import 'react-tooltip/dist/react-tooltip.css';

interface Contribution {
  count: number;
  date: string;
}

interface GitHubActivityListProps {
  stats: Contribution[];
}

export const GitHubActivityList: React.FC<GitHubActivityListProps> = ({ stats }) => {
  const theme = useTheme(); // Access the current theme

  // Extract the date range from the stats
  const startDate = new Date(stats[0].date);
  const endDate = new Date(stats[stats.length - 1].date);

  // Calculate the total contributions
  const totalContributions = stats.reduce((sum, day) => sum + day.count, 0);

  // Define dynamic styles for heatmap cells
  const getCellColor = (count: number | undefined): string => {
    if (count === undefined || count === 0) {
      return theme.palette.mode === 'light' ? 'color-empty-light' : 'color-empty-dark';
    }
    if (count < 4) {
      return theme.palette.mode === 'light'
        ? `color-scale-light-${count}`
        : `color-scale-dark-${count}`;
    }
    return theme.palette.mode === 'light' ? 'color-scale-light-4' : 'color-scale-dark-4';
  };

  return (
    <div>
      <h5>Total Contributions: {totalContributions}</h5>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={stats.map((day) => ({
          date: day.date,
          count: day.count,
        }))}
        // Attach tooltips to each cell
        tooltipDataAttrs={(value: { date: string; count: number }) => {
          if (!value || !value.date) {
            return {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': 'No contributions',
            };
          }
          return {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': `Date: ${value.date} - Commits: ${value.count || 0}`,
          };
        }}
        showWeekdayLabels
        classForValue={(value: { count: number | undefined }) => getCellColor(value?.count)}
      />
      <ReactTooltip id="heatmap-tooltip" /> {/* Render the tooltip */}
    </div>
  );
};
