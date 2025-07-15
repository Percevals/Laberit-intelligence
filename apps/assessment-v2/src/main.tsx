import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n/config' // Initialize i18n
import App from './App.tsx'

// Database initialization is now handled automatically when needed
// The database module will detect browser environment and use appropriate implementation

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)