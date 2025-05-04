// electron/main.js
const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Set up logging
let logger;
try {
    const electronLog = require('electron-log');
    logger = electronLog;
    logger.transports.file.level = 'debug';
    logger.catchErrors({
        showDialog: false,
        onError(error, versions, submitIssue) {
            logger.error(`Uncaught error: ${error.message}`);
            logger.error(error.stack);
        }
    });
} catch (err) {
    console.error('Failed to initialize electron-log:', err);
    logger = console;
}

// Utility function to check if dependencies are available
function checkDependencies() {
    // List of dependencies that should be available at runtime
    const dependencies = [
        'electron-updater',
        'electron-squirrel-startup',
        'electron-log'
    ];

    const missing = [];

    // Check each dependency
    dependencies.forEach(dep => {
        try {
            require.resolve(dep);
            logger.info(`Dependency available: ${dep}`);
        } catch (e) {
            missing.push(dep);
            logger.error(`Missing dependency: ${dep}`);
        }
    });

    // Log all missing dependencies
    if (missing.length > 0) {
        logger.error(`Missing dependencies: ${missing.join(', ')}`);
    } else {
        logger.info('All dependencies available');
    }
}

// Check dependencies when app starts
checkDependencies();

// App information
logger.info('App starting...');
logger.info(`Running in ${process.env.NODE_ENV === 'development' ? 'development' : 'production'} mode`);
logger.info(`App version: ${app.getVersion()}`);
logger.info(`Electron version: ${process.versions.electron}`);
logger.info(`Node version: ${process.versions.node}`);
logger.info(`Platform: ${process.platform}`);
logger.info(`Architecture: ${process.arch}`);

// Handle creating/removing shortcuts on Windows when installing/uninstalling
try {
    // Safely require electron-squirrel-startup
    const squirrelStartup = require('electron-squirrel-startup');
    if (squirrelStartup) app.quit();
} catch (err) {
    logger.warn('electron-squirrel-startup not available:', err.message);
    // Check for common squirrel events manually if the module is not available
    if (process.platform === 'win32') {
        const cmd = process.argv[1];
        const squirrelEvents = ['--squirrel-install', '--squirrel-updated', '--squirrel-uninstall', '--squirrel-obsolete'];

        // If this is a squirrel event, quit the app
        if (cmd && squirrelEvents.includes(cmd)) {
            app.quit();
        }
    }
}

// Safely import electron-updater, handling the case when it might be missing
let autoUpdater;
try {
    const { autoUpdater: updater } = require('electron-updater');
    autoUpdater = updater;
} catch (err) {
    logger.warn('electron-updater not available:', err.message);
    // Create a mock autoUpdater with empty methods if the real one is not available
    autoUpdater = {
        logger: logger,
        checkForUpdatesAndNotify: () => Promise.resolve(null),
        on: () => { },
        autoDownload: true
    };
}

const isDev = process.env.NODE_ENV === 'development';
let mainWindow;
let splashWindow;

// Function to determine the correct path to index.html
function getIndexPath() {
    if (isDev) {
        return 'http://localhost:5173';
    }

    // Try different paths for the index.html
    const possiblePaths = [
        path.join(__dirname, '../dist/index.html'),
        path.join(__dirname, './dist/index.html'),
        path.join(__dirname, '../index.html'),
        path.join(__dirname, './index.html'),
        path.join(app.getAppPath(), 'dist/index.html'),
        path.join(app.getAppPath(), 'index.html')
    ];

    // Log which paths we're checking (helpful for debugging)
    logger.info('Checking possible paths for index.html:');
    possiblePaths.forEach(p => {
        logger.info(`- ${p} (exists: ${fs.existsSync(p)})`);
    });

    // Find the first path that exists
    const validPath = possiblePaths.find(p => fs.existsSync(p));

    if (validPath) {
        logger.info(`Found valid index.html at: ${validPath}`);
        return url.format({
            pathname: validPath,
            protocol: 'file:',
            slashes: true
        });
    }

    // Fallback to a default path
    logger.warn('No valid index.html found, using default path');
    return url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
    });
}

// Create splash window
const createSplashWindow = () => {
    logger.info('Creating splash window');

    splashWindow = new BrowserWindow({
        width: 400,
        height: 400,
        transparent: false,
        frame: false,
        resizable: false,
        movable: false,
        center: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        backgroundColor: '#1D2125', // Background color matching your dark theme
        show: false
    });

    const splashPath = isDev
        ? url.format({
            pathname: path.join(__dirname, '../src/splash.html'),
            protocol: 'file:',
            slashes: true
        })
        : url.format({
            pathname: path.join(__dirname, '../dist/splash.html'),
            protocol: 'file:',
            slashes: true
        });

    // Check if the splash file exists
    const splashFileExists = fs.existsSync(
        isDev
            ? path.join(__dirname, '../src/splash.html')
            : path.join(__dirname, '../dist/splash.html')
    );

    if (splashFileExists) {
        logger.info(`Loading splash screen from: ${splashPath}`);
        splashWindow.loadURL(splashPath);
    } else {
        logger.warn('Splash screen HTML not found, using main window directly');
        createMainWindow();
        return;
    }

    splashWindow.on('closed', () => {
        splashWindow = null;
    });

    splashWindow.webContents.on('did-finish-load', () => {
        splashWindow.show();

        // Create main window after a short delay to show splash
        setTimeout(() => {
            createMainWindow();
        }, 500);
    });

    // If splash fails to load, go straight to main window
    splashWindow.webContents.on('did-fail-load', () => {
        logger.error('Splash screen failed to load, creating main window directly');
        createMainWindow();
    });
};

const createMainWindow = () => {
    logger.info('Creating main window');

    // Get the icon path
    const iconPath = path.join(__dirname, process.platform === 'win32'
        ? '../src/assets/icons/win/icon.ico'
        : '../src/assets/icons/png/1024x1024.png');

    logger.info(`Using icon: ${iconPath} (exists: ${fs.existsSync(iconPath)})`);

    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: "TxTrack",
        backgroundColor: '#1D2125', // Match the dark theme background color
        show: false, // Don't show until ready-to-show
    });

    // Set the application ID for proper taskbar grouping
    app.setAppUserModelId("com.alexlehman.txtrack");

    // Show window once ready to avoid blank flash
    mainWindow.once('ready-to-show', () => {
        logger.info('Window ready to show');

        // First hide the splash window if it exists
        if (splashWindow && !splashWindow.isDestroyed()) {
            splashWindow.hide();
        }

        // Then show the main window
        mainWindow.show();

        // Finally close the splash window
        if (splashWindow && !splashWindow.isDestroyed()) {
            splashWindow.close();
        }
    });

    // Add event listeners for debugging
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        logger.error(`Page failed to load: ${errorDescription} (${errorCode}) for URL: ${validatedURL}`);

        // Try to reload after a short delay
        setTimeout(() => {
            logger.info('Attempting to reload after load failure');
            mainWindow.loadURL(getIndexPath());
        }, 1000);
    });

    mainWindow.webContents.on('crashed', (event) => {
        logger.error('Renderer process crashed');
    });

    mainWindow.on('unresponsive', () => {
        logger.error('Window became unresponsive');
    });

    // Load the app
    if (isDev) {
        logger.info('Loading development URL');
        mainWindow.loadURL('http://localhost:5173');
        // Open DevTools in development mode
        mainWindow.webContents.openDevTools();
    } else {
        const indexPath = getIndexPath();
        logger.info(`Loading production path: ${indexPath}`);
        // Using loadURL instead of loadFile gives more flexibility with file:// protocol
        mainWindow.loadURL(indexPath);
    }
};

// Create window when Electron is ready
app.whenReady().then(() => {
    logger.info('App ready, creating splash window');
    createSplashWindow();

    // Set up auto-updater events
    if (!isDev) {
        logger.info('Setting up auto-updater');
        setupAutoUpdater();
    }

    // Add F12 shortcut to open DevTools in production
    globalShortcut.register('F12', () => {
        if (mainWindow && mainWindow.webContents) {
            logger.info('F12 pressed, opening DevTools');
            mainWindow.webContents.openDevTools();
        }
    });

    // Add Ctrl+R shortcut to reload the window
    globalShortcut.register('CommandOrControl+R', () => {
        if (mainWindow) {
            logger.info('Ctrl+R pressed, reloading window');
            mainWindow.reload();
        }
    });

    app.on('activate', () => {
        // On macOS re-create a window when dock icon is clicked and no other windows are open
        if (BrowserWindow.getAllWindows().length === 0) {
            logger.info('App activated with no windows, creating window');
            createMainWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        logger.info('All windows closed, quitting app');
        app.quit();
    }
});

// Log when app is quitting
app.on('quit', () => {
    logger.info('App is quitting');
});

// Clean up shortcuts when quitting
app.on('will-quit', () => {
    logger.info('App will quit, unregistering global shortcuts');
    globalShortcut.unregisterAll();
});

// Helpful for debugging
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        logger.info(`Navigate to: ${navigationUrl}`);
    });
});

// IPC handlers for any Electron-specific functionality
ipcMain.handle('get-app-path', () => {
    const userDataPath = app.getPath('userData');
    logger.info(`App path requested: ${userDataPath}`);
    return userDataPath;
});

// IPC handler for version info
ipcMain.handle('get-version', () => {
    logger.info(`Version requested: ${app.getVersion()}`);
    return app.getVersion();
});

// Set up auto-updater with appropriate event handlers
function setupAutoUpdater() {
    // Configure logging
    autoUpdater.logger = logger;
    if (autoUpdater.logger.transports) {
        autoUpdater.logger.transports.file.level = 'info';
    }

    // Auto download updates
    autoUpdater.autoDownload = true;

    // Check for updates when app starts
    autoUpdater.checkForUpdatesAndNotify().catch(err => {
        logger.error('Error checking for updates:', err);
    });

    // Set up a timer to check for updates every hour
    setInterval(() => {
        logger.info('Scheduled update check');
        autoUpdater.checkForUpdatesAndNotify().catch(err => {
            logger.error('Error checking for updates:', err);
        });
    }, 60 * 60 * 1000);

    // Auto updater events
    autoUpdater.on('checking-for-update', () => {
        logger.info('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        logger.info('Update available:', info);
    });

    autoUpdater.on('update-not-available', (info) => {
        logger.info('Update not available:', info);
    });

    autoUpdater.on('error', (err) => {
        logger.error('Error in auto-updater:', err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
        logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
        logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
        logger.info(logMessage);
    });

    autoUpdater.on('update-downloaded', (info) => {
        logger.info('Update downloaded');

        // Prompt user to restart application
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Ready',
            message: 'A new version of TxTrack has been downloaded. Restart the application to apply the updates.',
            buttons: ['Restart', 'Later']
        }).then(result => {
            // If user clicked "Restart"
            if (result.response === 0) {
                logger.info('User chose to restart for update');
                autoUpdater.quitAndInstall();
            } else {
                logger.info('User postponed update installation');
            }
        }).catch(err => {
            logger.error('Error showing update dialog:', err);
        });
    });
}