import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 52736,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
})
