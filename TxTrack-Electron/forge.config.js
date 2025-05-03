// Add dotenv for env variable support
require('dotenv').config();

module.exports = {
    packagerConfig: {
        asar: {
            // Unpack these modules so they can be required at runtime
            unpack: "*.node"
        },
        icon: './src/assets/icons', // This will use the appropriate icon format for each platform
        // This is important - include all required modules in the final package
        ignore: [
            /node_modules\/(?!(electron-updater|electron-log|electron-squirrel-startup)\/).*/
        ],
        // Ensure applicationName is set
        appCopyright: `Copyright © ${new Date().getFullYear()} Alex Lehman`,
        appCategoryType: "public.app-category.finance",
        appBundleId: "com.alexlehman.txtrack",
        // Additional resources that might be needed
        extraResource: [
            "./src/assets/icons"
        ]
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                // Windows-specific options
                setupIcon: './src/assets/icons/win/icon.ico',
                iconUrl: 'https://raw.githubusercontent.com/VisibleSound/TxTrack-Electron/main/src/assets/icons/win/icon.ico',
                // Important settings for proper installation
                name: "TxTrack",
                exe: "TxTrack.exe",
                noMsi: false,
                // These ensure proper shortcuts
                setupExe: "TxTrack-Setup.exe",
                shortcutName: "TxTrack",
                loadingGif: "./src/assets/loading.gif", // Optional: Create this asset for a branded loading screen
                createDesktopShortcut: true,
                createStartMenuShortcut: true,
                // Registry settings for proper association
                registryItems: [
                    {
                        name: 'FileAssociations',
                        value: [
                            {
                                extension: '.txtrack',
                                description: 'TxTrack File',
                                progids: ['TxTrack.Document'],
                                icon: '"%EXEDIR%\\TxTrack.exe,0"'
                            }
                        ]
                    },
                    {
                        name: 'AppUserModelId',
                        value: {
                            key: 'Software\\Classes\\Applications\\TxTrack.exe',
                            name: 'AppUserModelID',
                            value: 'com.alexlehman.txtrack'
                        }
                    }
                ]
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin']
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                // Linux-specific options
                options: {
                    icon: './src/assets/icons/png/1024x1024.png',
                    categories: ['Finance', 'Utility'],
                    homepage: 'https://github.com/VisibleSound/TxTrack-Electron'
                }
            }
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                // RPM-specific options
                options: {
                    icon: './src/assets/icons/png/1024x1024.png',
                    categories: ['Finance', 'Utility'],
                    homepage: 'https://github.com/VisibleSound/TxTrack-Electron'
                }
            }
        }
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'VisibleSound',
                    name: 'TxTrack-Electron'
                },
                prerelease: false,
                draft: true,
                // The token will be loaded from process.env.GITHUB_TOKEN via dotenv
            }
        }
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-vite',
            config: {
                // The port vite listens on
                port: 5173,
                // Vite build configuration
                build: [
                    {
                        // `main` entry point
                        entry: 'electron/main.js',
                        config: 'vite.main.config.mjs',
                    },
                    {
                        // `preload` entry point
                        entry: 'electron/preload.js',
                        config: 'vite.preload.config.mjs',
                    },
                ],
                renderer: [
                    {
                        name: 'main_window',
                        config: 'vite.config.js',
                    },
                ],
            },
        },
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {}
        }
    ],
    // Hook to run before packaging starts
    hooks: {
        // Log environment info before packaging
        prePackage: async () => {
            console.log('Starting packaging process...');
            console.log('Node version:', process.version);
            console.log('Electron Forge version:', require('@electron-forge/cli/package.json').version);

            // Check if required assets exist
            const fs = require('fs');
            const path = require('path');

            const iconPath = path.resolve('./src/assets/icons/win/icon.ico');
            console.log('Icon exists:', fs.existsSync(iconPath));
        },
        // Run after packaging is complete
        postPackage: async (forgeConfig, packageResult) => {
            console.log('Packaging complete!');
            console.log('Output directory:', packageResult.outputPaths);
        }
    }
};