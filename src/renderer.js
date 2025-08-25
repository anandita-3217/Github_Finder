import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// This handles all the DOM manipulation and user interactions
// Think of it as the conductor of your UI orchestra

// class GitHubFinderUI {
//   constructor() {
//     this.usernameInput = document.getElementById('usernameInput');
//     this.fetchButton = document.getElementById('fetchButton');
//     this.resultDiv = document.getElementById('result');
    
//     this.initializeEventListeners();
//     this.focusInput();
//   }

//   initializeEventListeners() {
//     // Button click handler
//     this.fetchButton.addEventListener('click', () => this.handleFetchUser());
    
//     // Enter key support - because clicking is so last century
//     this.usernameInput.addEventListener('keypress', (event) => {
//       if (event.key === 'Enter') {
//         this.handleFetchUser();
//       }
//     });

//     // Clear error when user starts typing again
//     this.usernameInput.addEventListener('input', () => {
//       if (this.resultDiv.querySelector('.error')) {
//         this.resultDiv.innerHTML = '';
//       }
//     });
//   }

//   focusInput() {
//     // Small UX touch - focus on input when ready
//     this.usernameInput.focus();
//   }

//   async handleFetchUser() {
//     const username = this.usernameInput.value.trim();
    
//     // Validation - nobody likes empty searches
//     if (!username) {
//       this.showError('Please enter a username! 😅');
//       return;
//     }

//     this.setLoadingState(true);
    
//     try {
//       // This is where the IPC magic happens!
//       // We're calling the main process through our secure preload bridge
//       const result = await window.electronAPI.fetchGitHubUser(username);
      
//       if (result.success) {
//         this.displayUserData(result.data);
//       } else {
//         this.showError(result.error);
//       }
//     } catch (error) {
//       this.showError(`Unexpected error: ${error.message}`);
//     } finally {
//       this.setLoadingState(false);
//     }
//   }

//   setLoadingState(isLoading) {
//     this.fetchButton.disabled = isLoading;
//     this.fetchButton.textContent = isLoading ? 'Fetching...' : 'Fetch User Data';
    
//     if (isLoading) {
//       this.resultDiv.innerHTML = '<div class="loading">🔍 Searching for user...</div>';
//     }
//   }

//   showError(message) {
//     this.resultDiv.innerHTML = `
//       <div class="error">
//         <strong>Oops! Something went wrong:</strong><br>
//         ${message}
//       </div>
//     `;
//   }

//   displayUserData(user) {
//     // Format dates nicely - nobody likes raw ISO strings
//     const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });

//     this.resultDiv.innerHTML = `
//       <div class="user-card">
//         <div class="user-header">
//           <img src="${user.avatar_url}" alt="${user.name || user.login}" class="avatar">
//           <div class="user-info">
//             <h2>${user.name || user.login}</h2>
//             <div class="username">@${user.login}</div>
//             <div>📍 ${user.location || 'Location unknown'}</div>
//             <div>📅 Joined ${joinDate}</div>
//           </div>
//         </div>
        
//         ${user.bio ? `<div class="bio"><strong>Bio:</strong> ${user.bio}</div>` : ''}
        
//         <div class="stats">
//           <div class="stat">
//             <div class="stat-number">${user.public_repos || 0}</div>
//             <div class="stat-label">Repositories</div>
//           </div>
//           <div class="stat">
//             <div class="stat-number">${user.followers || 0}</div>
//             <div class="stat-label">Followers</div>
//           </div>
//           <div class="stat">
//             <div class="stat-number">${user.following || 0}</div>
//             <div class="stat-label">Following</div>
//           </div>
//           <div class="stat">
//             <div class="stat-number">${user.public_gists || 0}</div>
//             <div class="stat-label">Gists</div>
//           </div>
//         </div>
        
//         ${user.blog ? `<div style="margin-top: 15px;"><strong>Website:</strong> <a href="${user.blog}" target="_blank" rel="noopener">${user.blog}</a></div>` : ''}
//       </div>
//     `;
//   }
// }



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
    
    // console.log('🎭 RENDERER: Event listeners attached successfully');
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

console.log('🎭 RENDERER - Full result from IPC:', result);

if (result.success) {
  console.log('🎭 RENDERER - User data received:', result.data);
  console.log('🎭 RENDERER - Avatar URL:', result.data.avatar_url);
  console.log('🎭 RENDERER - Public repos:', result.data.public_repos);
  
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
    
    console.log('User data displayed successfully! ✅');
  }
}

// Initialize the UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing GitHubFinderUI...');
  new GitHubFinderUI();
});

console.log('Renderer script setup complete! 🎉');