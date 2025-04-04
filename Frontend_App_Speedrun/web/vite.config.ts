// web/vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Just call the plugin here
  ],
  // Remove the css.tailwindcss section
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})