import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SoftwareDevelopmentNepalPage from './SoftwareDevelopmentNepalPage.tsx'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const page = normalizedPath === '/software-development-nepal'
  ? <SoftwareDevelopmentNepalPage />
  : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
  </StrictMode>,
)
