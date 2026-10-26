import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { siteUrl } from '../paths'

export function Navbar({ homeHref = '', activePage }: { homeHref?: string; activePage?: 'story' | 'fun' | 'resume' }) {
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
    <header className={`portfolio-nav ${scrolled ? 'portfolio-nav--scrolled' : ''}${activePage === 'resume' ? ' portfolio-nav--resume' : activePage === 'story' ? ' portfolio-nav--story' : activePage === 'fun' ? ' portfolio-nav--fun' : ''}`}>
      <a className="personal-brand" href={`${homeHref}#top`} aria-label="何扬，返回首页顶部">
        <span className="personal-brand__mark" aria-hidden="true">hy</span>
        <span className="personal-brand__name">{profile.name}<span>{profile.romanName}</span></span>
      </a>
      <nav className="portfolio-nav__links" aria-label="主导航">
        <a href={`${homeHref}#work`} className="portfolio-nav__work">Work<span /></a>
        <a href={siteUrl('fun')} aria-current={activePage === 'fun' ? 'page' : undefined}>Fun</a>
        <a href={siteUrl('resume')} aria-current={activePage === 'resume' ? 'page' : undefined}>Résumé</a>
        <a href={siteUrl('story')} aria-current={activePage === 'story' ? 'page' : undefined}>Story</a>
        {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
      </nav>
      <p className="portfolio-nav__notice" role="status">{notice}</p>
    </header>
  )
}
