// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    // Add any other IPC methods your app needs
});

// Provide an API to access Node.js functionality if needed
contextBridge.exposeInMainWorld('api', {
    // You can add more methods here to interact with Node.js APIs from your React app
    platform: process.platform
});