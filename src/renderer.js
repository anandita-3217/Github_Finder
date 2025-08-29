
// renderer.js
// import { use } from 'react';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
class GitHubFinderUI {
  constructor() {
    console.log('GitHubFinderUI constructor called');
    
    // Check if electronAPI is available
    if (!window.electronAPI) {
      console.error('electronAPI is not available! Check your preload script.');
      this.showError('Application initialization error. Please restart the app.');
      return;
    }
    
    this.usernameInput = document.getElementById('usernameInput');
    this.fetchButton = document.getElementById('fetchButton');
    this.testButton = document.getElementById('testButton');
    this.resultDiv = document.getElementById('result');
    
    console.log('🎭 RENDERER: DOM elements found:');
    console.log('  - usernameInput:', !!this.usernameInput);
    console.log('  - fetchButton:', !!this.fetchButton);
    console.log('  - testButton:', !!this.testButton);
    console.log('  - resultDiv:', !!this.resultDiv);
    
    if (!this.usernameInput || !this.fetchButton || !this.resultDiv) {
      console.error('🎭 RENDERER: Required DOM elements not found!');
      return;
    }
    
    console.log('DOM elements found, initializing...');
    this.initializeEventListeners();
    this.focusInput();
    
    console.log('GitHubFinderUI initialized successfully! ✅');
  }

  initializeEventListeners() {
    // Button click handler
    this.fetchButton.addEventListener('click', () => {
      console.log('🎭 RENDERER: Fetch button clicked');
      this.handleFetchUser();
    });
    
    // Test button for IPC
    if (this.testButton) {
      this.testButton.addEventListener('click', async () => {
        console.log('🎭 RENDERER: Test button clicked');
        try {
          if (window.electronAPI && window.electronAPI.fetchGitHubUser) {
            console.log('🎭 RENDERER: Testing IPC with octocat...');
            this.setLoadingState(true);
            const result = await window.electronAPI.fetchGitHubUser('octocat');
            console.log('🎭 RENDERER: Test result:', result);
            
            if (result.success) {
              this.showError(`✅ IPC Test Success! Got data for: ${result.data.login}`);
            } else {
              this.showError(`❌ IPC Test Failed: ${result.error}`);
            }
          } else {
            this.showError('❌ electronAPI not available');
          }
        } catch (error) {
          console.error('🎭 RENDERER: Test button error:', error);
          this.showError(`❌ Test Error: ${error.message}`);
        } finally {
          this.setLoadingState(false);
        }
      });
    }
    
    // Enter key support - because clicking is so last century
    this.usernameInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        console.log('🎭 RENDERER: Enter key pressed');
        this.handleFetchUser();
      }
    });

    // Clear error when user starts typing again
    this.usernameInput.addEventListener('input', () => {
      if (this.resultDiv.querySelector('.error')) {
        this.resultDiv.innerHTML = '';
      }
    });
    
    console.log('🎭 RENDERER: Event listeners attached successfully');
  }

  focusInput() {
    // Small UX touch - focus on input when ready
    this.usernameInput.focus();
  }

  async handleFetchUser() {
    const username = this.usernameInput.value.trim();
    console.log('handleFetchUser called with username:', username);
    
    // Validation - nobody likes empty searches
    if (!username) {
      this.showError('Please enter a username! 😅');
      return;
    }

    this.setLoadingState(true);
    
    try {
      console.log('Calling electronAPI.fetchGitHubUser...');
      
      // Check if electronAPI is still available
      if (!window.electronAPI || !window.electronAPI.fetchGitHubUser) {
        throw new Error('electronAPI not available');
      }
      
      // This is where the IPC magic happens!
      // We're calling the main process through our secure preload bridge
      const result = await window.electronAPI.fetchGitHubUser(username);
      console.log('Got result from electronAPI:', result);
      // Right after this line:
// const result = await window.electronAPI.fetchGitHubUser(username);

// console.log('🎭 RENDERER - Full result from IPC:', result);

if (result.success) {
  // console.log('🎭 RENDERER - User data received:', result.data);
  // console.log('🎭 RENDERER - Avatar URL:', result.data.avatar_url);
  // console.log('🎭 RENDERER - Public repos:', result.data.public_repos);
  
  this.displayUserData(result.data);
}
      
      if (result.success) {
        console.log('Success! Displaying user data');
        this.displayUserData(result.data);
      } else {
        console.log('API returned error:', result.error);
        this.showError(result.error);
      }
    } catch (error) {
      console.error('Error in handleFetchUser:', error);
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
    console.log('Displaying user data:', user);

    // Clear old results
    this.resultDiv.innerHTML = '';

    // Format join date
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Card container
    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    // Header
    const header = document.createElement('div');
    header.className = 'user-header';
    userCard.appendChild(header);

    // Info container
    const info = document.createElement('div');
    info.className = 'user-info';
    header.appendChild(info);

    // Name
    const nameEl = document.createElement('h2');
    nameEl.textContent = user.name || user.login;
    info.appendChild(nameEl);

    // Avatar
    const avatar = document.createElement('img');
    avatar.src = user.avatar_url;
    avatar.alt = user.name || user.login;
    avatar.className = 'avatar';
    avatar.addEventListener('error', () => {
      console.log('Image failed to load:', avatar.src);
      avatar.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23ddd'/%3E%3Ctext x='40' y='40' text-anchor='middle' dy='0.3em'%3E👤%3C/text%3E%3C/svg%3E";
    });
    info.appendChild(avatar);

    // Username
    const usernameEl = document.createElement('div');
    usernameEl.className = 'username';
    usernameEl.textContent = `@${user.login}`;
    info.appendChild(usernameEl);

    // Location
    const locationEl = document.createElement('div');
    locationEl.textContent = `📍 ${user.location || 'Location unknown'}`;
    info.appendChild(locationEl);

    // Join date
    const joinEl = document.createElement('div');
    joinEl.textContent = `📅 Joined ${joinDate}`;
    info.appendChild(joinEl);

    // Bio
    if (user.bio) {
      const bioEl = document.createElement('div');
      bioEl.className = 'bio';
      bioEl.innerHTML = `<strong>Bio:</strong> ${user.bio}`;
      userCard.appendChild(bioEl);
    }

    // Stats
    const stats = document.createElement('div');
    stats.className = 'stats';

    const makeStat = (num, label) => {
      const stat = document.createElement('div');
      stat.className = 'stat';

      const numEl = document.createElement('div');
      numEl.className = 'stat-number';
      numEl.textContent = num;

      const labelEl = document.createElement('div');
      labelEl.className = 'stat-label';
      labelEl.textContent = label;

      stat.appendChild(numEl);
      stat.appendChild(labelEl);
      return stat;
    };

    stats.appendChild(makeStat(user.public_repos || 0, 'Repositories'));
    stats.appendChild(makeStat(user.followers || 0, 'Followers'));
    stats.appendChild(makeStat(user.following || 0, 'Following'));
    stats.appendChild(makeStat(user.public_gists || 0, 'Gists'));

    userCard.appendChild(stats);
  // Repositories button
  if (user.public_repos > 0) {
    const reposButton = document.createElement('button');
    reposButton.textContent = `View ${user.public_repos} Repositories`;
    reposButton.className = 'repos-button';
    reposButton.addEventListener('click', () => this.loadUserRepos(user.login));
    userCard.appendChild(reposButton);
  }

    // Blog
    if (user.blog) {
      const blogEl = document.createElement('div');
      blogEl.style.marginTop = '15px';
      blogEl.innerHTML = `<strong>Website:</strong> <a href="${user.blog}" target="_blank" rel="noopener">${user.blog}</a>`;
      userCard.appendChild(blogEl);
    }

    // Append final card
    this.resultDiv.appendChild(userCard);

    console.log('User data displayed successfully! ✅');
  }

  async loadUserRepos(username) {
    console.log(`🔍 Loading repositories for ${username}`);

    try {
      // Show loading state
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading';
      loadingDiv.textContent = '📂 Loading repositories...';
      loadingDiv.style.marginTop = '20px';
      this.resultDiv.appendChild(loadingDiv);

      // Fetch repos using our existing API
      const result = await window.electronAPI.fetchGitHubRepos(username, {
        perPage: 10,
        sort: 'updated'
      });

      // Remove loading
      loadingDiv.remove();

      if (result.success) {
        this.displayUserRepos(result.data);
      } else {
        this.showError(`Failed to load repositories: ${result.error}`);
      }

    } catch (error) {
      console.error('Error loading repos:', error);
      this.showError(`Error loading repositories: ${error.message}`);
    }
  }

  displayUserRepos(repos) {
    console.log(`📂 Displaying ${repos.length} repositories`);

    // Create repos container
    const reposContainer = document.createElement('div');
    reposContainer.className = 'repos-container';

    // Title
    const title = document.createElement('h3');
    title.textContent = `📂 Latest Repositories (${repos.length})`;
    reposContainer.appendChild(title);

    // Repos list
    repos.forEach(repo => {
      const repoItem = document.createElement('div');
      repoItem.className = 'repo-item';
      // Repo name (clickable)
      const nameLink = document.createElement('a');
      nameLink.href = repo.html_url;
      nameLink.target = '_blank';
      nameLink.rel = 'noopener';
      nameLink.textContent = repo.name;

      // Description
      const description = document.createElement('div');
      description.textContent = repo.description || 'No description available';
      description.style.cssText = `
        color: #666;
        margin: 5px 0;
        font-size: 0.9em;
      `;

      // Stats row
      const statsRow = document.createElement('div');
      statsRow.style.cssText = `
        display: flex;
        gap: 15px;
        margin-top: 8px;
        font-size: 0.8em;
        color: #666;
      `;

      // Language
      if (repo.language) {
        const lang = document.createElement('span');
        lang.innerHTML = `🔤 ${repo.language}`;
        statsRow.appendChild(lang);
      }

      // Stars
      const stars = document.createElement('span');
      stars.innerHTML = `⭐ ${repo.stargazers_count}`;
      statsRow.appendChild(stars);

      // Forks
      const forks = document.createElement('span');
      forks.innerHTML = `🍴 ${repo.forks_count}`;
      statsRow.appendChild(forks);

      // Updated date
      const updated = document.createElement('span');
      const updateDate = new Date(repo.updated_at).toLocaleDateString();
      updated.innerHTML = `📅 ${updateDate}`;
      statsRow.appendChild(updated);

      // Assemble repo item
      repoItem.appendChild(nameLink);
      repoItem.appendChild(description);
      repoItem.appendChild(statsRow);

      reposContainer.appendChild(repoItem);
    });

    this.resultDiv.appendChild(reposContainer);
  }

}

// Initialize the UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing GitHubFinderUI...');
  new GitHubFinderUI();
});

console.log('Renderer script setup complete! 🎉');