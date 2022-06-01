import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        process.env.NODE_ENV === 'development' ? react() : null,
        federation({
            filename: 'customComponents.js',
            exposes: {
                './Components': './src/components.jsx',
            },
            shared: ['@mui/material', '@mui/styles', '@iobroker/adapter-react-v5', 'react', 'react-dom', 'prop-types']
        })
    ],
    build: {
        target: 'esnext',
        minify: false,
        cssCodeSplit: true,
        // rollupOptions: {
        //   output: {
        //     // format: 'esm',
        //     dir: 'dist',
        //     minifyInternalExports: false
        //   }
        // },
        sourcemap: true // 'inline'
    }
})
