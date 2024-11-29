import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Import the Tooltip component

import 'react-calendar-heatmap/dist/styles.css';
import '../styles/calendarHeatmap.css';
import 'react-tooltip/dist/react-tooltip.css'; // Import tooltip styles

interface Contribution {
  count: number;
  date: string;
}

interface GitHubActivityListProps {
  stats: Contribution[];
}

export const GitHubActivityList: React.FC<GitHubActivityListProps> = ({ stats }) => {
  // Extract the date range from the stats
  const startDate = new Date(stats[0].date);
  const endDate = new Date(stats[stats.length - 1].date);

  // Calculate the total contributions
  const totalContributions = stats.reduce((sum, day) => sum + day.count, 0);

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
        tooltipDataAttrs={(value: { date: any; count: any; }) => {
          if (!value || !value.date) {
            return { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': 'No contributions' };
          }
          return {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': `Date: ${value.date} - Commits: ${value.count || 0}`,
          };
        }}
        showWeekdayLabels
        classForValue={(value: { count: number; }) => {
          if (!value || value.count === 0) {
            return 'color-empty';
          }
          return value.count < 4 ? `color-scale-${value.count}` : `color-scale-4`;
        }}
      />
      <ReactTooltip id="heatmap-tooltip" /> {/* Render the tooltip */}
    </div>
  );
};
