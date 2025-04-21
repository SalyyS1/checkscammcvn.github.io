// Report submission system for CheckScamMCVN
document.addEventListener('DOMContentLoaded', function() {
  // Import GitHub integration
  const GitHubReportSubmission = typeof module !== 'undefined' ? 
    require('./github-integration.js') : window.GitHubReportSubmission;
  
  // DOM Elements
  const reportForm = document.getElementById('report-form');
  const submitButton = reportForm ? reportForm.querySelector('button[type="submit"]') : null;
  
  // Initialize GitHub integration
  const github = new GitHubReportSubmission('checkscammcvn', 'checkscammcvn.github.io');
  
  // Initialize report form
  if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Disable submit button to prevent multiple submissions
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...';
      }
      
      submitReport();
    });
  }
  
  // Submit report function
  async function submitReport() {
    // Get form data
    const formData = {
      minecraftName: document.getElementById('minecraft-name').value.trim(),
      discordId: document.getElementById('discord-id').value.trim(),
      discordName: document.getElementById('discord-name').value.trim(),
      facebookLink: document.getElementById('facebook-link').value.trim(),
      server: document.getElementById('server').value,
      proofImages: document.getElementById('proof-images').value.trim(),
      description: document.getElementById('incident-description').value.trim()
    };
    
    // Validate required fields
    if (!formData.minecraftName || !formData.discordId || !formData.proofImages || !formData.description) {
      showNotification('error', 'Vui lòng điền đầy đủ các trường bắt buộc');
      resetSubmitButton();
      return;
    }
    
    // Validate Discord ID format (numbers only)
    if (!/^\d+$/.test(formData.discordId)) {
      showNotification('error', 'ID Discord phải là dãy số');
      resetSubmitButton();
      return;
    }
    
    try {
      // Fetch existing reports to generate new ID
      const response = await fetch('data/reports.json');
      if (!response.ok) {
        throw new Error('Failed to fetch reports data');
      }
      
      const existingReports = await response.json();
      
      // Submit report through GitHub integration
      const result = await github.submitReport(formData, existingReports);
      
      if (result.success) {
        // Show success message
        showNotification('success', 'Báo cáo đã được gửi thành công! Pull Request đã được tạo trên GitHub và đang chờ xét duyệt.');
        
        // Reset form
        reportForm.reset();
        
        // Show additional information
        showGitHubPRInfo(result.prUrl);
      } else {
        // Show error message
        showNotification('error', `Lỗi khi gửi báo cáo: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showNotification('error', `Lỗi khi gửi báo cáo: ${error.message}`);
    } finally {
      resetSubmitButton();
    }
  }
  
  // Reset submit button
  function resetSubmitButton() {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Gửi báo cáo';
    }
  }
  
  // Show notification
  function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white max-w-md z-50 fade-in`;
    
    // Add notification content
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="mr-2">
          <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div>
          <p>${message}</p>
        </div>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
  
  // Show GitHub PR information
  function showGitHubPRInfo(prUrl) {
    // Create info element
    const infoElement = document.createElement('div');
    infoElement.className = 'mt-6 p-4 bg-blue-900 rounded-lg fade-in';
    
    // Add info content
    infoElement.innerHTML = `
      <h3 class="font-bold mb-2">Báo cáo đã được gửi thành công!</h3>
      <p class="mb-2">Pull Request đã được tạo trên GitHub và đang chờ xét duyệt.</p>
      <p class="text-sm">Trong môi trường thực tế, bạn có thể theo dõi trạng thái của báo cáo tại:</p>
      <a href="${prUrl || '#'}" target="_blank" class="text-blue-300 hover:text-blue-200 block mt-2">
        <i class="fab fa-github mr-1"></i>${prUrl || 'GitHub Pull Request'}
      </a>
      <p class="text-sm text-gray-400 mt-4">Lưu ý: Báo cáo sẽ được kiểm duyệt trước khi được công khai để đảm bảo tính chính xác.</p>
    `;
    
    // Add after form
    reportForm.parentElement.appendChild(infoElement);
    
    // Scroll to info
    infoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
