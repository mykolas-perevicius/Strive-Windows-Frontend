// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// Update Provider import name and path
import { AppSettingsProvider } from './components/contexts/AppSettingsProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Use the renamed provider */}
      <AppSettingsProvider
        defaultTheme="system"
        defaultLanguage="en" // Optional: set default language
        storageKeyTheme="vite-ui-theme"
        storageKeyLanguage="vite-ui-language" // Optional: set storage key
      >
        <App />
      </AppSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)