import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { loadEnv } from 'vite';

export default defineConfig(async ({ mode }) => {
  const env = await loadEnv(mode, process.cwd());
  
  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'build',
    },
    define: {
      // Przekazujemy zmienne środowiskowe do aplikacji
      'process.env': env
    }
  };
});
