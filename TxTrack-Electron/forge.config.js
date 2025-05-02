module.exports = {
    packagerConfig: {
        asar: true,
        icon: './src/assets/icons' // This will use the appropriate icon format for each platform
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                // Windows-specific options
                setupIcon: './src/assets/icons/win/icon.ico',
                iconUrl: 'https://raw.githubusercontent.com/VisibleSound/TxTrack-Electron/main/src/assets/icons/win/icon.ico'
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
                    icon: './src/assets/icons/png/1024x1024.png'
                }
            }
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                // RPM-specific options
                options: {
                    icon: './src/assets/icons/png/1024x1024.png'
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
                authToken: process.env.GITHUB_TOKEN
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
    ]
};