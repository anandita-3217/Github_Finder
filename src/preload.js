// const { contextBridge, ipcRenderer } = require('electron');
// const { fetchGitHubUser } = require('./githubfinder');

// contextBridge.exposeInMainWorld('electronAPI',{
//   fetchGitHubUser: (username) => ipcRenderer.invoke('fetch-github-user',username),
// });

// console.log('🔗 Preload script loaded - GitHub API bridge ready!');
const { contextBridge, ipcRenderer } = require('electron');

// This is like a secure phone line between renderer and main process
// Think of it as a bouncer that only lets approved messages through
contextBridge.exposeInMainWorld('electronAPI', {
  // Expose a safe way to fetch GitHub users
  fetchGitHubUser: (username) => ipcRenderer.invoke('fetch-github-user', username),
  
  // You can add more API methods here as your app grows
  // getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  // saveUserPreferences: (prefs) => ipcRenderer.invoke('save-prefs', prefs)
});

// Fun fact: This creates a global `window.electronAPI` object in your renderer!