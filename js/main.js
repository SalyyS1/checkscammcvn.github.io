// Main JavaScript file for CheckScamMCVN
document.addEventListener('DOMContentLoaded', function() {
  // Import Direct GitHub integration
  const DirectGitHubSubmission = typeof module !== 'undefined' ? 
    require('./direct-github.js') : window.DirectGitHubSubmission;
  
  // Initialize Direct GitHub integration
  const github = new DirectGitHubSubmission('SalyyS1', 'checkscammcvn.github.io');
  
  // DOM Elements
  const statsContainer = document.getElementById('stats-container');
  const topScammersContainer = document.getElementById('top-scammers-container');
  
  // Initialize page
  initializePage();
  
  // Initialize page function
  async function initializePage() {
    try {
      // Fetch reports data
      const response = await fetch('data/reports.json');
      if (!response.ok) {
        throw new Error('Failed to fetch reports data');
      }
      
      const reports = await response.json();
      
      // Update statistics
      updateStatistics(reports);
      
      // Update top scammers
      updateTopScammers(reports);
    } catch (error) {
      console.error('Error initializing page:', error);
    }
  }
  
  // Update statistics display
  function updateStatistics(reports) {
    if (!statsContainer) return;
    
    // Calculate statistics
    const stats = {
      total_reports: reports.length,
      verified_reports: reports.filter(r => r.status === 'verified').length,
      resolved_reports: reports.filter(r => r.status === 'resolved').length,
      false_reports: reports.filter(r => r.status === 'false-report').length,
      pending_reports: reports.filter(r => r.status === 'pending').length,
      total_votes: reports.reduce((sum, report) => 
        sum + (report.votes?.confirm || 0) + (report.votes?.deny || 0), 0)
    };
    
    // Update statistics display
    statsContainer.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div class="bg-gray-700 p-3 rounded-lg">
          <div class="text-2xl font-bold">${stats.total_reports}</div>
          <div class="text-sm text-gray-400">Tổng báo cáo</div>
        </div>
        <div class="bg-gray-700 p-3 rounded-lg">
          <div class="text-2xl font-bold text-red-400">${stats.verified_reports}</div>
          <div class="text-sm text-gray-400">Đã xác minh</div>
        </div>
        <div class="bg-gray-700 p-3 rounded-lg">
          <div class="text-2xl font-bold text-green-400">${stats.resolved_reports}</div>
          <div class="text-sm text-gray-400">Đã giải quyết</div>
        </div>
        <div class="bg-gray-700 p-3 rounded-lg">
          <div class="text-2xl font-bold text-yellow-400">${stats.pending_reports}</div>
          <div class="text-sm text-gray-400">Đang xác minh</div>
        </div>
        <div class="bg-gray-700 p-3 rounded-lg">
          <div class="text-2xl font-bold text-blue-400">${stats.total_votes}</div>
          <div class="text-sm text-gray-400">Lượt bình chọn</div>
        </div>
      </div>
    `;
  }
  
  // Update top scammers display
  function updateTopScammers(reports) {
    if (!topScammersContainer) return;
    
    // Get top scammers
    const topScammers = github.getTopScammers(reports, 3);
    
    if (topScammers.length === 0) {
      topScammersContainer.innerHTML = `
        <div class="text-center py-4">
          <p class="text-gray-400">Chưa có đủ dữ liệu để hiển thị.</p>
        </div>
      `;
      return;
    }
    
    // Create HTML for top scammers
    let scammersHTML = '';
    
    topScammers.forEach((scammer, index) => {
      const rankClass = index === 0 ? 'text-red-400' : (index === 1 ? 'text-yellow-400' : 'text-gray-400');
      
      scammersHTML += `
        <div class="bg-gray-700 rounded-lg p-4 scam-card">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold">${scammer.name}</h3>
            <span class="text-xl font-bold ${rankClass}">#${index + 1}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 mb-2 text-sm">
            <div>
              <span class="text-gray-400">ID Discord:</span>
              <span class="font-mono">${scammer.discord}</span>
            </div>
            <div>
              <span class="text-gray-400">Tên Discord:</span>
              <span>${scammer.discord_name || 'N/A'}</span>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm">
            <div>
              <span class="text-gray-400">Số báo cáo:</span>
              <span class="font-bold">${scammer.count}</span>
            </div>
            <a href="#search" onclick="document.getElementById('search-query').value='${scammer.name}'; document.getElementById('search-form').dispatchEvent(new Event('submit'));" class="px-2 py-1 bg-blue-800 hover:bg-blue-700 rounded">
              <i class="fas fa-search mr-1"></i>Xem chi tiết
            </a>
          </div>
        </div>
      `;
    });
    
    // Update container
    topScammersContainer.innerHTML = scammersHTML;
  }
});
