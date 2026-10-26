import { useLayoutEffect } from 'react'
import { ResumePage } from './sections/ResumePage'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { HeroSection } from './sections/HeroSection'
import { WorkSection } from './sections/WorkSection'
import { ProjectCaseStudy } from './sections/ProjectCaseStudy'
import { FunPage } from './sections/FunPage'
import { StoryPage } from './sections/StoryPage'
import { projects } from './data/projects'
import { siteUrl } from './paths'

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const project = projects.find(item => item.caseStudy && item.caseStudyUrl === pathname)
  const isHome = pathname === siteUrl().replace(/\/$/, '') || pathname === '/'
  const isResume = pathname === siteUrl('resume')
  const isFun = pathname === siteUrl('fun')
  const isStory = pathname === siteUrl('story')
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
      <Navbar homeHref={isHome ? '' : siteUrl()} activePage={isResume ? 'resume' : isFun ? 'fun' : isStory ? 'story' : undefined} />
      <main id="main-content" className={isResume ? 'resume-main' : isFun ? 'fun-main' : isStory ? 'story-main' : isHome ? undefined : 'case-main'}>
        {isResume ? <ResumePage /> : isHome ? <><HeroSection /><WorkSection /></> : isFun ? <FunPage /> : isStory ? <StoryPage /> : project ? <ProjectCaseStudy project={project} /> : (
          <section className="case-not-found"><h1>这个案例还没上架。</h1><a href={siteUrl('#work')}>返回全部项目</a></section>
        )}
      </main>
      <Footer />
    </>
  )
}
