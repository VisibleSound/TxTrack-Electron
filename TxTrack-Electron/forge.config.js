module.exports = {
    packagerConfig: {
        asar: true,
        icon: './src/assets/DarkLogo'
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                // Windows-specific options
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
            }
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                // RPM-specific options
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