// GitHub Issues API Integration for CheckScam Minecraft
// This file handles the core functionality for interacting with GitHub Issues API

class GitHubIssuesAPI {
  constructor(owner, repo, token = null) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.baseUrl = 'https://api.github.com';
  }

  // Helper method to create headers for API requests
  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Create a new scam report as a GitHub issue
  async createReport(reportData) {
    try {
      // Format the report body in markdown
      const body = this.formatReportBody(reportData);
      
      // Create the issue title
      const title = `[REPORT] ${reportData.minecraftName} - ${reportData.discordId}`;
      
      // Submit the report as a GitHub issue
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title: title,
          body: body,
          labels: ['scam-report', 'pending']
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  // Format the report body in markdown
  formatReportBody(reportData) {
    // Split proof images by comma and trim whitespace
    const proofImages = reportData.proofImages
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => `- [Evidence](${url})`)
      .join('\n');

    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return `## Scammer Information
- **Minecraft Username**: ${reportData.minecraftName}
- **Discord ID**: ${reportData.discordId}
- **Discord Name**: ${reportData.discordName || 'N/A'}
- **Facebook Link**: ${reportData.facebookLink || 'N/A'}
- **Server**: ${reportData.server || 'Other'}

## Incident Details
${reportData.description}

## Evidence
${proofImages}

---
*Report submitted on ${currentDate} via CheckScam Minecraft*`;
  }

  // Search for reports based on query
  async searchReports(query) {
    try {
      // Encode the search query
      const searchQuery = encodeURIComponent(`repo:${this.owner}/${this.repo} label:scam-report ${query}`);
      
      // Search for issues matching the query
      const response = await fetch(`${this.baseUrl}/search/issues?q=${searchQuery}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching reports:', error);
      throw error;
    }
  }

  // Vote on a report (add reaction)
  async voteOnReport(issueNumber, voteType) {
    try {
      // Convert vote type to reaction content
      const content = voteType === 'confirm' ? '+1' : '-1';
      
      // Add reaction to the issue
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${issueNumber}/reactions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          content: content
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error voting on report:', error);
      throw error;
    }
  }

  // Get all scam reports
  async getAllReports() {
    try {
      // Get all issues with the scam-report label
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues?labels=scam-report&state=all&per_page=100`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting all reports:', error);
      throw error;
    }
  }

  // Get statistics about scam reports
  async getStatistics() {
    try {
      const issues = await this.getAllReports();
      
      // Calculate statistics
      const stats = {
        total_reports: issues.length,
        verified_reports: issues.filter(issue => issue.labels.some(label => label.name === 'verified')).length,
        resolved_reports: issues.filter(issue => issue.labels.some(label => label.name === 'resolved')).length,
        false_reports: issues.filter(issue => issue.labels.some(label => label.name === 'false-report')).length,
        pending_reports: issues.filter(issue => issue.labels.some(label => label.name === 'pending')).length,
        total_votes: issues.reduce((sum, issue) => sum + (issue.reactions ? (issue.reactions['+1'] || 0) + (issue.reactions['-1'] || 0) : 0), 0)
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  // Get top scammers based on report count and confirm votes
  async getTopScammers(limit = 3) {
    try {
      const issues = await this.getAllReports();
      
      // Extract scammer information from issue titles and count reports
      const scammerCounts = {};
      
      for (const issue of issues) {
        // Parse title to extract Minecraft username
        const match = issue.title.match(/\[REPORT\] (.*?) - /);
        if (match && match[1]) {
          const username = match[1];
          
          if (!scammerCounts[username]) {
            scammerCounts[username] = {
              name: username,
              count: 0,
              discord: '',
              discord_name: '',
              confirmVotes: 0
            };
            
            // Extract Discord ID from title
            const discordMatch = issue.title.match(/ - (\d+)/);
            if (discordMatch && discordMatch[1]) {
              scammerCounts[username].discord = discordMatch[1];
            }
            
            // Extract Discord name from body (simplified)
            const bodyMatch = issue.body.match(/\*\*Discord Name\*\*: (.*?)(?:\r?\n|$)/);
            if (bodyMatch && bodyMatch[1] && bodyMatch[1] !== 'N/A') {
              scammerCounts[username].discord_name = bodyMatch[1];
            }
          }
          
          scammerCounts[username].count++;
          
          // Count confirm votes (thumbs up reactions)
          if (issue.reactions && issue.reactions['+1']) {
            scammerCounts[username].confirmVotes += issue.reactions['+1'];
          }
        }
      }
      
      // Convert to array and sort
      const scammers = Object.values(scammerCounts);
      scammers.sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return b.confirmVotes - a.confirmVotes;
      });
      
      return scammers.slice(0, limit);
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
