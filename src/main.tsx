import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo'
import App from './App'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/hero.css'
import './styles/work.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
