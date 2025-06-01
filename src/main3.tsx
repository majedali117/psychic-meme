import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // Added this import
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>  {/* Added BrowserRouter wrapper */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
