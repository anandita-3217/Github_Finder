// preload.js - The secure bridge between processes 🌉
const { contextBridge, ipcRenderer } = require('electron');

console.log('🔧 Preload script starting...');

// Test if contextBridge is available
if (!contextBridge) {
  console.error('❌ contextBridge is not available!');
} else {
  console.log('✅ contextBridge is available');
}

// Test if ipcRenderer is available
if (!ipcRenderer) {
  console.error('❌ ipcRenderer is not available!');
} else {
  console.log('✅ ipcRenderer is available');
}

try {
  // Expose GitHub API methods to your renderer process
  contextBridge.exposeInMainWorld('githubAPI', {
    // Get a single user's profile
    getUser: async (username) => {
      console.log(`🔍 Preload: Requesting user ${username}`);
      try {
        const result = await ipcRenderer.invoke('github-get-user', username);
        console.log(`✅ Preload: Got user result for ${username}`, result.success);
        return result;
      } catch (error) {
        console.error(`❌ Preload: Error getting user ${username}:`, error);
        return { success: false, error: error.message };
      }
    },
    
    // Get user's repositories with language data
    getRepos: async (username) => {
      console.log(`🔍 Preload: Requesting repos for ${username}`);
      try {
        const result = await ipcRenderer.invoke('github-get-repos', username);
        console.log(`✅ Preload: Got repos result for ${username}`, result.success);
        return result;
      } catch (error) {
        console.error(`❌ Preload: Error getting repos for ${username}:`, error);
        return { success: false, error: error.message, languages: {} };
      }
    },
    
    // Get contribution data
    getContributions: async (username) => {
      console.log(`🔍 Preload: Requesting contributions for ${username}`);
      try {
        const result = await ipcRenderer.invoke('github-get-contributions', username);
        console.log(`✅ Preload: Got contributions result for ${username}`, result.success);
        return result;
      } catch (error) {
        console.error(`❌ Preload: Error getting contributions for ${username}:`, error);
        return { success: false, data: { currentStreak: 0, totalContributions: 0 } };
      }
    }
  });

  console.log('🚀 Preload script loaded - GitHub API ready!');
  
  // Test if the API was properly exposed
  if (typeof window !== 'undefined') {
    // This won't work in preload, but we can set up a test for the renderer
    console.log('✅ Window object available, API should be accessible to renderer');
  }

} catch (error) {
  console.error('❌ Error in preload script:', error);
}

// The GitHub API is exposed and ready!
// Note: window.githubAPI might not be immediately available at DOMContentLoaded
// but it will be available when the renderer actually tries to use it