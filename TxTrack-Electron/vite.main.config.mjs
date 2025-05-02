import { defineConfig } from 'vite';
import path from 'path';

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
            external: ['electron'],
        },
        minify: false,
        emptyOutDir: true,
    },
    resolve: {
        // Some libs that can run in both Web and Node.js, we need to tell Vite where to resolve them
        mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
});