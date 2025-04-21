// Main JavaScript for CheckScamMCVN

// Sample data for testing - will be replaced with actual data from GitHub
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
  },
  {
    "id": "SCAM-0003",
    "name": "CraftMaster",
    "discord": "987654321098765432",
    "discord_name": "craftmaster",
    "facebook": "https://facebook.com/craft.master",
    "server": "MMOVNStudio",
    "date": "2025-02-20",
    "description": "Lừa đảo item hiếm từ event. Hứa trade nhưng không thực hiện sau khi nhận đồ.",
    "proof": [
      "https://i.imgur.com/proof2.png",
      "https://i.imgur.com/proof3.png"
    ],
    "status": "resolved",
    "votes": {
      "confirm": 12,
      "deny": 0
    }
  }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Search functionality
  const searchForm = document.getElementById('search-form');
  const searchQuery = document.getElementById('search-query');
  const searchResults = document.getElementById('search-results');
  const resultsContainer = document.getElementById('results-container');
  const noResults = document.getElementById('no-results');
  
  // Report form
  const reportForm = document.getElementById('report-form');
  
  // Initialize search form
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchQuery.value.trim().toLowerCase();
      
      if (query.length < 3) {
        alert('Vui lòng nhập ít nhất 3 ký tự để tìm kiếm');
        return;
      }
      
      performSearch(query);
    });
  }
  
  // Initialize report form
  if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitReport();
    });
  }
  
  // Search function
  function performSearch(query) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Filter reports based on search query
    const results = sampleReports.filter(report => {
      return (
        report.name.toLowerCase().includes(query) ||
        report.discord.includes(query) ||
        (report.discord_name && report.discord_name.toLowerCase().includes(query)) ||
        (report.facebook && report.facebook.toLowerCase().includes(query))
      );
    });
    
    // Display results or no results message
    if (results.length > 0) {
      searchResults.classList.remove('hidden');
      noResults.classList.add('hidden');
      
      results.forEach(report => {
        resultsContainer.appendChild(createReportCard(report));
      });
    } else {
      searchResults.classList.add('hidden');
      noResults.classList.remove('hidden');
    }
    
    // Scroll to results
    searchResults.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Create report card
  function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'bg-gray-700 rounded-lg p-4 scam-card';
    
    // Status badge
    let statusBadge = '';
    if (report.status === 'verified') {
      statusBadge = '<span class="status-badge status-verified">Đã xác minh</span>';
    } else if (report.status === 'pending') {
      statusBadge = '<span class="status-badge status-pending">Đang xác minh</span>';
    } else if (report.status === 'resolved') {
      statusBadge = '<span class="status-badge status-resolved">Đã giải quyết</span>';
    }
    
    // Format date
    const reportDate = new Date(report.date);
    const formattedDate = reportDate.toLocaleDateString('vi-VN');
    
    // Create vote ratio
    const voteRatio = `${report.votes.confirm}/${report.votes.confirm + report.votes.deny}`;
    
    // Build card HTML
    card.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-bold">${report.name}</h3>
        ${statusBadge}
      </div>
      <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div>
          <span class="text-gray-400">ID Discord:</span>
          <span class="font-mono">${report.discord}</span>
        </div>
        <div>
          <span class="text-gray-400">Tên Discord:</span>
          <span>${report.discord_name || 'N/A'}</span>
        </div>
        <div>
          <span class="text-gray-400">Server:</span>
          <span>${report.server}</span>
        </div>
        <div>
          <span class="text-gray-400">Ngày báo cáo:</span>
          <span>${formattedDate}</span>
        </div>
      </div>
      <p class="mb-3 text-gray-300">${report.description}</p>
      <div class="mb-3">
        <span class="text-gray-400 text-sm">Bằng chứng:</span>
        <div class="flex flex-wrap gap-2 mt-1">
          ${report.proof.map((url, index) => `
            <a href="${url}" target="_blank" class="text-blue-400 hover:text-blue-300 text-sm">
              <i class="fas fa-image mr-1"></i>Ảnh ${index + 1}
            </a>
          `).join('')}
        </div>
      </div>
      <div class="flex justify-between items-center text-sm">
        <div>
          <span class="text-gray-400">Xác nhận:</span>
          <span class="font-bold">${voteRatio}</span>
        </div>
        <div class="flex gap-2">
          <button class="vote-button confirm px-2 py-1 bg-green-800 hover:bg-green-700 rounded" data-id="${report.id}" data-vote="confirm">
            <i class="fas fa-check mr-1"></i>Xác nhận
          </button>
          <button class="vote-button deny px-2 py-1 bg-red-800 hover:bg-red-700 rounded" data-id="${report.id}" data-vote="deny">
            <i class="fas fa-times mr-1"></i>Phản đối
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners to vote buttons
    setTimeout(() => {
      const voteButtons = card.querySelectorAll('.vote-button');
      voteButtons.forEach(button => {
        button.addEventListener('click', function() {
          const reportId = this.getAttribute('data-id');
          const voteType = this.getAttribute('data-vote');
          handleVote(reportId, voteType);
        });
      });
    }, 0);
    
    return card;
  }
  
  // Handle voting
  function handleVote(reportId, voteType) {
    // In a real implementation, this would send data to GitHub
    alert(`Đã ghi nhận ${voteType === 'confirm' ? 'xác nhận' : 'phản đối'} cho báo cáo ${reportId}`);
    
    // For demo purposes, update the sample data
    const report = sampleReports.find(r => r.id === reportId);
    if (report) {
      if (voteType === 'confirm') {
        report.votes.confirm++;
      } else {
        report.votes.deny++;
      }
      
      // Refresh the search results to show updated votes
      const query = searchQuery.value.trim().toLowerCase();
      if (query.length >= 3) {
        performSearch(query);
      }
    }
  }
  
  // Submit report function
  function submitReport() {
    const minecraftName = document.getElementById('minecraft-name').value;
    const discordId = document.getElementById('discord-id').value;
    const discordName = document.getElementById('discord-name').value;
    const facebookLink = document.getElementById('facebook-link').value;
    const server = document.getElementById('server').value;
    const proofImages = document.getElementById('proof-images').value;
    const incidentDescription = document.getElementById('incident-description').value;
    
    // Validate required fields
    if (!minecraftName || !discordId || !proofImages || !incidentDescription) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    // Validate Discord ID format (numbers only)
    if (!/^\d+$/.test(discordId)) {
      alert('ID Discord phải là dãy số');
      return;
    }
    
    // In a real implementation, this would create a GitHub PR
    // For demo purposes, show success message
    alert('Báo cáo đã được gửi thành công! Trong môi trường thực tế, báo cáo này sẽ tạo một Pull Request trên GitHub để được xem xét.');
    
    // Reset form
    reportForm.reset();
  }
});

// GitHub API integration (placeholder for actual implementation)
class GitHubIntegration {
  constructor(repoOwner, repoName) {
    this.repoOwner = repoOwner;
    this.repoName = repoName;
    this.baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
  }
  
  // Fetch reports from GitHub repository
  async fetchReports() {
    try {
      // In a real implementation, this would fetch data from GitHub
      // For demo purposes, return sample data
      return sampleReports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  }
  
  // Create a new report (as a Pull Request)
  async createReport(reportData) {
    try {
      // In a real implementation, this would create a PR on GitHub
      console.log('Creating report:', reportData);
      return { success: true, message: 'Report submitted successfully' };
    } catch (error) {
      console.error('Error creating report:', error);
      return { success: false, message: 'Failed to submit report' };
    }
  }
  
  // Vote on a report
  async voteOnReport(reportId, voteType) {
    try {
      // In a real implementation, this would update vote data on GitHub
      console.log(`Voting ${voteType} on report ${reportId}`);
      return { success: true };
    } catch (error) {
      console.error('Error voting on report:', error);
      return { success: false };
    }
  }
}

// Initialize GitHub integration
const github = new GitHubIntegration('checkscammcvn', 'checkscammcvn.github.io');
