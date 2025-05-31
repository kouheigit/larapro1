import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test:{
    //ここの部分を追加した
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});

