import axiosInstance from '../services/axiosInstance'; // Assuming axiosInstance is set up for authenticated requests

// Define the structure of a single commit
interface Commit {
  oid: string;
  message: string;
  additions: number;
  deletions: number;
}

// Define the structure of the response
type CommitsByDay = Record<string, Commit[]>;

export async function fetchStats() {
  try {
    const response = await axiosInstance.get<CommitsByDay>('/api/github/commits/commits-with-changes/'); // Fetch data from backend
    const data = response.data;

    // Process data for chart
    const dates: string[] = [];
    const commitsData: number[] = [];
    const changesData: number[] = [];
    let totalCommits = 0;
    let totalChanges = 0;

    for (const [date, commits] of Object.entries(data)) {
      // Ensure 'commits' is an array of Commit objects
      if (!Array.isArray(commits)) {
        throw new Error(`Invalid data format for date: ${date}`);
      }

      dates.push(new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

      const dayCommits = commits.length;
      const dayChanges = commits.reduce((sum, commit) => sum + commit.additions + commit.deletions, 0);

      commitsData.push(dayCommits);
      changesData.push(dayChanges);

      totalCommits += dayCommits;
      totalChanges += dayChanges;
    }

    // Return structured data
    return {
      commits: { total: totalCommits, data: commitsData },
      changes: { total: totalChanges, data: changesData },
      dates,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error; // Rethrow the error after logging it
  }
}
