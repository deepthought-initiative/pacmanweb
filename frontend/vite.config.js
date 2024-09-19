import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: "/",
    server: {
      port: 8080,
      strictPort: true,
      host: true,
      origin: env.REACT_APP_BASE_URL || "http://127.0.0.1:8080",
      proxy: {
        "/api": {
          target: env.REACT_APP_API_URL || "http://127.0.0.1:8000",
          changeOrigin: true,
          secure: false,
        },
      },
      watch: {
        usePolling: true,
      },
    },
    test: {
      environment: "jsdom",
    },
  };
});