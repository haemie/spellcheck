import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/spellcheck/',
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  plugins: [react()],
});
