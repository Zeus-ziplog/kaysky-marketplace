import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: 'src/start.ts' },
      client: { entry: 'src/client.tsx' },
    }),
    nitro({
      preset: 'vercel',
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: { alias: { '@': '/src' } },
  server: { port: 8080 },
});