const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { GitHubFinder } = require('./githubfinder');

// Keep a global reference of the window object
let mainWindow;

// Create a single instance of GitHubFinder to reuse (with caching benefits!)
const githubFinder = new GitHubFinder({
  userAgent: 'Electron GitHub Finder v1.0',
  timeout: 15000, // 15 seconds timeout
  cacheTimeout: 600000 // 10 minutes cache
});

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false, // Security best practice
      contextIsolation: true, // Security best practice
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // webSecurity: false,
      // additionalArguments: ['--disable-web-security'] 
    }
  });

  // Load the index.html
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// This is where the magic happens - IPC handlers! ✨
ipcMain.handle('fetch-github-user', async (event, username) => {
  try {
    // console.log(`Main process: Fetching data for ${username}`);
    const userData = await githubFinder.fetchUser(username);
    
    // 🔍 LOG THE DATA HERE
    // console.log('🏠 MAIN PROCESS - Got user data:', userData);
    // console.log('🏠 MAIN PROCESS - User login:', userData.login);
    // console.log('🏠 MAIN PROCESS - Followers:', userData.followers);
    
    return { success: true, data: userData };
  } catch (error) {
    console.error('Main process error:', error.message);
    return { success: false, error: error.message };
  }
});

// Bonus IPC handlers for the extra methods!
ipcMain.handle('fetch-github-repos', async (event, username, options) => {
  try {
    console.log(`Main process: Fetching repos for ${username}`);
    const repos = await githubFinder.fetchUserRepos(username, options);
    return { success: true, data: repos };
  } catch (error) {
    console.error('Main process error:', error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('clear-github-cache', async (event) => {
  try {
    githubFinder.clearCache();
    return { success: true, message: 'Cache cleared successfully!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-cache-stats', async (event) => {
  try {
    const stats = githubFinder.getCacheStats();
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// App event listeners
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});