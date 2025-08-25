// import './index.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// This handles all the DOM manipulation and user interactions
// Think of it as the conductor of your UI orchestra

class GitHubFinderUI {
  constructor() {
    this.usernameInput = document.getElementById('usernameInput');
    this.fetchButton = document.getElementById('fetchButton');
    this.resultDiv = document.getElementById('result');
    
    this.initializeEventListeners();
    this.focusInput();
  }

  initializeEventListeners() {
    // Button click handler
    this.fetchButton.addEventListener('click', () => this.handleFetchUser());
    
    // Enter key support - because clicking is so last century
    this.usernameInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleFetchUser();
      }
    });

    // Clear error when user starts typing again
    this.usernameInput.addEventListener('input', () => {
      if (this.resultDiv.querySelector('.error')) {
        this.resultDiv.innerHTML = '';
      }
    });
  }

  focusInput() {
    // Small UX touch - focus on input when ready
    this.usernameInput.focus();
  }

  async handleFetchUser() {
    const username = this.usernameInput.value.trim();
    
    // Validation - nobody likes empty searches
    if (!username) {
      this.showError('Please enter a username! 😅');
      return;
    }

    this.setLoadingState(true);
    
    try {
      // This is where the IPC magic happens!
      // We're calling the main process through our secure preload bridge
      const result = await window.electronAPI.fetchGitHubUser(username);
      
      if (result.success) {
        this.displayUserData(result.data);
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError(`Unexpected error: ${error.message}`);
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading) {
    this.fetchButton.disabled = isLoading;
    this.fetchButton.textContent = isLoading ? 'Fetching...' : 'Fetch User Data';
    
    if (isLoading) {
      this.resultDiv.innerHTML = '<div class="loading">🔍 Searching for user...</div>';
    }
  }

  showError(message) {
    this.resultDiv.innerHTML = `
      <div class="error">
        <strong>Oops! Something went wrong:</strong><br>
        ${message}
      </div>
    `;
  }

  displayUserData(user) {
    // Format dates nicely - nobody likes raw ISO strings
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.resultDiv.innerHTML = `
      <div class="user-card">
        <div class="user-header">
          <img src="${user.avatar_url}" alt="${user.name || user.login}" class="avatar">
          <div class="user-info">
            <h2>${user.name || user.login}</h2>
            <div class="username">@${user.login}</div>
            <div>📍 ${user.location || 'Location unknown'}</div>
            <div>📅 Joined ${joinDate}</div>
          </div>
        </div>
        
        ${user.bio ? `<div class="bio"><strong>Bio:</strong> ${user.bio}</div>` : ''}
        
        <div class="stats">
          <div class="stat">
            <div class="stat-number">${user.public_repos || 0}</div>
            <div class="stat-label">Repositories</div>
          </div>
          <div class="stat">
            <div class="stat-number">${user.followers || 0}</div>
            <div class="stat-label">Followers</div>
          </div>
          <div class="stat">
            <div class="stat-number">${user.following || 0}</div>
            <div class="stat-label">Following</div>
          </div>
          <div class="stat">
            <div class="stat-number">${user.public_gists || 0}</div>
            <div class="stat-label">Gists</div>
          </div>
        </div>
        
        ${user.blog ? `<div style="margin-top: 15px;"><strong>Website:</strong> <a href="${user.blog}" target="_blank" rel="noopener">${user.blog}</a></div>` : ''}
      </div>
    `;
  }
}

// Initialize the UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GitHubFinderUI();
});