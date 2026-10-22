import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { HeroArtwork } from '../components/HeroArtwork'
import { heroChapters } from '../data/hero'

export function HeroSection() {
  const [active, setActive] = useState(0)
  const hero = useRef<HTMLElement>(null)
  const chapterRoot = useRef<HTMLDivElement>(null)
  const previousChapter = useRef(active)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const chapter = heroChapters[active]

  useEffect(() => {
    const section = hero.current
    if (!section) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let height = section.offsetHeight
    let previousProgress = -1
    const render = () => {
      frame = 0
      const progress = preference.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / height))
      if (progress !== previousProgress) {
        section.style.setProperty('--hero-scroll', String(progress))
        previousProgress = progress
      }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(render) }
    const onResize = () => { height = section.offsetHeight; onScroll() }
    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    preference.addEventListener('change', render)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      preference.removeEventListener('change', render)
    }
  }, [])

  useLayoutEffect(() => {
    if (previousChapter.current === active) return
    previousChapter.current = active
    const root = chapterRoot.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || preference.matches || !window.matchMedia('(min-width: 1001px)').matches || !root.animate) return

    // Animate only the current DOM. Replacing a chapter cancels its whole
    // sequence before the next one paints, including its foreground copy.
    const animations: Animation[] = []
    const start = document.timeline.currentTime
    const enter = (element: Element, frames: Keyframe[], duration = 360, delay = 0) => {
      const animation = element.animate(frames, {
        duration, delay, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards',
      })
      if (typeof start === 'number') animation.startTime = start
      animations.push(animation)
      return animation
    }
    root.style.willChange = 'transform, opacity'
    const content = enter(root, [{ opacity: .7, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }])
    content.onfinish = () => { root.style.willChange = '' }

    root.querySelectorAll<SVGPathElement>('.hero-art__trace').forEach(path => {
      const length = path.getTotalLength()
      enter(path, [
        { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
        { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 },
      ], 680)
    })
    if (chapter.id === 'care') {
      root.querySelectorAll('.hero-art__settle').forEach(node => {
        enter(node, [{ opacity: .4, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], 500, 100)
      })
    } else if (chapter.id === 'believe') {
      root.querySelectorAll('.hero-art__experiment').forEach(ball => {
        enter(ball, [
          { transform: 'translate(-152px, 179px)', offset: 0 },
          { transform: 'translate(-116px, -2px)', offset: .5 },
          { transform: 'translate(0, 0)', offset: 1 },
        ], 680)
      })
    } else if (chapter.id === 'now') {
      root.querySelectorAll('.hero-art__module').forEach((module, index) => {
        enter(module, [
          { opacity: .5, transform: `translate(${(index - 1) * 10}px, ${12 - index * 3}px)` },
          { opacity: 1, transform: 'translate(0, 0)' },
        ], 480, index * 50)
      })
    }
    const cancel = () => {
      animations.forEach(animation => animation.cancel())
      root.style.willChange = ''
    }
    const onPreference = () => { if (preference.matches) cancel() }
    preference.addEventListener('change', onPreference)
    return () => { cancel(); preference.removeEventListener('change', onPreference) }
  }, [active, chapter.id])

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
    <section ref={hero} className={`intro intro--${chapter.id}`} id="top" aria-labelledby="hero-heading">
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
          <div key={chapter.id} ref={chapterRoot} className={`intro__chapter intro__chapter--${chapter.id}`}>
            <div className={`intro__composition intro__composition--${chapter.id}`}>
              <h1 id="hero-heading" className={`intro__statement intro__statement--${chapter.id}`}>
                {chapter.lines.map((line, index) => <span key={index} className="intro__statement-line">{line.before}{line.accent && <span className="intro__blue">{line.accent}</span>}{line.after}</span>)}
              </h1>
              {chapter.id === 'who' && <span className="intro__curiosity-mark" aria-hidden="true">?</span>}
              <HeroArtwork chapter={chapter.id} />
            </div>
            <p className="intro__description">{chapter.description}</p>
          </div>
        </div>
      </div>
      <div className="intro__foot">
        <a className="intro__scroll" href="#work"><span className="intro__scroll-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>向下探索作品</a>
      </div>
    </section>
  )
}
