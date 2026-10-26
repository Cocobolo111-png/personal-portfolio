import { useEffect, useRef } from 'react'
import { story } from '../data/story'

function DownArrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" /></svg>
}

function ChapterTitle({ index }: { index: number }) {
  const chapter = story.chapters[index]
  return <header className="story-chapter-heading"><h2 id={`${chapter.id}-heading`}>{chapter.title}</h2></header>
}

function Paragraphs({ paragraphs }: { paragraphs: readonly string[] }) {
  return <>{paragraphs.map(text => <p key={text}>{text}</p>)}</>
}

export function StoryPage() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Story — 何扬'
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animation: Animation | undefined
    // Retain only the existing draft's finite settle; all text is visible by default.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (preference.matches || !entry.target.animate) return
        animation = entry.target.animate([
          { transform: 'rotate(3deg) translateY(8px)' },
          { transform: 'rotate(-2deg) translateY(0)' },
        ], { duration: 750, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' })
      })
    }, { threshold: .25 })
    root.current?.querySelectorAll('.story-draft').forEach(element => observer.observe(element))
    const stop = () => { if (preference.matches) animation?.cancel() }
    preference.addEventListener('change', stop)
    return () => {
      observer.disconnect()
      animation?.cancel()
      preference.removeEventListener('change', stop)
      document.title = previousTitle
    }
  }, [])

  const [quiet, restless, making] = story.chapters
  return <div ref={root} className="story" id="top">
    <section className="story-opening" aria-labelledby="story-heading">
      <div className="story-opening__edition"><span>STORY</span><p>{story.subtitle}</p></div>
      <div className="story-opening__spread">
        <h1 id="story-heading" aria-label={story.title}>{story.titleLines.map((line, index) => <span key={line} className={index === 1 ? 'story-opening__restless' : undefined}>{line}</span>)}</h1>
        <div className="story-opening__aside">
          <svg className="story-opening__spark" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 3v94M3 50h94M17 17l66 66M17 83l66-66" stroke="currentColor" strokeWidth="13" /></svg>
          <div className="story-opening__note story-prose"><Paragraphs paragraphs={story.opening} /></div>
          <blockquote className="story-opening__quote"><p>{story.openingQuote}</p></blockquote>
        </div>
      </div>
      <a href="#sides" className="story-read">往下翻翻<DownArrow /></a>
    </section>

    <section id="sides" className="story-duality" aria-label="慢与快，两种性格">
      <section id={quiet.id} className="story-quiet story-chapter" aria-labelledby="quiet-heading">
        <ChapterTitle index={0} />
        <div className="story-paper" aria-hidden="true"><span className="story-paper__character">慢</span></div>
        <p className="story-lead">{quiet.lead}</p>
        <div className="story-prose"><Paragraphs paragraphs={quiet.paragraphs} /></div>
      </section>
      <section id={restless.id} className="story-restless story-chapter" aria-labelledby="restless-heading">
        <ChapterTitle index={1} />
        <svg className="story-orbit" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="2.5"><ellipse cx="200" cy="200" rx="182" ry="68" transform="rotate(-28 200 200)" /><ellipse cx="200" cy="200" rx="182" ry="68" transform="rotate(28 200 200)" /><ellipse cx="200" cy="200" rx="182" ry="68" transform="rotate(90 200 200)" /></g>
          <circle cx="321" cy="137" r="13" fill="currentColor" />
        </svg>
        <p className="story-lead">{restless.lead}</p>
        <div className="story-prose"><Paragraphs paragraphs={restless.paragraphs} /></div>
      </section>
    </section>

    <section id={making.id} className="story-making story-chapter" aria-labelledby="making-heading">
      <ChapterTitle index={2} />
      <div className="story-making__spread">
        <div className="story-making__start">
          <p className="story-lead">{making.lead}</p>
          <div className="story-draft story-prose"><p>{making.paragraphs[0]}</p></div>
          <div className="story-prose"><p>{making.paragraphs[1]}</p></div>
        </div>
        <div className="story-making__future">
          <div className="story-prose"><Paragraphs paragraphs={making.paragraphs.slice(2)} /></div>
          <p className="story-making__ending">{story.ending}</p>
          <div className="story-ending__signoff"><p>{story.signoff}</p><span>{story.signature}</span></div>
        </div>
      </div>
    </section>
  </div>
}
