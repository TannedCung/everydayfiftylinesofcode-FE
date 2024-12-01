import axiosInstance from '../services/axiosInstance'; // Ensure axiosInstance is properly set up

export async function fetchGitHubActivity(startDate: string, endDate: string) {
  try {
    // Send GET request with the required date range
    const response = await axiosInstance.get('/api/github/commits/contribution-calendar/', {
      params: { year: new Date(startDate).getFullYear() }, // Assuming year is sufficient for this query
      headers: {
        Authorization: `Bearer ${localStorage.getItem('github_token')}`, // Example for token
      },
    });

    const data = response.data;

    // Check for valid response data structure
    if (!data || !data.data || !data.data.user || !data.data.user.contributionsCollection) {
      throw new Error('Invalid response data structure');
    }

    const contributionCalendar = data.data.user.contributionsCollection.contributionCalendar;

    // Flatten weeks and contributionDays into a single array of activities
    const activityStats = contributionCalendar.weeks.flatMap((week) => 
      week.contributionDays.map((day: { date: any; contributionCount: any; }) => ({
        date: day.date,  // Date in YYYY-MM-DD format
        count: day.contributionCount,  // Number of commits for the date
      }))
    );

    // Filter out activity stats that fall outside the requested date range
    const filteredStats = activityStats.filter((stat: { date: string | number | Date; }) => {
      const date = new Date(stat.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    return filteredStats;
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    throw error; // Rethrow the error after logging
  }
}
