// UI Integration for GitHub Issues API
// This file handles the UI components for the CheckScam Minecraft website

class CheckScamUI {
  constructor(apiInstance) {
    this.api = apiInstance;
    this.initializeUI();
  }

  // Initialize UI components
  initializeUI() {
    // Initialize statistics display
    this.updateStatistics();
    
    // Initialize top scammers display
    this.updateTopScammers();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  // Set up event listeners for UI interactions
  setupEventListeners() {
    // Search form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('search-query').value.trim();
        if (query) {
          this.performSearch(query);
        }
      });
    }
    
    // Report form submission
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
      reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitReport();
      });
    }
  }

  // Update statistics display
  async updateStatistics() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    try {
      // Show loading state
      statsContainer.innerHTML = `
        <div class="loading-placeholder">
          <i class="fas fa-spinner loading-spinner"></i>
          <span>Đang tải thống kê...</span>
        </div>
      `;
      
      // Fetch statistics from GitHub Issues API
      const stats = await this.api.getStatistics();
      
      // Update the UI with the fetched statistics
      statsContainer.innerHTML = `
        <div class="stat-card stat-total">
          <div class="stat-value">${stats.total_reports}</div>
          <div class="stat-label">Tổng báo cáo</div>
        </div>
        <div class="stat-card stat-verified">
          <div class="stat-value">${stats.verified_reports}</div>
          <div class="stat-label">Đã xác minh</div>
        </div>
        <div class="stat-card stat-resolved">
          <div class="stat-value">${stats.resolved_reports}</div>
          <div class="stat-label">Đã giải quyết</div>
        </div>
        <div class="stat-card stat-pending">
          <div class="stat-value">${stats.pending_reports}</div>
          <div class="stat-label">Đang xác minh</div>
        </div>
        <div class="stat-card stat-votes">
          <div class="stat-value">${stats.total_votes}</div>
          <div class="stat-label">Lượt bình chọn</div>
        </div>
      `;
    } catch (error) {
      console.error('Error updating statistics:', error);
      statsContainer.innerHTML = `
        <div class="error-message">
          <p><i class="fas fa-exclamation-triangle"></i> Không thể tải thống kê. Vui lòng thử lại sau.</p>
        </div>
      `;
    }
  }

  // Update top scammers display
  async updateTopScammers() {
    const topScammersContainer = document.getElementById('top-scammers-container');
    if (!topScammersContainer) return;
    
    try {
      // Show loading state
      topScammersContainer.innerHTML = `
        <div class="loading-placeholder">
          <i class="fas fa-spinner loading-spinner"></i>
          <span>Đang tải danh sách...</span>
        </div>
      `;
      
      // Fetch top scammers from GitHub Issues API
      const topScammers = await this.api.getTopScammers(3);
      
      if (topScammers.length === 0) {
        topScammersContainer.innerHTML = `
          <div class="text-center py-4">
            <p class="text-gray-400">Chưa có báo cáo nào.</p>
          </div>
        `;
        return;
      }
      
      // Create HTML for each scammer card
      const scammersHTML = topScammers.map((scammer, index) => `
        <div class="scammer-card">
          <div class="scammer-rank rank-${index + 1}">#${index + 1}</div>
          <h3 class="scammer-name">${scammer.name}</h3>
          <div class="scammer-info">
            <div>
              <div class="scammer-info-label">Discord ID</div>
              <div>${scammer.discord || 'N/A'}</div>
            </div>
            <div>
              <div class="scammer-info-label">Discord Name</div>
              <div>${scammer.discord_name || 'N/A'}</div>
            </div>
          </div>
          <div class="scammer-stats">
            <div class="scammer-count">
              <i class="fas fa-exclamation-triangle text-red-400"></i>
              <span class="scammer-count-value">${scammer.count} báo cáo</span>
            </div>
            <button class="view-details-btn" onclick="window.location.href='#search';document.getElementById('search-query').value='${scammer.name}';document.getElementById('search-form').dispatchEvent(new Event('submit'));">
              <i class="fas fa-search"></i> Xem chi tiết
            </button>
          </div>
        </div>
      `).join('');
      
      // Update the UI with the fetched top scammers
      topScammersContainer.innerHTML = scammersHTML;
    } catch (error) {
      console.error('Error updating top scammers:', error);
      topScammersContainer.innerHTML = `
        <div class="error-message">
          <p><i class="fas fa-exclamation-triangle"></i> Không thể tải danh sách. Vui lòng thử lại sau.</p>
        </div>
      `;
    }
  }

  // Perform search and display results
  async performSearch(query) {
    const resultsContainer = document.getElementById('results-container');
    const searchResults = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    
    if (!resultsContainer || !searchResults || !noResults) return;
    
    try {
      // Show loading state
      searchResults.classList.remove('hidden');
      noResults.classList.add('hidden');
      resultsContainer.innerHTML = `
        <div class="loading-placeholder">
          <i class="fas fa-spinner loading-spinner"></i>
          <span>Đang tìm kiếm...</span>
        </div>
      `;
      
      // Perform search using GitHub Issues API
      const response = await this.api.searchReports(query);
      
      if (response.items.length === 0) {
        // No results found
        searchResults.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
      }
      
      // Create HTML for each search result
      const resultsHTML = response.items.map(issue => {
        // Extract information from issue
        const titleMatch = issue.title.match(/\[REPORT\] (.*?) - (.*)/);
        const minecraftName = titleMatch ? titleMatch[1] : 'Unknown';
        const discordId = titleMatch ? titleMatch[2] : 'Unknown';
        
        // Determine status based on labels
        let status = 'Đang xác minh';
        let statusClass = 'bg-yellow-500';
        
        if (issue.labels.some(label => label.name === 'verified')) {
          status = 'Đã xác minh';
          statusClass = 'bg-red-500';
        } else if (issue.labels.some(label => label.name === 'resolved')) {
          status = 'Đã giải quyết';
          statusClass = 'bg-green-500';
        } else if (issue.labels.some(label => label.name === 'false-report')) {
          status = 'Báo cáo sai';
          statusClass = 'bg-gray-500';
        }
        
        // Format date
        const reportDate = new Date(issue.created_at).toLocaleDateString('vi-VN');
        
        // Count votes
        const confirmVotes = issue.reactions ? (issue.reactions['+1'] || 0) : 0;
        const denyVotes = issue.reactions ? (issue.reactions['-1'] || 0) : 0;
        
        return `
          <div class="bg-gray-700 rounded-lg p-4 shadow-md" data-issue-number="${issue.number}">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-bold">${minecraftName}</h3>
              <span class="text-xs ${statusClass} text-white px-2 py-1 rounded-full">${status}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <span class="text-gray-400">Discord ID:</span>
                <span>${discordId}</span>
              </div>
              <div>
                <span class="text-gray-400">Ngày báo cáo:</span>
                <span>${reportDate}</span>
              </div>
            </div>
            <div class="border-t border-gray-600 pt-3 mt-3">
              <div class="flex justify-between items-center">
                <div class="flex space-x-4">
                  <button class="vote-btn confirm-btn ${this.api.hasVoted(issue.number) ? 'opacity-50 cursor-not-allowed' : ''}" 
                          data-issue="${issue.number}" 
                          data-vote-type="confirm"
                          ${this.api.hasVoted(issue.number) ? 'disabled' : ''}>
                    <i class="fas fa-thumbs-up text-green-400 mr-1"></i>
                    <span>${confirmVotes}</span>
                  </button>
                  <button class="vote-btn deny-btn ${this.api.hasVoted(issue.number) ? 'opacity-50 cursor-not-allowed' : ''}" 
                          data-issue="${issue.number}" 
                          data-vote-type="deny"
                          ${this.api.hasVoted(issue.number) ? 'disabled' : ''}>
                    <i class="fas fa-thumbs-down text-red-400 mr-1"></i>
                    <span>${denyVotes}</span>
                  </button>
                </div>
                <a href="${issue.html_url}" target="_blank" class="text-blue-400 hover:text-blue-300 text-sm">
                  <i class="fas fa-external-link-alt mr-1"></i>Chi tiết
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      // Update the UI with the search results
      resultsContainer.innerHTML = resultsHTML;
      
      // Add event listeners for voting buttons
      this.setupVoteButtons();
    } catch (error) {
      console.error('Error performing search:', error);
      resultsContainer.innerHTML = `
        <div class="error-message">
          <p><i class="fas fa-exclamation-triangle"></i> Không thể tìm kiếm. Vui lòng thử lại sau.</p>
        </div>
      `;
    }
  }

  // Set up vote buttons event listeners
  setupVoteButtons() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const issueNumber = button.getAttribute('data-issue');
        const voteType = button.getAttribute('data-vote-type');
        
        if (this.api.hasVoted(issueNumber)) {
          alert('Bạn đã bình chọn cho báo cáo này rồi.');
          return;
        }
        
        try {
          // Disable the button during API call
          button.disabled = true;
          button.classList.add('opacity-50');
          
          // Submit vote to GitHub Issues API
          await this.api.voteOnReport(issueNumber, voteType);
          
          // Record the vote in localStorage
          this.api.recordVote(issueNumber, voteType);
          
          // Update the vote count in the UI
          const countSpan = button.querySelector('span');
          countSpan.textContent = (parseInt(countSpan.textContent) + 1).toString();
          
          // Disable all vote buttons for this issue
          const issueContainer = button.closest(`[data-issue-number="${issueNumber}"]`);
          const allButtons = issueContainer.querySelectorAll('.vote-btn');
          allButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
          });
          
          // Update statistics
          this.updateStatistics();
        } catch (error) {
          console.error('Error voting:', error);
          alert('Không thể bình chọn. Vui lòng thử lại sau.');
          
          // Re-enable the button
          button.disabled = false;
          button.classList.remove('opacity-50');
        }
      });
    });
  }

  // Submit a new report
  async submitReport() {
    const reportForm = document.getElementById('report-form');
    if (!reportForm) return;
    
    // Get form data
    const minecraftName = document.getElementById('minecraft-name').value.trim();
    const discordId = document.getElementById('discord-id').value.trim();
    const discordName = document.getElementById('discord-name').value.trim();
    const facebookLink = document.getElementById('facebook-link').value.trim();
    const server = document.getElementById('server').value;
    const proofImages = document.getElementById('proof-images').value.trim();
    const description = document.getElementById('incident-description').value.trim();
    
    // Validate required fields
    if (!minecraftName || !discordId || !proofImages || !description) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    
    try {
      // Disable form during submission
      const submitButton = reportForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner loading-spinner"></i> Đang gửi...';
      
      // Create report data object
      const reportData = {
        minecraftName,
        discordId,
        discordName,
        facebookLink,
        server,
        proofImages,
        description
      };
      
      // Submit report to GitHub Issues API
      const response = await this.api.createReport(reportData);
      
      // Reset form
      reportForm.reset();
      
      // Show success message
      alert('Báo cáo đã được gửi thành công!');
      
      // Update statistics and top scammers
      this.updateStatistics();
      this.updateTopScammers();
      
      // Re-enable form
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(`Không thể gửi báo cáo: ${error.message}`);
      
      // Re-enable form
      const submitButton = reportForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Gửi báo cáo';
    }
  }
}

// Export the class for use in other files
window.CheckScamUI = CheckScamUI;
