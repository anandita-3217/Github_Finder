const { contextBridge, ipcRenderer } = require('electron');

// Expose GitHub API methods to your renderer process
contextBridge.exposeInMainWorld('githubAPI', {
  // Get a single user's profile
  getUser: (username) => ipcRenderer.invoke('github-get-user', username),
  
  // Get user's repositories
  getRepos: (username, page = 1, perPage = 10) => 
    ipcRenderer.invoke('github-get-repos', username, page, perPage),
  
  // Search for users
  searchUsers: (query, page = 1) => 
    ipcRenderer.invoke('github-search-users', query, page)
});

console.log('🔗 Preload script loaded - GitHub API bridge ready!');