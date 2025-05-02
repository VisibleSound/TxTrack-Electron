// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    // Add any other IPC methods your app needs
});

// Provide an API to access Node.js functionality if needed
// This allows your React app to interact with the file system securely
contextBridge.exposeInMainWorld('api', {
    fs: {
        readFile: (filePath, options) => {
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, options, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        },
        writeFile: (filePath, data, options) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(filePath, data, options, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
    }
});