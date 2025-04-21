// Function to display detailed report view
function showDetailedReport(report) {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
  modalContainer.id = 'detailed-report-modal';
  
  // Create image gallery HTML
  let imageGalleryHTML = '';
  if (report.proof && report.proof.length > 0) {
    imageGalleryHTML = `
      <div class="mt-4">
        <h4 class="font-bold mb-2">Bằng chứng:</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          ${report.proof.map((imageData, index) => `
            <div class="relative">
              <img src="${imageData}" alt="Bằng chứng ${index + 1}" class="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90" 
                onclick="openImageViewer('${imageData}')">
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Format date
  const reportDate = new Date(report.date);
  const formattedDate = reportDate.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Status badge
  let statusBadge = '';
  switch (report.status) {
    case 'verified':
      statusBadge = '<span class="bg-green-500 text-white px-2 py-1 rounded-full">Đã xác minh</span>';
      break;
    case 'pending':
      statusBadge = '<span class="bg-yellow-500 text-white px-2 py-1 rounded-full">Đang xem xét</span>';
      break;
    case 'false-report':
      statusBadge = '<span class="bg-red-500 text-white px-2 py-1 rounded-full">Báo cáo sai</span>';
      break;
    case 'resolved':
      statusBadge = '<span class="bg-blue-500 text-white px-2 py-1 rounded-full">Đã giải quyết</span>';
      break;
    default:
      statusBadge = '<span class="bg-gray-500 text-white px-2 py-1 rounded-full">Không xác định</span>';
  }
  
  // Create modal content
  modalContainer.innerHTML = `
    <div class="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold">${report.name}</h2>
          <button class="text-gray-400 hover:text-white" onclick="closeDetailedReport()">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${statusBadge}
          <span class="bg-gray-600 text-white px-2 py-1 rounded-full">${report.id}</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 class="font-bold mb-2">Thông tin người chơi:</h4>
            <ul class="space-y-2">
              <li><i class="fas fa-user mr-2"></i>Tên Minecraft: <span class="font-semibold">${report.name}</span></li>
              <li><i class="fab fa-discord mr-2"></i>ID Discord: <span class="font-mono">${report.discord}</span></li>
              ${report.discord_name ? `<li><i class="fas fa-tag mr-2"></i>Tên Discord: <span>${report.discord_name}</span></li>` : ''}
              ${report.facebook ? `<li><i class="fab fa-facebook mr-2"></i>Facebook: <a href="${report.facebook}" target="_blank" class="text-blue-400 hover:underline">${report.facebook}</a></li>` : ''}
              <li><i class="fas fa-server mr-2"></i>Server: <span>${report.server}</span></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold mb-2">Thông tin báo cáo:</h4>
            <ul class="space-y-2">
              <li><i class="fas fa-calendar-alt mr-2"></i>Ngày báo cáo: <span>${formattedDate}</span></li>
              <li>
                <i class="fas fa-thumbs-up mr-2 text-green-400"></i>Xác nhận: <span>${report.votes.confirm}</span>
                <i class="fas fa-thumbs-down ml-4 mr-2 text-red-400"></i>Phản đối: <span>${report.votes.deny}</span>
              </li>
            </ul>
            
            <div class="mt-4 flex gap-2">
              <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded" onclick="voteReport('${report.id}', 'confirm')">
                <i class="fas fa-check mr-1"></i>Xác nhận
              </button>
              <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onclick="voteReport('${report.id}', 'deny')">
                <i class="fas fa-times mr-1"></i>Phản đối
              </button>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <h4 class="font-bold mb-2">Mô tả vụ việc:</h4>
          <div class="bg-gray-700 p-3 rounded whitespace-pre-wrap">${report.description}</div>
        </div>
        
        ${imageGalleryHTML}
        
        <div class="mt-6 pt-4 border-t border-gray-700 flex justify-between">
          <div id="github-verification-status">
            <span class="text-gray-400">Xác minh GitHub: </span>
            <span class="text-yellow-400">Chưa xác minh</span>
          </div>
          <div>
            <button id="github-verify-button" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded" onclick="verifyGitHub('${report.id}')">
              <i class="fab fa-github mr-1"></i>Xác minh GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(modalContainer);
  
  // Prevent scrolling on body
  document.body.style.overflow = 'hidden';
}

// Close detailed report modal
function closeDetailedReport() {
  const modal = document.getElementById('detailed-report-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// Open image viewer
function openImageViewer(imageUrl) {
  // Create viewer container
  const viewerContainer = document.createElement('div');
  viewerContainer.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
  viewerContainer.id = 'image-viewer';
  
  // Create viewer content
  viewerContainer.innerHTML = `
    <div class="relative max-w-4xl w-full max-h-screen p-4">
      <button class="absolute top-2 right-2 text-white hover:text-gray-300 z-10" onclick="closeImageViewer()">
        <i class="fas fa-times text-2xl"></i>
      </button>
      <img src="${imageUrl}" alt="Full size image" class="max-w-full max-h-[90vh] mx-auto object-contain">
    </div>
  `;
  
  // Add to document
  document.body.appendChild(viewerContainer);
  
  // Add click event to close on background click
  viewerContainer.addEventListener('click', function(e) {
    if (e.target === viewerContainer) {
      closeImageViewer();
    }
  });
}

// Close image viewer
function closeImageViewer() {
  const viewer = document.getElementById('image-viewer');
  if (viewer) {
    viewer.remove();
  }
}

// Vote on a report
function voteReport(reportId, voteType) {
  // This would be implemented to update the votes in the database
  alert(`Đã ghi nhận ${voteType === 'confirm' ? 'xác nhận' : 'phản đối'} cho báo cáo ${reportId}`);
}

// GitHub verification
function verifyGitHub(reportId) {
  // This would be implemented to verify GitHub ownership
  const verifyButton = document.getElementById('github-verify-button');
  const statusElement = document.getElementById('github-verification-status');
  
  // Show loading state
  verifyButton.disabled = true;
  verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Đang xác minh...';
  
  // Simulate verification process
  setTimeout(() => {
    // Update status
    statusElement.innerHTML = `
      <span class="text-gray-400">Xác minh GitHub: </span>
      <span class="text-green-400">Đã xác minh</span>
    `;
    
    // Update button
    verifyButton.innerHTML = '<i class="fas fa-check mr-1"></i>Đã xác minh';
    verifyButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    verifyButton.classList.add('bg-green-600', 'hover:bg-green-700');
  }, 1500);
}
