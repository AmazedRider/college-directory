import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-html-rewrites',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If the URL is /application-tracker, redirect to /track
          if (req.url === '/application-tracker') {
            console.log('Middleware redirecting /application-tracker to /track');
            res.writeHead(302, {
              Location: '/track'
            });
            res.end();
            return;
          }
          next();
        });
      }
    },
    // Add plugin to copy files to the output directory
    {
      name: 'copy-files',
      generateBundle() {
        // Make sure _redirects is copied
        if (fs.existsSync('public/_redirects')) {
          this.emitFile({
            type: 'asset',
            fileName: '_redirects',
            source: fs.readFileSync('public/_redirects')
          });
        }
        
        // Copy _headers if it exists
        if (fs.existsSync('public/_headers')) {
          this.emitFile({
            type: 'asset',
            fileName: '_headers',
            source: fs.readFileSync('public/_headers')
          });
        }
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    assetsInlineLimit: 0, // Don't inline assets
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('react-hot-toast')) {
              return 'ui-vendor';
            }
            if (id.includes('supabase')) {
              return 'supabase-vendor';
            }
            return 'vendor';
          }
        },
        // Ensure proper MIME types for JS files
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          if (/\.(jpe?g|png|gif|webp)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.svg$/i.test(assetInfo.name)) {
            return 'assets/svg/[name]-[hash][extname]';
          }
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(assetInfo.name)) {
            return 'assets/media/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  server: {
    port: 3000,
    // This is the key configuration for SPA routing
    historyApiFallback: true,
    // Middleware configuration for SPA
    middleware: [
      (req, res, next) => {
        // For SPA, any URL that doesn't contain a file extension should be 
        // handled by the SPA router
        if (!req.url.includes('.')) {
          console.log(`SPA middleware handling: ${req.url}`);
          // Let React Router handle it
          next();
        } else {
          next();
        }
      }
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src')
    },
  },
});
