import { useEffect, useRef, type CSSProperties } from 'react'
import { heroArtwork } from '../data/hero'

export function HeroArtwork({ plane = 'back' }: { plane?: 'back' | 'front' }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const videos = root.current?.querySelectorAll('video')
    if (!videos?.length) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const update = () => videos.forEach((video) => {
      if (visible && !preference.matches) void video.play().catch(() => {})
      else video.pause()
    })
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(root.current!)
    preference.addEventListener('change', update)
    return () => { observer.disconnect(); preference.removeEventListener('change', update); videos.forEach((video) => video.pause()) }
  }, [])
  return (
    <div ref={root} className={`hero-art hero-art--${plane}`} aria-hidden="true">
      {heroArtwork.filter((art) => plane === 'back' || art.foregroundClip).map((art) => (
        <div key={art.id} className="hero-art__object" style={{
          '--art-x': art.x, '--art-y': art.y, '--art-size': art.size,
          '--art-mobile-x': art.mobileX, '--art-mobile-y': art.mobileY,
          '--art-mobile-size': art.mobileSize, '--art-rotate': art.rotate,
          '--art-depth': art.depth, aspectRatio: art.aspectRatio,
          clipPath: plane === 'front' ? art.foregroundClip : undefined,
          opacity: art.opacity, zIndex: art.layer,
        } as CSSProperties}>
          {art.media === 'video'
            ? <video src={art.src} muted playsInline loop preload="metadata" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
            : <img src={art.src} alt="" decoding="async" fetchPriority="high" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />}
        </div>
      ))}
    </div>
  )
}
