const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded! 🚀');
contextBridge.exposeInMainWorld('electronAPI', {
fetchGitHubUser: async (username) => {
  try {
    const result = await ipcRenderer.invoke('fetch-github-user', username);
    // console.log('🛡️ PRELOAD: Got result from main:', result);
    
    // 🔍 LOG THE ACTUAL DATA
    if (result.success) {
      // console.log('🛡️ PRELOAD: User data:', result.data);
    }
    
    return result;
  } catch (error) {
    console.error('🛡️ PRELOAD: Error:', error);
    return { success: false, error: error.message };
  }
},
  
  // Bonus methods for future expansion
  fetchGitHubRepos: async (username, options) => {
    console.log('Preload: fetchGitHubRepos called with:', username, options);
    try {
      const result = await ipcRenderer.invoke('fetch-github-repos', username, options);
      return result;
    } catch (error) {
      console.error('Preload: Error in fetchGitHubRepos:', error);
      return { success: false, error: error.message };
    }
  },
  
  clearCache: async () => {
    console.log('Preload: clearCache called');
    try {
      const result = await ipcRenderer.invoke('clear-github-cache');
      return result;
    } catch (error) {
      console.error('Preload: Error in clearCache:', error);
      return { success: false, error: error.message };
    }
  },
  
  getCacheStats: async () => {
    console.log('Preload: getCacheStats called');
    try {
      const result = await ipcRenderer.invoke('get-cache-stats');
      return result;
    } catch (error) {
      console.error('Preload: Error in getCacheStats:', error);
      return { success: false, error: error.message };
    }
  }
});

console.log('electronAPI exposed to window object! ✅');

// Fun fact: This creates a global `window.electronAPI` object in your renderer!