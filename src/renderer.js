/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
document.addEventListener('DOMContentLoaded', () => {
    console.log('Simple GitHub Explorer loaded! 🚀');
    
    // All the logic is already in the HTML file
    // This file exists just in case you want to separate concerns
    
    // You can move the JavaScript from the HTML file here if you prefer
    // Just remember to include this script in your HTML:
    // <script src="renderer.js"></script>
});

console.log('👋 This message is being logged by "renderer.js", included via webpack');
