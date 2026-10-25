import {
  useEffect, useLayoutEffect, useRef, useState,
  type KeyboardEvent, type PointerEvent as ReactPointerEvent,
} from 'react'
import { HeroArtwork } from '../components/HeroArtwork'
import { heroChapters } from '../data/hero'

export function HeroSection() {
  const [active, setActive] = useState(0)
  const hero = useRef<HTMLElement>(null)
  const chapterRoot = useRef<HTMLDivElement>(null)
  const previousChapter = useRef(active)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabsRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const markFrame = useRef(0)
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

  useEffect(() => () => cancelAnimationFrame(markFrame.current), [])

  // One ink bar travels between tabs instead of two separate outlines fading.
  useLayoutEffect(() => {
    const list = tabsRef.current
    const tab = tabRefs.current[active]
    if (!list || !tab) return
    const place = () => {
      list.style.setProperty('--tab-left', `${tab.offsetLeft}px`)
      list.style.setProperty('--tab-width', `${tab.offsetWidth}px`)
    }
    place()
    let live = true
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place)
    observer?.observe(list)
    window.addEventListener('resize', place)
    void document.fonts?.ready.then(() => { if (live) place() })
    return () => {
      live = false
      observer?.disconnect()
      window.removeEventListener('resize', place)
    }
  }, [active])

  useLayoutEffect(() => {
    if (previousChapter.current === active) return
    previousChapter.current = active
    const root = chapterRoot.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || preference.matches) return

    // The chapter DOM is stable, so only the incoming copy and artwork animate.
    // Cancelling on cleanup makes rapid tab changes restart from one clean frame.
    const animations: Animation[] = []
    const start = document.timeline.currentTime
    const enter = (
      element: Element,
      frames: Keyframe[],
      duration = 420,
      delay = 0,
      easing = 'cubic-bezier(.16, 1, .3, 1)',
    ) => {
      const animation = element.animate(frames, { duration, delay, easing, fill: 'backwards' })
      if (typeof start === 'number') animation.startTime = start
      animations.push(animation)
      return animation
    }

    root.querySelectorAll<HTMLElement>('.intro__line-inner').forEach((line, index) => {
      enter(line, [
        { opacity: .5, transform: 'translate3d(0, 12px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], 440, index * 50)
    })

    const description = root.querySelector<HTMLElement>('.intro__description')
    if (description) {
      enter(description, [
        { opacity: .55, transform: 'translate3d(0, 4px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], 360, 70)
    }

    const art = root.querySelector<HTMLElement>('.hero-art')
    if (art) {
      enter(art, [
        { opacity: .65, transform: 'translate3d(6px, 0, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], 520, 20)
    }

    const trace = root.querySelector<SVGPathElement>('.hero-art__trace')
    if (trace) {
      const length = trace.getTotalLength()
      enter(trace, [
        { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
        { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 },
      ], 640, 40, 'cubic-bezier(.22, .8, .24, 1)')
    }

    if (chapter.id === 'care') {
      root.querySelectorAll<HTMLElement>('.hero-art__settle').forEach(node => {
        enter(node, [{ opacity: .2 }, { opacity: 1 }], 360, 400)
      })
    } else if (chapter.id === 'believe') {
      // Follow the drawn arc instead of cutting through it, so the experiment
      // dot and the line read as one gesture.
      const ball = root.querySelector<SVGCircleElement>('.hero-art__experiment')
      if (trace && ball) {
        const length = trace.getTotalLength()
        const end = trace.getPointAtLength(length)
        const frames = Array.from({ length: 15 }, (_, index) => {
          const point = trace.getPointAtLength((length * index) / 14)
          return {
            offset: index / 14,
            transform: `translate(${point.x - end.x}px, ${point.y - end.y}px)`,
          }
        })
        enter(ball, frames, 760, 80, 'cubic-bezier(.3, 0, .2, 1)')
      }
    } else if (chapter.id === 'now') {
      root.querySelectorAll<HTMLElement>('.hero-art__module').forEach((module, index) => {
        enter(module, [
          { opacity: .35, transform: `translate3d(${(index - 1) * 6}px, ${8 - index * 2}px, 0)` },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ], 440, 120 + index * 55)
      })
    }

    const cancel = () => { animations.forEach(animation => animation.cancel()) }
    const onPreference = () => { if (preference.matches) cancel() }
    preference.addEventListener('change', onPreference)
    return () => { cancel(); preference.removeEventListener('change', onPreference) }
  }, [active, chapter.id])

  function onMarkPointerMove(event: ReactPointerEvent<HTMLSpanElement>) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const node = markRef.current
    if (!node) return
    const bounds = node.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)))
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)))
    cancelAnimationFrame(markFrame.current)
    markFrame.current = requestAnimationFrame(() => {
      markFrame.current = 0
      node.style.setProperty('--mark-x', `${(x * 5).toFixed(2)}px`)
      node.style.setProperty('--mark-y', `${(y * 4).toFixed(2)}px`)
      node.style.setProperty('--mark-tilt', `${(x * 2.4).toFixed(2)}deg`)
    })
  }

  function resetMark() {
    cancelAnimationFrame(markFrame.current)
    markFrame.current = 0
    const node = markRef.current
    if (!node) return
    node.style.setProperty('--mark-x', '0px')
    node.style.setProperty('--mark-y', '0px')
    node.style.setProperty('--mark-tilt', '0deg')
  }

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
        <div ref={tabsRef} className="intro-tabs" role="tablist" aria-label="关于何扬">
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
          <div ref={chapterRoot} className={`intro__chapter intro__chapter--${chapter.id}`}>
            <div className={`intro__composition intro__composition--${chapter.id}`}>
              <h1 id="hero-heading" className={`intro__statement intro__statement--${chapter.id}`}>
                {chapter.lines.map((line, index) => (
                  <span key={index} className="intro__statement-line">
                    <span className="intro__line-inner">{line.before}{line.accent && <span className="intro__blue">{line.accent}</span>}{line.after}</span>
                  </span>
                ))}
              </h1>
              {chapter.id === 'who' && (
                <span ref={markRef} className="intro__curiosity-mark" aria-hidden="true"
                  onPointerMove={onMarkPointerMove} onPointerLeave={resetMark}>?</span>
              )}
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
