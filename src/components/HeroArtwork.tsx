import { useEffect, useRef, type CSSProperties } from 'react'
import { heroArtwork, type HeroChapterId } from '../data/hero'

export function HeroArtwork({ plane = 'back', chapter = 'who' }: { plane?: 'back' | 'front'; chapter?: HeroChapterId }) {
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
  }, [chapter])
  return (
    <div ref={root} className={`hero-art hero-art--${plane}`} aria-hidden="true">
      {heroArtwork.filter((art) => art.chapter === chapter && (plane === 'back' || art.foregroundClip)).map((art) => (
        <div key={art.id} className="hero-art__object" style={{
          '--art-x': art.x, '--art-y': art.y, '--art-size': art.size,
          '--art-mobile-x': art.mobileX, '--art-mobile-y': art.mobileY,
          '--art-mobile-size': art.mobileSize, '--art-rotate': art.rotate,
          '--art-depth': art.depth, aspectRatio: art.aspectRatio,
          clipPath: plane === 'front' ? art.foregroundClip : undefined,
          opacity: art.opacity, zIndex: art.layer,
        } as CSSProperties}>
          {art.src ? art.media === 'video'
            ? <video src={art.src} muted playsInline loop preload="metadata" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
            : <img src={art.src} alt="" decoding="async" fetchPriority="high" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
            : <div className="hero-art__motion"><svg className={`hero-art__graphic hero-art__graphic--${art.graphic}`} viewBox="0 0 1120 430" fill="none" focusable="false">
              {art.graphic === 'path' && <>
                <path d="M112 322V140c0-62 40-104 102-104s102 42 102 104v54" stroke="currentColor" strokeWidth="28" strokeLinecap="round" />
                <path d="M114 326h108c51 0 83-24 83-69v-14c0-25 19-45 45-45h120" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
                <path d="M310 341h588c25 0 42-15 42-39v-10" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                <path d="m919 307 21-21 21 21" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                <text x="100" y="384" className="hero-art__caption">LESS FRICTION. MORE FLOW.</text>
              </>}
              {art.graphic === 'cycle' && <>
                <path d="M100 205C99 113 172 42 263 42c79 0 136 43 158 103" stroke="currentColor" strokeWidth="34" strokeLinecap="round" />
                <path d="m371 129 58 32 17-62" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M435 231c0 92-74 151-165 151-80 0-143-41-165-103" stroke="currentColor" strokeWidth="34" strokeLinecap="round" />
                <path d="m153 300-58-37-20 65" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                <text x="159" y="131" className="hero-art__word" transform="rotate(-12 159 131)">MAKE</text>
                <text x="184" y="222" className="hero-art__word">TEST</text>
                <text x="205" y="312" className="hero-art__word" transform="rotate(8 205 312)">LEARN</text>
              </>}
              {art.graphic === 'modules' && <g transform="rotate(-9 245 220)">
                <path d="M100 49h174v78h42v97h-42v110H100Z" fill="currentColor" />
                <path d="M177 153h245v94h-55v55H177Z" fill="white" stroke="currentColor" strokeWidth="5" />
                <path d="M168 296h198v93H244v-33h-76Z" fill="currentColor" />
                <text x="121" y="106" className="hero-art__word hero-art__word--white">CONTENT</text>
                <text x="207" y="214" className="hero-art__word">PUBLISH</text>
                <text x="196" y="340" className="hero-art__word hero-art__word--white">REVIEW</text>
              </g>}
              {art.graphic === 'wip' && <>
                <path d="M142 344V58h252M142 344h96" stroke="currentColor" strokeWidth="12" strokeLinecap="square" />
                <path d="M164 82h208v240H164Z" stroke="currentColor" strokeWidth="2" strokeDasharray="8 10" />
                <path d="M108 58h22m12-34v22m252-22v22m14 12h22M108 344h22m12 13v22" stroke="currentColor" strokeWidth="2" />
                <g transform="rotate(-9 219 205)"><path d="M101 163h240v93H101Z" fill="currentColor" /><text x="129" y="230" className="hero-art__wip">WIP</text></g>
                <text x="166" y="399" className="hero-art__caption">WORK IN PROGRESS</text>
              </>}
            </svg></div>}
        </div>
      ))}
    </div>
  )
}
