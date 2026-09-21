import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// Automatically detect GitHub Pages repository subpath if running in GitHub Actions
const getBasePath = () => {
  if (process.env.BASE_PATH) {
    return process.env.BASE_PATH;
  }
  if (process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
    if (repo) {
      return repo.endsWith('.github.io') ? '/' : `/${repo}/`;
    }
  }
  return './';
};

export default defineConfig(() => {
  return {
    base: getBasePath(),
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'generate-github-pages-404',
        closeBundle() {
          try {
            const distDir = path.resolve(process.cwd(), 'dist');
            const indexPath = path.join(distDir, 'index.html');
            const notFoundPath = path.join(distDir, '404.html');
            if (fs.existsSync(indexPath)) {
              fs.copyFileSync(indexPath, notFoundPath);
            }
          } catch (err) {
            console.warn('Could not copy 404.html for GitHub Pages:', err);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
