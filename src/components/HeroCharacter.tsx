import { useEffect, useRef, useState } from 'react'
import { siteUrl } from '../paths'

const poster = siteUrl('hero/character/curious-character.webp')
const source = siteUrl('hero/character/curious-character.mp4')

export function HeroCharacter({ active }: { active: boolean }) {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [hasFrame, setHasFrame] = useState(false)
  const [motionAllowed, setMotionAllowed] = useState(false)

  useEffect(() => {
    const node = root.current
    const media = video.current
    if (!node || !media) return
    const desktop = window.matchMedia('(min-width: 1001px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let disposed = false
    let frame = 0
    const eligible = () => active && desktop.matches && !reduced.matches && visible && !document.hidden
    const reveal = () => {
      if (media.requestVideoFrameCallback) {
        if (frame) media.cancelVideoFrameCallback(frame)
        frame = media.requestVideoFrameCallback(() => { if (!disposed) setHasFrame(true) })
      } else if (media.readyState >= 2) setHasFrame(true)
    }
    const sync = () => {
      setMotionAllowed(active && desktop.matches && !reduced.matches)
      if (!eligible()) {
        media.pause()
        return
      }
      media.muted = true
      if (!media.getAttribute('src')) {
        media.src = source
        media.load()
      }
      void media.play().then(() => {
        if (disposed || !eligible()) { media.pause(); return }
        reveal()
      }).catch(() => { /* Autoplay denial leaves the static cover visible. */ })
    }
    const failed = () => { media.pause(); setHasFrame(false) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .05 })
    observer.observe(node)
    desktop.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    media.addEventListener('error', failed)
    sync()
    return () => {
      disposed = true
      observer.disconnect()
      desktop.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      media.removeEventListener('error', failed)
      if (frame) media.cancelVideoFrameCallback(frame)
      media.pause()
    }
  }, [active])

  return <figure ref={root} hidden={!active} className={`hero-character${hasFrame && motionAllowed ? ' is-ready' : ''}`}>
    <div className="hero-character__media">
      <img src={poster} alt="3D 人物伸手触碰蓝色星球" width="900" height="1200" fetchPriority="high" decoding="async" />
      <video ref={video} autoPlay muted loop playsInline preload="none" poster={poster} width="900" height="1200" aria-hidden="true" tabIndex={-1} />
    </div>
  </figure>
}
