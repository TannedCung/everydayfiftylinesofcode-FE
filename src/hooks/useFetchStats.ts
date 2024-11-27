import axiosInstance from '../services/axiosInstance'; // Assuming axiosInstance is set up for authenticated requests

export async function fetchStats() {
  try {
    const response = await axiosInstance.get('/api/github/commits/by_day/'); // Fetch data from backend
    const data = response.data;

    // Ensure that data is an array
    if (!Array.isArray(data)) {
      throw new Error('Expected data to be an array');
    }

    // Format dates for the X-axis
    const dates = data.map((day) => new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    // Calculate the total commits and changes
    const commits = {
      total: data.reduce((sum, day) => sum + day.total_commits, 0),
      data: data.map((day) => day.total_commits),
    };

    const changes = {
      total: data.reduce((sum, day) => sum + day.total_changes, 0),
      data: data.map((day) => day.total_changes),
    };

    // Return the structured data with dates for X-axis
    return { commits, changes, dates };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error; // Rethrow the error after logging it
  }
}
