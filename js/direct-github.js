// Direct GitHub integration for report submission without pull requests
class DirectGitHubSubmission {
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
  
  // Directly update reports.json file in GitHub repository
  async updateReportsFile(reportData, existingReports) {
    try {
      // Add new report to existing reports
      existingReports.push(reportData);
      
      // In a real implementation, this would:
      // 1. Get the current file's SHA
      // 2. Create a new commit directly to main branch
      // 3. Update the reports.json file with the new content
      
      // For demonstration purposes, we'll simulate the process
      console.log('Directly updating reports.json with new report:', reportData);
      
      // Simulate successful update
      return {
        success: true,
        message: 'Report added successfully',
        reportId: reportData.id
      };
    } catch (error) {
      console.error('Error updating reports file:', error);
      return {
        success: false,
        message: 'Failed to update reports file: ' + error.message
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
    
    // Directly update the reports.json file
    return await this.updateReportsFile(reportData, existingReports);
  }
  
  // Get top reported scammers
  getTopScammers(reports, limit = 3) {
    try {
      // Group reports by name
      const scammerCounts = {};
      reports.forEach(report => {
        if (!scammerCounts[report.name]) {
          scammerCounts[report.name] = {
            name: report.name,
            discord: report.discord,
            discord_name: report.discord_name,
            count: 0,
            confirmVotes: 0
          };
        }
        scammerCounts[report.name].count++;
        scammerCounts[report.name].confirmVotes += report.votes.confirm;
      });
      
      // Convert to array and sort by count
      const scammers = Object.values(scammerCounts);
      scammers.sort((a, b) => {
        // First sort by report count
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // If counts are equal, sort by confirm votes
        return b.confirmVotes - a.confirmVotes;
      });
      
      // Return top N scammers
      return scammers.slice(0, limit);
    } catch (error) {
      console.error('Error getting top scammers:', error);
      return [];
    }
  }
}

// Explicitly expose the class to the global window object
window.DirectGitHubSubmission = DirectGitHubSubmission;
