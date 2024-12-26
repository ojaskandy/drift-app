import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Directory for production build
  },
  server: {
    port: 3000, // Local development server
    open: true, // Open in browser when running locally
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL, // Dynamically use backend URL from the .env file
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Rewrite API requests
      },
    },
  },
  preview: {
    port: 5000, // Port for previewing the build
  },
});
