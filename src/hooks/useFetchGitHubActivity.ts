import axiosInstance from '../services/axiosInstance'; // Ensure axiosInstance is properly set up

export async function fetchGitHubActivity(startDate: string, endDate: string) {
  try {
    const response = await axiosInstance.get('/api/github/commits/by_day/', {
      params: { start_date: startDate, end_date: endDate }, // Pass query params
    });

    const data = response.data;

    // Ensure the response data is an array
    if (!Array.isArray(data)) {
      throw new Error('Expected data to be an array');
    }

    // Format data to match activity stats structure
    const activityStats = data.map((day) => ({
      date: day.date, // Date in YYYY-MM-DD format
      count: day.total_commits, // Number of commits for the date
    }));

    return activityStats;
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    throw error; // Rethrow the error after logging
  }
}
