import { useEffect, useState } from 'react'
import { siteUrl } from '../paths'
import { profile } from '../data/profile'

export function Navbar({ homeHref = '', activePage }: { homeHref?: string; activePage?: 'resume' }) {
  const [scrolled, setScrolled] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let previous: boolean | undefined
    const onScroll = () => {
      const next = window.scrollY > 24
      if (next !== previous) { previous = next; setScrolled(next) }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  return (
    <header className={`portfolio-nav ${activePage === 'resume' ? 'portfolio-nav--resume' : ''} ${scrolled ? 'portfolio-nav--scrolled' : ''}`}>
      <a className="personal-brand" href={`${homeHref}#top`} aria-label="何扬，返回首页顶部">
        <span className="personal-brand__mark" aria-hidden="true">hy</span>
        <span className="personal-brand__name">{profile.name}<span>{profile.romanName}</span></span>
      </a>
      <nav className="portfolio-nav__links" aria-label="主导航">
        <a href={`${homeHref}#work`} className="portfolio-nav__work">Work<span /></a>
        <button type="button" aria-disabled="true" title="Play 将在阶段 B 开放" onClick={() => setNotice('Play 将在阶段 B 开放。')}>Play</button>
        <a href={siteUrl('resume')} aria-current={activePage === 'resume' ? 'page' : undefined}>Résumé</a>
        <button type="button" aria-disabled="true" title="Story 将在阶段 B 开放" onClick={() => setNotice('Story 将在阶段 B 开放。')}>Story</button>
        {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
      </nav>
      <p className="portfolio-nav__notice" role="status">{notice}</p>
    </header>
  )
}
