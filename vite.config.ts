import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: 'src/start.ts' },
      client: { entry: 'src/client.tsx' },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { '@': '/src' } },
  server: { port: 8080 },
});