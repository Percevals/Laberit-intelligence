import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n/config' // Initialize i18n
import App from './App.tsx'
import { initDatabase } from './database'

// Initialize database connection (non-blocking)
initDatabase().catch(error => {
  console.error('Database initialization failed:', error);
  console.warn('App will continue without database connection');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)