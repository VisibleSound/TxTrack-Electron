// scripts/copy-splash.js
const fs = require('fs');
const path = require('path');

// Ensure the scripts directory exists
if (!fs.existsSync('scripts')) {
    fs.mkdirSync('scripts');
}

// Paths
const srcSplashPath = path.join(__dirname, '../src/splash.html');
const distSplashPath = path.join(__dirname, '../dist/splash.html');
const distDir = path.join(__dirname, '../dist');

// Make sure the dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy splash.html to dist folder
try {
    if (fs.existsSync(srcSplashPath)) {
        fs.copyFileSync(srcSplashPath, distSplashPath);
        console.log('Splash screen copied to dist folder successfully');
    } else {
        console.error('Source splash.html not found at', srcSplashPath);
    }
} catch (err) {
    console.error('Error copying splash screen:', err);
}

// Ensure assets directory exists in dist
const distAssetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
}

// Copy logo to dist/assets if it doesn't exist there already
const srcLogoPath = path.join(__dirname, '../src/assets/DarkLogo.svg');
const distLogoPath = path.join(distAssetsDir, 'DarkLogo.svg');

try {
    if (fs.existsSync(srcLogoPath) && !fs.existsSync(distLogoPath)) {
        fs.copyFileSync(srcLogoPath, distLogoPath);
        console.log('Logo copied to dist/assets folder successfully');
    }
} catch (err) {
    console.error('Error copying logo:', err);
}