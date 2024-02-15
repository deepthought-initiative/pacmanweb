import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
   port: 8080,
   strictPort: true,
  },
  server: {
   port: 8080,
   strictPort: true,
   host: true,
   origin: "http://0.0.0.0:8080",
   proxy: {
    '/api': {
      target: 'http://0.0.0.0:8080',
      changeOrigin: true,
      // rewrite: (path) => path.replace(/^\/api/, ''),
    },
   }
  },
 });
