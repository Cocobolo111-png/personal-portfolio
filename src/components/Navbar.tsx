import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

export function Navbar({ homeHref = '' }: { homeHref?: string }) {
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
    <header className={`portfolio-nav ${scrolled ? 'portfolio-nav--scrolled' : ''}`}>
      <a className="personal-brand" href={`${homeHref}#top`} aria-label="何扬，返回首页顶部">
        <span className="personal-brand__mark" aria-hidden="true">hy</span>
        <span className="personal-brand__name">{profile.name}<span>{profile.romanName}</span></span>
      </a>
      <nav className="portfolio-nav__links" aria-label="主导航">
        <a href={`${homeHref}#work`} className="portfolio-nav__work">Work<span /></a>
        <button type="button" aria-disabled="true" title="Play 将在阶段 B 开放" onClick={() => setNotice('Play 将在阶段 B 开放。')}>Play</button>
        {profile.resumeUrl ? <a href={profile.resumeUrl}>Résumé</a> : <button type="button" aria-disabled="true" title="尚未配置简历 PDF" onClick={() => setNotice('尚未配置简历 PDF，补充真实文件后可预览与下载。')}>Résumé<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 9 9 3M3 3h6v6" stroke="currentColor" strokeWidth="1.2" /></svg></button>}
        <button type="button" aria-disabled="true" title="Story 将在阶段 B 开放" onClick={() => setNotice('Story 将在阶段 B 开放。')}>Story</button>
        {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
      </nav>
      <p className="portfolio-nav__notice" role="status">{notice}</p>
    </header>
  )
}
