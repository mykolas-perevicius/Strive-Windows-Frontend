import path from "path"
import tailwindcss from "@tailwindcss/vite" // Import the Tailwind plugin
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Add the Tailwind plugin instance here
  ],
  resolve: {
    alias: {
      // Configure the '@' alias
      "@": path.resolve(__dirname, "./src"),
    },
  },
})