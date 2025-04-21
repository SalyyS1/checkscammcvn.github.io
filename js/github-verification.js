// GitHub verification functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in to GitHub
  let isGitHubLoggedIn = false;
  let currentGitHubUser = null;
  
  // Function to simulate GitHub login
  window.loginWithGitHub = function() {
    // In a real implementation, this would redirect to GitHub OAuth
    // For demo purposes, we'll simulate a successful login
    simulateGitHubLogin();
  };
  
  // Simulate GitHub login
  function simulateGitHubLogin() {
    // Show loading state
    const loginButton = document.getElementById('github-login-button');
    if (loginButton) {
      loginButton.disabled = true;
      loginButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Đang đăng nhập...';
    }
    
    // Simulate API delay
    setTimeout(() => {
      // Set logged in state
      isGitHubLoggedIn = true;
      currentGitHubUser = {
        username: 'example-user',
        avatar: 'https://avatars.githubusercontent.com/u/12345678',
        id: '12345678'
      };
      
      // Update UI
      updateGitHubLoginUI();
      
      // If there's a verification button, update it
      updateVerificationButtons();
    }, 1500);
  }
  
  // Update GitHub login UI
  function updateGitHubLoginUI() {
    const loginContainer = document.getElementById('github-login-container');
    if (!loginContainer) return;
    
    if (isGitHubLoggedIn && currentGitHubUser) {
      loginContainer.innerHTML = `
        <div class="flex items-center">
          <img src="${currentGitHubUser.avatar}" alt="${currentGitHubUser.username}" class="w-8 h-8 rounded-full mr-2">
          <span class="text-sm">${currentGitHubUser.username}</span>
          <button id="github-logout-button" class="ml-3 text-xs text-red-400 hover:text-red-300" onclick="logoutFromGitHub()">
            <i class="fas fa-sign-out-alt mr-1"></i>Đăng xuất
          </button>
        </div>
      `;
    } else {
      loginContainer.innerHTML = `
        <button id="github-login-button" class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm" onclick="loginWithGitHub()">
          <i class="fab fa-github mr-1"></i>Đăng nhập với GitHub
        </button>
      `;
    }
  }
  
  // Update verification buttons
  function updateVerificationButtons() {
    const verifyButtons = document.querySelectorAll('.github-verify-button');
    verifyButtons.forEach(button => {
      if (isGitHubLoggedIn) {
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
        button.setAttribute('title', 'Đăng nhập GitHub để xác minh');
      }
    });
  }
  
  // Logout from GitHub
  window.logoutFromGitHub = function() {
    // In a real implementation, this would clear the session
    isGitHubLoggedIn = false;
    currentGitHubUser = null;
    
    // Update UI
    updateGitHubLoginUI();
    updateVerificationButtons();
  };
  
  // Verify GitHub ownership
  window.verifyGitHub = function(reportId) {
    if (!isGitHubLoggedIn) {
      alert('Vui lòng đăng nhập GitHub để xác minh');
      return;
    }
    
    const verifyButton = document.getElementById('github-verify-button');
    const statusElement = document.getElementById('github-verification-status');
    
    if (!verifyButton || !statusElement) return;
    
    // Show loading state
    verifyButton.disabled = true;
    verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Đang xác minh...';
    
    // In a real implementation, this would check if the current GitHub user
    // is the owner of the repository or has the necessary permissions
    
    // For demo purposes, we'll simulate a verification check
    setTimeout(() => {
      // Check if the current user is the owner (in this case, always true for demo)
      const isOwner = true;
      
      if (isOwner) {
        // Update status
        statusElement.innerHTML = `
          <span class="text-gray-400">Xác minh GitHub: </span>
          <span class="text-green-400">Đã xác minh</span>
        `;
        
        // Update button
        verifyButton.innerHTML = '<i class="fas fa-check mr-1"></i>Đã xác minh';
        verifyButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        verifyButton.classList.add('bg-green-600', 'hover:bg-green-700');
        
        // In a real implementation, this would update the report status in the database
        alert('Báo cáo đã được xác minh thành công!');
      } else {
        // Update status for non-owners
        statusElement.innerHTML = `
          <span class="text-gray-400">Xác minh GitHub: </span>
          <span class="text-red-400">Không có quyền xác minh</span>
        `;
        
        // Reset button
        verifyButton.disabled = false;
        verifyButton.innerHTML = '<i class="fab fa-github mr-1"></i>Xác minh GitHub';
        
        alert('Bạn không có quyền xác minh báo cáo này.');
      }
    }, 1500);
  };
  
  // Add GitHub login container to the page
  function addGitHubLoginContainer() {
    const headerNav = document.querySelector('header nav ul');
    if (!headerNav) return;
    
    const loginItem = document.createElement('li');
    loginItem.className = 'ml-4';
    loginItem.innerHTML = `<div id="github-login-container"></div>`;
    headerNav.appendChild(loginItem);
    
    // Initialize login UI
    updateGitHubLoginUI();
  }
  
  // Initialize GitHub verification
  function initGitHubVerification() {
    // Add GitHub login container
    addGitHubLoginContainer();
    
    // Initialize verification buttons
    updateVerificationButtons();
  }
  
  // Initialize when DOM is loaded
  initGitHubVerification();
});
