import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        outDir: '.vite/build',
        lib: {
            entry: 'electron/main.js',
            formats: ['cjs'],
            fileName: () => '[name].js',
        },
        rollupOptions: {
            external: [
                'electron',
                // Instead of excluding these entirely, we'll let them be processed
                // Just mark them as external so Vite doesn't try to bundle them incorrectly
                /^electron-updater/,
                /^electron-log/,
                'electron-squirrel-startup'
            ],
            output: {
                // Ensure proper handling of external modules
                format: 'cjs',
            }
        },
        minify: false,
        emptyOutDir: true,
    },
    resolve: {
        // Some libs that can run in both Web and Node.js, we need to tell Vite where to resolve them
        mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
});