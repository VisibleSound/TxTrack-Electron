// Add dotenv for env variable support
require('dotenv').config();

module.exports = {
    packagerConfig: {
        asar: {
            // Unpack these modules so they can be required at runtime
            unpack: "*.node"
        },
        icon: './src/assets/icons', // This will use the appropriate icon format for each platform
        // Include all required modules in the final package
        ignore: [
            /node_modules\/(?!(electron-updater|electron-log|electron-squirrel-startup)\/).*/
        ],
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
                // Change exe and setup names to TxTrack
                name: "TxTrack",
                exe: "TxTrack.exe",
                setupExe: "TxTrack.exe", // This is the main change - creates TxTrack.exe instead of Setup
                shortcutName: "TxTrack",
                loadingGif: "./src/assets/loading.gif", // Keeping the loading gif property as requested
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
                port: 5173,
                build: [
                    {
                        entry: 'electron/main.js',
                        config: 'vite.main.config.mjs',
                    },
                    {
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
        prePackage: async () => {
            console.log('Starting packaging process...');
            console.log('Node version:', process.version);
            console.log('Electron Forge version:', require('@electron-forge/cli/package.json').version);

            // Check if required assets exist and create placeholder if needed
            const fs = require('fs');
            const path = require('path');

            const iconPath = path.resolve('./src/assets/icons/win/icon.ico');
            console.log('Icon exists:', fs.existsSync(iconPath));

            // Ensure assets directory exists
            const assetsDir = path.resolve('./src/assets');
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
                console.log('Created assets directory');
            }

            // Create empty loading.gif file if it doesn't exist
            const loadingGifPath = path.resolve('./src/assets/loading.gif');
            if (!fs.existsSync(loadingGifPath)) {
                // Create an empty file (0 bytes) as a placeholder
                // This prevents the error while building
                fs.writeFileSync(loadingGifPath, Buffer.alloc(0));
                console.log('Created empty loading.gif placeholder');
            }
        },
        postPackage: async (forgeConfig, packageResult) => {
            console.log('Packaging complete!');
            console.log('Output directory:', packageResult.outputPaths);
        }
    }
};