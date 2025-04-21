// GitHub Issues API integration via Netlify Functions
// This file handles the communication with GitHub Issues API through Netlify Functions

class GitHubIssuesAPI {
  constructor() {
    // Base URL for Netlify Functions
    this.baseUrl = '/.netlify/functions';
  }

  // Create a new scam report
  async createReport(reportData) {
    try {
      const response = await fetch(`${this.baseUrl}/createReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  // Search for reports based on query
  async searchReports(query) {
    try {
      const response = await fetch(`${this.baseUrl}/searchReports?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message}`);
      }
      
      return await response.json().then(result => result.data);
    } catch (error) {
      console.error('Error searching reports:', error);
      throw error;
    }
  }

  // Vote on a report
  async voteOnReport(issueNumber, voteType) {
    try {
      const response = await fetch(`${this.baseUrl}/voteOnReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          issueNumber,
          voteType
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error voting on report:', error);
      throw error;
    }
  }

  // Get statistics about scam reports
  async getStatistics() {
    try {
      const response = await fetch(`${this.baseUrl}/getStatistics`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message}`);
      }
      
      return await response.json().then(result => result.data);
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  // Get top scammers
  async getTopScammers(limit = 3) {
    try {
      const response = await fetch(`${this.baseUrl}/getTopScammers?limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message}`);
      }
      
      return await response.json().then(result => result.data);
    } catch (error) {
      console.error('Error getting top scammers:', error);
      throw error;
    }
  }

  // Check if user has already voted on a report (using localStorage)
  hasVoted(issueNumber) {
    const votedIssues = JSON.parse(localStorage.getItem('votedIssues') || '{}');
    return votedIssues[issueNumber] !== undefined;
  }

  // Record user vote in localStorage
  recordVote(issueNumber, voteType) {
    const votedIssues = JSON.parse(localStorage.getItem('votedIssues') || '{}');
    votedIssues[issueNumber] = voteType;
    localStorage.setItem('votedIssues', JSON.stringify(votedIssues));
  }
}

// Export the class for use in other files
window.GitHubIssuesAPI = GitHubIssuesAPI;
