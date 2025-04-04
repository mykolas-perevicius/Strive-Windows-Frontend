// vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Initialize Tailwind CSS plugin
  ],
  // Explicitly configure Tailwind CSS within Vite's CSS options
  // (Optional but good practice if not using a separate tailwind.config.ts)
  css: {
    tailwindcss: {
      // Define the minimal configuration needed here
      config: {
        darkMode: ['class'], // <--- Specify dark mode strategy
        // Content scanning is usually handled automatically by the plugin,
        // but you can specify it here if needed:
        // content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
        // You can add theme extensions or plugins here too if necessary
        // theme: { extend: {} },
        // plugins: [],
      }
    }
  },
  resolve: {
    alias: {
      // Configure the '@' alias
      "@": path.resolve(__dirname, "./src"),
    },
  },
})