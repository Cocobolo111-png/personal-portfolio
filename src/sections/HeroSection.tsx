import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { HeroArtwork } from '../components/HeroArtwork'
import { heroChapters } from '../data/hero'
import { profile } from '../data/profile'

export function HeroSection() {
  const [active, setActive] = useState(0)
  const hero = useRef<HTMLElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const chapter = heroChapters[active]

  useEffect(() => {
    const section = hero.current
    if (!section) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const render = () => {
      frame = 0
      const progress = preference.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / section.offsetHeight))
      section.style.setProperty('--hero-scroll', String(progress))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(render) }
    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    preference.addEventListener('change', render)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      preference.removeEventListener('change', render)
    }
  }, [])

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % heroChapters.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + heroChapters.length) % heroChapters.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = heroChapters.length - 1
    else return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section ref={hero} className={`intro${active === 0 ? ' intro--who' : ''}`} id="top" aria-labelledby="hero-heading">
      <div className="intro__body">
        <div className="intro-tabs" role="tablist" aria-label="关于何扬">
          {heroChapters.map((item, index) => (
            <button key={item.id} ref={(node) => { tabRefs.current[index] = node }}
              id={`tab-${item.id}`} type="button" role="tab" aria-selected={active === index}
              aria-controls="hero-panel" tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)} onKeyDown={(event) => onTabKey(event, index)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="intro__panel" id="hero-panel" role="tabpanel" aria-labelledby={`tab-${chapter.id}`} tabIndex={0}
          onTouchStart={(event) => { touchStart.current = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY } }}
          onTouchEnd={(event) => {
            const start = touchStart.current
            touchStart.current = null
            if (!start) return
            const dx = event.changedTouches[0].clientX - start.x
            const dy = event.changedTouches[0].clientY - start.y
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) setActive((active + (dx < 0 ? 1 : -1) + heroChapters.length) % heroChapters.length)
          }}>
          <div key={chapter.id} className={`intro__chapter${chapter.id === 'who' ? ' intro__chapter--who' : ''}`}>
            {chapter.id === 'who' ? <>
              <div className="intro__composition">
                <HeroArtwork />
                <h1 id="hero-heading" className="intro__headline">
                  <span className="intro__headline-line intro__headline-line--name"><span className="intro__greeting">{chapter.headline.greeting}</span><strong>{chapter.headline.name}</strong><span className="intro__comma">，</span></span>
                  <span className="intro__headline-line intro__headline-line--product">做 <span className="intro__blue">{chapter.headline.product}</span>，</span>
                  <span className="intro__headline-line intro__headline-line--growth">{chapter.headline.growth}</span>
                </h1>
                <HeroArtwork plane="front" />
              </div>
              <p className="intro__description intro__description--who">{chapter.description[0]}<br />{chapter.description[1]}</p>
            </> : <>
              <p className="intro__hello">{chapter.note}</p>
              <h1 id="hero-heading">{chapter.line}<br /><span>{chapter.emphasis}</span></h1>
              <p className="intro__description">{chapter.description}</p>
              <span className="intro__tag"><span />{chapter.tag}</span>
            </>}
          </div>
        </div>
      </div>
      <div className="intro__foot">
        {active !== 0 && <p className="intro__identity">{profile.romanName}<span>PRODUCT · CONTENT · GROWTH</span></p>}
        <a className="intro__scroll" href="#work"><span className="intro__scroll-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>向下探索作品</a>
        {active !== 0 && <p key={chapter.keyword} className="intro__keyword">{chapter.keyword}</p>}
      </div>
    </section>
  )
}
