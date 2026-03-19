// main.jsx
// Application entry point.
// Mounts the React app into the #root div in index.html.
// Wraps the entire app in:
//   - StrictMode: highlights potential issues during development
//   - AuthProvider: makes authentication state (user, login, logout) available app-wide

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider wraps the entire app so any component can access auth state */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
