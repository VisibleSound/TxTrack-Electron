// electron/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) app.quit();

const isDev = process.env.NODE_ENV === 'development';
let mainWindow;

const createWindow = () => {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        // Open DevTools in development mode
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
};

// Create window when Electron is ready
app.whenReady().then(() => {
    createWindow();

    // Set up auto-updater events
    if (!isDev) {
        setupAutoUpdater();
    }

    app.on('activate', () => {
        // On macOS re-create a window when dock icon is clicked and no other windows are open
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for any Electron-specific functionality
ipcMain.handle('get-app-path', () => app.getPath('userData'));

// Set up auto-updater with appropriate event handlers
function setupAutoUpdater() {
    // Configure logging
    autoUpdater.logger = require('electron-log');
    autoUpdater.logger.transports.file.level = 'info';

    // Auto download updates
    autoUpdater.autoDownload = true;

    // Check for updates when app starts
    autoUpdater.checkForUpdatesAndNotify();

    // Set up a timer to check for updates every hour
    setInterval(() => {
        autoUpdater.checkForUpdatesAndNotify();
    }, 60 * 60 * 1000);

    // Auto updater events
    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info);
    });

    autoUpdater.on('update-not-available', (info) => {
        console.log('Update not available:', info);
    });

    autoUpdater.on('error', (err) => {
        console.log('Error in auto-updater:', err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
        logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
        logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
        console.log(logMessage);
    });

    autoUpdater.on('update-downloaded', (info) => {
        console.log('Update downloaded');

        // Prompt user to restart application
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Ready',
            message: 'A new version of TxTrack has been downloaded. Restart the application to apply the updates.',
            buttons: ['Restart', 'Later']
        }).then(result => {
            // If user clicked "Restart"
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });
}