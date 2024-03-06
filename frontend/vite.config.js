import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

// in prod uncomment this
const { REACT_APP_BASE_URL, REACT_APP_API_URL } = process.env;

// in dev uncomment this
// const REACT_APP_BASE_URL = "http://127.0.0.1:8080";
// const REACT_APP_API_URL = "http://127.0.0.1:8000";

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
    origin: REACT_APP_BASE_URL || "http://0.0.0.0:8080",
    proxy: {
      "/api": {
        target: REACT_APP_API_URL || "http://0.0.0.0:8080",
      },
    },
  },
});
