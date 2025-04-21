// Main JavaScript file for CheckScam Minecraft
// This file initializes the GitHub Issues API integration and UI components

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create GitHub Issues API instance
  const githubApi = new GitHubIssuesAPI();
  
  // Create UI instance with the API
  const ui = new CheckScamUI(githubApi);
  
  // Store instances in window for debugging
  window.checkScamApp = {
    api: githubApi,
    ui: ui
  };
  
  console.log('CheckScam Minecraft application initialized');
});

// Helper function to show/hide sections based on hash
function handleHashChange() {
  const hash = window.location.hash || '#';
  const sections = ['#search', '#report', '#about'];
  
  sections.forEach(section => {
    const element = document.querySelector(section);
    if (element) {
      if (hash === section) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Initial hash handling
handleHashChange();
