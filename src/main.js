const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // Webpack magic variable
    },
  });

  // Load the webpack-built renderer
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // Webpack magic variable

  // Open DevTools in development
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }
};

// GitHub API handlers - The main process handles all API calls
// ipcMain.handle('github-get-user', async (event, username) => {
//   try {
//     console.log(`🔍 Fetching GitHub user: ${username}`);
    
//     const response = await fetch(`https://api.github.com/users/${username}`, {
//       headers: {
//         'User-Agent': 'Electron-GitHub-App',
//         'Accept': 'application/vnd.github.v3+json'
//       }
//     });

//     if (!response.ok) {
//       if (response.status === 404) {
//         throw new Error('User not found');
//       }
//       throw new Error(`GitHub API error: ${response.status}`);
//     }

//     const userData = await response.json();
//     return { success: true, data: userData };
    
//   } catch (error) {
//     console.error('GitHub API Error:', error.message);
//     return { success: false, error: error.message };
//   }
// });

// // Get user's repositories
// ipcMain.handle('github-get-repos', async (event, username, page = 1, perPage = 10) => {
//   try {
//     console.log(`📚 Fetching repos for ${username}, page ${page}`);
    
//     const response = await fetch(
//       `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`,
//       {
//         headers: {
//           'User-Agent': 'Electron-GitHub-App',
//           'Accept': 'application/vnd.github.v3+json'
//         }
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`GitHub API error: ${response.status}`);
//     }

//     const repos = await response.json();
//     return { success: true, data: repos };
    
//   } catch (error) {
//     console.error('GitHub Repos Error:', error.message);
//     return { success: false, error: error.message };
//   }
// });

// // Search GitHub users
// ipcMain.handle('github-search-users', async (event, query, page = 1) => {
//   try {
//     console.log(`🔎 Searching GitHub users: ${query}`);
    
//     const response = await fetch(
//       `https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=15`,
//       {
//         headers: {
//           'User-Agent': 'Electron-GitHub-App',
//           'Accept': 'application/vnd.github.v3+json'
//         }
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`GitHub API error: ${response.status}`);
//     }

//     const searchResults = await response.json();
//     return { success: true, data: searchResults };
    
//   } catch (error) {
//     console.error('GitHub Search Error:', error.message);
//     return { success: false, error: error.message };
//   }
// });

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window when the dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('🐙 GitHub Electron App - Main process ready!');