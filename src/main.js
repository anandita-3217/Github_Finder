const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// 🚀 REGISTER IPC HANDLERS IMMEDIATELY (before app ready)
console.log('Registering IPC handlers...');

ipcMain.handle('github-get-user', async (event, username) => {
  console.log(`🔍 Main process: Fetching GitHub user: ${username}`);
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'GitHub-Explorer-Electron-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const userData = await response.json();
    console.log(`✅ Main process: Successfully fetched user ${username}`);
    return { success: true, data: userData };
    
  } catch (error) {
    console.error('❌ Main process GitHub API Error:', error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('github-get-repos', async (event, username) => {
  console.log(`🔍 Main process: Fetching repos for ${username}`);
  
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'User-Agent': 'GitHub-Explorer-Electron-App',
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    
    // Count languages (like your React version)
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    console.log(`✅ Main process: Successfully fetched ${repos.length} repos for ${username}`);
    return { success: true, data: repos, languages };
    
  } catch (error) {
    console.error('❌ Main process GitHub Repos Error:', error.message);
    return { success: false, error: error.message, languages: {} };
  }
});

ipcMain.handle('github-get-contributions', async (event, username) => {
  console.log(`🔍 Main process: Fetching contributions for ${username}`);
  
  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
      headers: {
        'User-Agent': 'GitHub-Explorer-Electron-App'
      }
    });

    if (!response.ok) {
      throw new Error('Contributions API unavailable');
    }

    const data = await response.json();
    const contributionData = {
      currentStreak: data.contributions?.[0]?.contributionDays?.length || 0,
      totalContributions: data.total?.contributions || 0
    };
    
    console.log(`✅ Main process: Successfully fetched contributions for ${username}`);
    return { success: true, data: contributionData };
    
  } catch (error) {
    console.error('❌ Main process Contributions Error:', error.message);
    return { success: false, data: { currentStreak: 0, totalContributions: 0 } };
  }
});

console.log('✅ All IPC handlers registered!');

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  console.log('🚀 App is ready, creating window...');
  createWindow();

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

console.log('📝 Main process script fully loaded!');