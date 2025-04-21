// Enhanced search functionality for CheckScamMCVN
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const searchForm = document.getElementById('search-form');
  const searchQuery = document.getElementById('search-query');
  const searchResults = document.getElementById('search-results');
  const resultsContainer = document.getElementById('results-container');
  const noResults = document.getElementById('no-results');
  
  // Initialize search form
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchQuery.value.trim().toLowerCase();
      
      if (query.length < 3) {
        alert('Vui lòng nhập ít nhất 3 ký tự để tìm kiếm');
        return;
      }
      
      // Show loading indicator
      resultsContainer.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-green-400"></i><p class="mt-2">Đang tìm kiếm...</p></div>';
      searchResults.classList.remove('hidden');
      noResults.classList.add('hidden');
      
      // Fetch reports and perform search
      fetchReportsAndSearch(query);
    });
  }
  
  // Fetch reports from JSON file and perform search
  async function fetchReportsAndSearch(query) {
    try {
      const response = await fetch('data/reports.json');
      if (!response.ok) {
        throw new Error('Failed to fetch reports data');
      }
      
      const reports = await response.json();
      performSearch(query, reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      resultsContainer.innerHTML = `<div class="text-center py-8 text-red-400"><i class="fas fa-exclamation-circle text-3xl mb-2"></i><p>Lỗi khi tải dữ liệu: ${error.message}</p></div>`;
    }
  }
  
  // Search function with advanced filtering
  function performSearch(query, reports) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Filter reports based on search query
    const results = reports.filter(report => {
      // Check for Discord ID (exact match)
      if (report.discord === query) {
        return true;
      }
      
      // Check for Minecraft name (case insensitive)
      if (report.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Check for Discord name (case insensitive)
      if (report.discord_name && report.discord_name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Check for Facebook link
      if (report.facebook && report.facebook.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    });
    
    // Display results or no results message
    if (results.length > 0) {
      searchResults.classList.remove('hidden');
      noResults.classList.add('hidden');
      
      // Sort results by date (newest first)
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      results.forEach(report => {
        resultsContainer.appendChild(createReportCard(report));
      });
      
      // Add summary
      const summaryDiv = document.createElement('div');
      summaryDiv.className = 'mt-6 p-4 bg-gray-700 rounded-lg';
      summaryDiv.innerHTML = `
        <h3 class="font-bold mb-2">Tổng kết tìm kiếm</h3>
        <p>Tìm thấy ${results.length} báo cáo cho "${query}"</p>
        <p class="text-sm text-gray-400 mt-1">Lưu ý: Thông tin này chỉ mang tính chất tham khảo. Hãy kiểm tra kỹ bằng chứng trước khi đưa ra quyết định.</p>
      `;
      resultsContainer.appendChild(summaryDiv);
    } else {
      searchResults.classList.add('hidden');
      noResults.classList.remove('hidden');
    }
    
    // Scroll to results
    searchResults.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Create report card (same as in main.js)
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
      <p class="mb-3 text-gray-300">${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</p>
      <div class="mb-3">
        <span class="text-gray-400 text-sm">Bằng chứng:</span>
        <div class="flex flex-wrap gap-2 mt-1">
          ${report.proof && report.proof.length > 0 ? 
            `<button class="text-blue-400 hover:text-blue-300 text-sm" onclick="showDetailedReport(${JSON.stringify(report).replace(/"/g, '&quot;')})">
              <i class="fas fa-images mr-1"></i>Xem ${report.proof.length} ảnh
            </button>` : 
            '<span class="text-gray-500 text-sm">Không có ảnh</span>'
          }
        </div>
      </div>
      <div class="flex justify-between items-center text-sm">
        <div>
          <span class="text-gray-400">Xác nhận:</span>
          <span class="font-bold">${voteRatio}</span>
        </div>
        <button class="text-blue-400 hover:text-blue-300" onclick="showDetailedReport(${JSON.stringify(report).replace(/"/g, '&quot;')})">
          <i class="fas fa-search-plus mr-1"></i>Xem chi tiết
        </button>
      </div>
    `;
    
    return card;
  }
});
