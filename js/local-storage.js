// Local storage management for CheckScamMCVN
// This file handles storing and retrieving scam reports from browser localStorage

class LocalStorageManager {
  constructor() {
    this.storageKey = 'checkscammcvn_reports';
    this.initializeStorage();
  }

  // Initialize storage with sample data if empty
  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      // Sample data
      const sampleReports = [
        {
          "id": "SCAM-0001",
          "name": "StellaVN",
          "discord": "704862684889219173",
          "discord_name": "salyvn",
          "facebook": "https://facebook.com/stella.mc",
          "server": "StellaSMP",
          "date": "2025-04-01",
          "description": "Lừa đảo 10 block diamond và 5 netherite ingot. Hứa trade nhưng block và unfriend sau khi nhận đồ.",
          "proof": [
            "https://i.imgur.com/xyz123.png",
            "https://i.imgur.com/abc456.png"
          ],
          "status": "verified",
          "votes": {
            "confirm": 8,
            "deny": 1
          }
        },
        {
          "id": "SCAM-0002",
          "name": "MCPlayer123",
          "discord": "123456789012345678",
          "discord_name": "mcplayer123",
          "facebook": "https://facebook.com/mcplayer",
          "server": "AEMCStudio",
          "date": "2025-03-15",
          "description": "Nhận tiền mua rank VIP nhưng không thực hiện. Block tất cả liên lạc sau khi nhận tiền.",
          "proof": [
            "https://i.imgur.com/proof1.png"
          ],
          "status": "pending",
          "votes": {
            "confirm": 3,
            "deny": 2
          }
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(sampleReports));
    }
  }

  // Get all reports
  getAllReports() {
    try {
      const reports = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return reports;
    } catch (error) {
      console.error('Error getting reports from localStorage:', error);
      return [];
    }
  }

  // Add a new report
  addReport(reportData) {
    try {
      const reports = this.getAllReports();
      
      // Generate a new ID
      const lastId = reports.length > 0 
        ? parseInt(reports[reports.length - 1].id.split('-')[1]) 
        : 0;
      const newId = `SCAM-${String(lastId + 1).padStart(4, '0')}`;
      
      // Create new report object
      const newReport = {
        id: newId,
        name: reportData.minecraftName,
        discord: reportData.discordId,
        discord_name: reportData.discordName || '',
        facebook: reportData.facebookLink || '',
        server: reportData.server || 'other',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        description: reportData.description,
        proof: reportData.proofImages.split(',').map(url => url.trim()).filter(url => url),
        status: "pending",
        votes: {
          confirm: 0,
          deny: 0
        }
      };
      
      // Add to reports array
      reports.push(newReport);
      
      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(reports));
      
      return {
        success: true,
        report: newReport
      };
    } catch (error) {
      console.error('Error adding report to localStorage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search reports
  searchReports(query) {
    try {
      const reports = this.getAllReports();
      const searchQuery = query.toLowerCase().trim();
      
      // Filter reports based on search query
      return reports.filter(report => {
        return (
          report.name.toLowerCase().includes(searchQuery) ||
          report.discord.includes(searchQuery) ||
          (report.discord_name && report.discord_name.toLowerCase().includes(searchQuery)) ||
          (report.facebook && report.facebook.toLowerCase().includes(searchQuery))
        );
      });
    } catch (error) {
      console.error('Error searching reports:', error);
      return [];
    }
  }

  // Vote on a report
  voteOnReport(reportId, voteType) {
    try {
      const reports = this.getAllReports();
      const reportIndex = reports.findIndex(r => r.id === reportId);
      
      if (reportIndex === -1) {
        return {
          success: false,
          error: 'Report not found'
        };
      }
      
      // Update vote count
      if (voteType === 'confirm') {
        reports[reportIndex].votes.confirm++;
      } else if (voteType === 'deny') {
        reports[reportIndex].votes.deny++;
      }
      
      // Update status based on votes
      const confirmVotes = reports[reportIndex].votes.confirm;
      const denyVotes = reports[reportIndex].votes.deny;
      
      if (confirmVotes >= 5 && confirmVotes > denyVotes * 2) {
        reports[reportIndex].status = 'verified';
      } else if (denyVotes >= 5 && denyVotes > confirmVotes) {
        reports[reportIndex].status = 'false-report';
      }
      
      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(reports));
      
      return {
        success: true,
        report: reports[reportIndex]
      };
    } catch (error) {
      console.error('Error voting on report:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get website statistics
  getStatistics() {
    try {
      const reports = this.getAllReports();
      
      const stats = {
        total_reports: reports.length,
        verified_reports: reports.filter(r => r.status === 'verified').length,
        resolved_reports: reports.filter(r => r.status === 'resolved').length,
        false_reports: reports.filter(r => r.status === 'false-report').length,
        pending_reports: reports.filter(r => r.status === 'pending').length,
        total_votes: reports.reduce((sum, report) => 
          sum + report.votes.confirm + report.votes.deny, 0)
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        total_reports: 0,
        verified_reports: 0,
        resolved_reports: 0,
        false_reports: 0,
        pending_reports: 0,
        total_votes: 0
      };
    }
  }

  // Get top reported scammers
  getTopScammers(limit = 3) {
    try {
      const reports = this.getAllReports();
      
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

  // Clear all data (for testing)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.initializeStorage();
  }
}

// Create and export a singleton instance
const storageManager = new LocalStorageManager();
