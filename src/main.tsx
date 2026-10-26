import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo'
import App from './App'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/hero.css'
import './styles/work.css'
import './styles/case-study.css'
import './styles/story.css'
import './styles/fun.css'
import './styles/ask-hy.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
