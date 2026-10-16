import { useLayoutEffect } from 'react'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { HeroSection } from './sections/HeroSection'
import { WorkSection } from './sections/WorkSection'

export default function App() {
  useLayoutEffect(() => {
    const previousRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    let frame = 0
    let historyMove = false

    const align = (instant: boolean) => {
      const hash = window.location.hash.slice(1)
      if (!hash) {
        if (instant) window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }
      let id: string
      try { id = decodeURIComponent(hash) } catch { return }
      document.getElementById(id)?.scrollIntoView({ behavior: instant ? 'instant' : 'auto', block: 'start' })
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        align(historyMove)
        historyMove = false
      })
    }
    const onHistory = () => { historyMove = true; schedule() }
    // The initial HTML has no anchors. Resolve once the React tree is mounted;
    // a frame also lets the browser finish its own fragment-navigation attempt.
    historyMove = Boolean(window.location.hash)
    schedule()
    window.addEventListener('hashchange', schedule)
    window.addEventListener('popstate', onHistory)
    return () => {
      cancelAnimationFrame(frame)
      history.scrollRestoration = previousRestoration
      window.removeEventListener('hashchange', schedule)
      window.removeEventListener('popstate', onHistory)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <WorkSection />
      </main>
      <Footer />
    </>
  )
}
