// GitHub API integration for report submission
class GitHubReportSubmission {
  constructor(repoOwner, repoName) {
    this.repoOwner = repoOwner;
    this.repoName = repoName;
    this.baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
  }
  
  // Generate a unique report ID
  generateReportId(existingReports) {
    const lastReport = existingReports.sort((a, b) => {
      const idA = parseInt(a.id.split('-')[1]);
      const idB = parseInt(b.id.split('-')[1]);
      return idB - idA;
    })[0];
    
    const lastId = lastReport ? parseInt(lastReport.id.split('-')[1]) : 0;
    const newId = lastId + 1;
    return `SCAM-${String(newId).padStart(4, '0')}`;
  }
  
  // Format report data for submission
  formatReportData(formData, existingReports) {
    const reportId = this.generateReportId(existingReports);
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Split proof images by comma and trim whitespace
    const proofImages = formData.proofImages
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    return {
      id: reportId,
      name: formData.minecraftName,
      discord: formData.discordId,
      discord_name: formData.discordName || null,
      facebook: formData.facebookLink || null,
      server: formData.server || "other",
      date: currentDate,
      description: formData.description,
      proof: proofImages,
      status: "pending",
      votes: {
        confirm: 0,
        deny: 0
      }
    };
  }
  
  // Create a GitHub Pull Request for a new report
  async createPullRequest(reportData) {
    try {
      // In a real implementation, this would:
      // 1. Fork the repository if not already forked
      // 2. Create a new branch
      // 3. Read the current reports.json
      // 4. Add the new report to the array
      // 5. Commit the changes
      // 6. Create a pull request
      
      // For demonstration purposes, we'll simulate the process
      console.log('Creating pull request for new report:', reportData);
      
      // Simulate API response
      return {
        success: true,
        message: 'Pull request created successfully',
        prUrl: `https://github.com/${this.repoOwner}/${this.repoName}/pull/123`
      };
    } catch (error) {
      console.error('Error creating pull request:', error);
      return {
        success: false,
        message: 'Failed to create pull request: ' + error.message
      };
    }
  }
  
  // Process a report submission
  async submitReport(formData, existingReports) {
    // Validate required fields
    if (!formData.minecraftName || !formData.discordId || !formData.proofImages || !formData.description) {
      return {
        success: false,
        message: 'Missing required fields'
      };
    }
    
    // Format the report data
    const reportData = this.formatReportData(formData, existingReports);
    
    // Create a pull request
    return await this.createPullRequest(reportData);
  }
}

// Export the class for use in main.js
if (typeof module !== 'undefined') {
  module.exports = GitHubReportSubmission;
}
