import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowIcon } from '../components/ArrowIcon'
import type { CaseImage, CaseVideo, Project } from '../data/projects'
import { siteUrl } from '../paths'

function ProductImage({ image, className = '', eager = false }: { image: CaseImage; className?: string; eager?: boolean }) {
  return (
    <figure className={`case-image ${image.portrait ? 'case-image--portrait' : ''} ${className}`}>
      <div className="case-image__frame"><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" /></div>
      <figcaption>{image.caption}</figcaption>
    </figure>
  )
}

function ProductVideo({ video, fallbackPoster }: { video: CaseVideo; fallbackPoster: string }) {
  return <figure className={`case-video ${video.portrait ? 'case-video--portrait' : ''}`} data-case-reveal>
    <video controls preload="none" poster={video.poster ?? fallbackPoster} playsInline aria-label={video.caption}>
      <source src={video.src} type={video.src.endsWith('.mp4') ? 'video/mp4' : 'video/webm'} />
      <a href={video.src}>查看演示视频</a>
    </video>
    <figcaption>{video.caption}</figcaption>
  </figure>
}

function ColorComparison({ before, after, note }: { before: CaseImage; after: CaseImage; note: string }) {
  const [position, setPosition] = useState(50)
  return <figure className="case-comparison">
    <div className="case-comparison__images" style={{ '--comparison-position': `${position}%` } as CSSProperties}>
      <img src={after.src} alt={after.alt} width={after.width} height={after.height} loading="lazy" />
      <img className="case-comparison__before" src={before.src} alt={before.alt} width={before.width} height={before.height} loading="lazy" />
      <span className="case-comparison__label case-comparison__label--before" aria-hidden="true">{before.caption}</span>
      <span className="case-comparison__label case-comparison__label--after" aria-hidden="true">{after.caption}</span>
      <span className="case-comparison__handle" aria-hidden="true"><span><svg width="24" height="18" viewBox="0 0 24 18" fill="none"><path d="m8 4-5 5 5 5M16 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></span>
      <input type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} aria-label={`拖动比较${before.caption}与${after.caption}`} aria-valuetext={`${before.caption}显示 ${position}%，${after.caption}显示 ${100 - position}%`} />
    </div><figcaption>{note}</figcaption>
  </figure>
}

export function ProjectCaseStudy({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null)
  const study = project.caseStudy
  const features = study?.features ?? []
  const evolutions = study?.evolution ?? []
  const [featureIndex, setFeatureIndex] = useState(0)
  const [evolutionIndex, setEvolutionIndex] = useState(() => Math.max(0, evolutions.length - 1))

  useEffect(() => {
    const oldTitle = document.title
    document.title = `${project.title} — 何扬的项目案例`
    const section = root.current
    if (!section) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: .1, rootMargin: '0px 0px -35px 0px' })
    const configure = () => {
      observer.disconnect()
      section.classList.toggle('case-study--motion', !preference.matches)
      section.querySelectorAll('[data-case-reveal]').forEach(element => {
        if (preference.matches) element.classList.add('is-visible')
        else observer.observe(element)
      })
    }
    configure()
    preference.addEventListener('change', configure)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', configure)
      document.title = oldTitle
    }
  }, [project.title])

  if (!study || project.visual.kind !== 'image') return null
  const feature = features[featureIndex]
  const evolution = evolutions[evolutionIndex]
  const cover = project.visual.image
  const portrait = project.visual.ratio === 'portrait'
  const home = siteUrl('#work')

  return (
    <article ref={root} className={`case-study ${study.displayTitle ? 'case-study--extended' : ''} ${portrait ? 'case-study--portrait' : ''}`}>
      <header className="case-hero case-wrap" id="top">
        <div className="case-hero__topline"><a className="case-back" href={home}><span aria-hidden="true">←</span> 返回 Work</a><span>{study.context} / {study.period}</span></div>
        <h1 className="case-hero__title">{study.displayTitle ?? project.englishTitle}<span>.</span></h1>
        <div className="case-hero__intro"><p>{study.introduction}</p><div><strong>{project.title}</strong><span>{study.role}</span><span>{study.maturity}</span></div></div>
        <figure className="case-hero__cover"><img src={cover.src} alt={cover.alt} width={(cover as Partial<CaseImage>).width ?? 1920} height={(cover as Partial<CaseImage>).height ?? 1080} fetchPriority="high" /><figcaption>{study.coverCaption}</figcaption></figure>
      </header>

      <nav className="case-index" aria-label="项目案例章节"><div className="case-wrap"><span>{project.title.split(' · ')[0]} <span aria-hidden="true">/</span> Case study</span><div>
        <a href="#case-beginning">缘起</a><a href="#case-experience">体验</a>
        {study.narrative && <a href="#case-narrative">真实案例</a>}
        {study.aiAnalysis && <a href="#case-ai-analysis">AI 分析</a>}
        {evolutions.length > 0 && <a href="#case-evolution">迭代</a>}
        <a href="#case-outcome">回看</a>
      </div><a href={home} className="case-index__back">全部项目 <ArrowIcon /></a></div></nav>

      <section className="case-beginning case-wrap case-section" id="case-beginning">
        <h2>{study.beginning.title}</h2><div className="case-beginning__body" data-case-reveal>
          <div className="case-prose">{study.beginning.paragraphs.map(text => <p key={text}>{text}</p>)}{study.question && <p className="case-beginning__question">{study.question.lead}<br /><strong>{study.question.emphasis}</strong></p>}</div>
          <ProductImage image={study.beginning.image} />
        </div>
      </section>

      <section className="case-experience case-section" id="case-experience"><div className="case-wrap">
        <div className="case-section__heading"><h2>{study.experience.title}</h2><p>{study.experience.description}</p></div>
        {study.walkthrough && <ProductVideo video={study.walkthrough} fallbackPoster={cover.src} />}
        {study.daily && <div className="case-daily" data-case-reveal><ProductImage image={study.daily.image} /><div><h3>{study.daily.title}</h3><p>{study.daily.description}</p></div></div>}
        {feature && <div className="case-feature-picker" data-case-reveal>
          <div className="case-feature-picker__copy"><div className="case-feature-picker__buttons" aria-label="选择产品功能">{features.map((item, index) => <button key={item.label} type="button" aria-pressed={featureIndex === index} aria-controls="case-feature-view" onClick={() => setFeatureIndex(index)}>{item.label}</button>)}</div><div aria-live="polite"><h3>{feature.title}</h3><p>{feature.description}</p></div></div>
          <div id="case-feature-view"><ProductImage image={feature.image} /></div>
        </div>}
      </div></section>

      {study.narrative && <section className="case-narrative case-wrap case-section" id="case-narrative">
        <div className="case-section__heading"><h2>{study.narrative.title}</h2><p>{study.narrative.description}</p></div>
        <ol className="case-narrative__steps">{study.narrative.steps.map((step, index) => <li key={step.title} data-case-reveal><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p>{step.quote && <blockquote>{step.quote}</blockquote>}</div></li>)}</ol>
        <div className="case-source-results" data-case-reveal><h3>这条内容的发布结果</h3><dl>{study.narrative.results.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl><p>{study.narrative.resultNote}</p></div>
        <div className="case-datasets"><h3>四类证据，分别回答不同问题。</h3><div className="case-table-scroll" tabIndex={0} role="region" aria-label="数据来源与验证边界表格，可横向滚动"><table><caption>数据来源与验证边界 · 不跨平台或评分标准合并</caption><thead><tr><th scope="col">资料</th><th scope="col">已知结果</th><th scope="col">来源</th><th scope="col">边界</th></tr></thead><tbody>{study.narrative.datasets.map(item => <tr key={item.name}><th scope="row">{item.name}</th><td>{item.result}</td><td>{item.source}</td><td>{item.boundary}</td></tr>)}</tbody></table></div></div>
        <details className="case-sources"><summary>查看历史资料与缺失项</summary><ul>{study.narrative.sources.map(source => <li key={source}>{source}</li>)}</ul></details>
      </section>}

      {study.aiAnalysis && <section className="case-ai-analysis case-wrap case-section" id="case-ai-analysis">
        <div className="case-section__heading"><h2>{study.aiAnalysis.title}</h2><p>{study.aiAnalysis.description}</p></div>
        <div className="case-ai-analysis__media"><ProductImage image={study.aiAnalysis.image} /><ProductVideo video={study.aiAnalysis.video} fallbackPoster={study.aiAnalysis.image.src} /></div>
        <div className="case-reflection__columns">{study.aiAnalysis.notes.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.description}</p></div>)}</div>
        <a className="case-evidence-link" href={study.aiAnalysis.evidenceUrl}>查看本次调用的非敏感证据 <ArrowIcon /></a>
      </section>}

      {evolution && study.evolutionHeading && <section className="case-evolution case-wrap case-section" id="case-evolution">
        <div className="case-section__heading"><h2>{study.evolutionHeading.title}</h2><p>{study.evolutionHeading.description}</p></div>
        <div className="case-evolution__steps" style={{ '--evolution-count': evolutions.length } as CSSProperties} aria-label="选择项目迭代阶段">{evolutions.map((item, index) => <button key={item.label} type="button" aria-pressed={evolutionIndex === index} aria-controls="case-evolution-view" onClick={() => setEvolutionIndex(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}<span className="case-evolution__dot" aria-hidden="true" /></button>)}</div>
        <div className="case-evolution__view" id="case-evolution-view" data-case-reveal><div className="case-evolution__copy"><h3>{evolution.title}</h3><p>{evolution.description}</p></div>{evolutionIndex === evolutions.length - 1 && study.comparison ? <ColorComparison {...study.comparison} /> : <ProductImage image={evolution.image} eager />}</div>
      </section>}

      <section className="case-outcome case-section" id="case-outcome"><div className="case-wrap">
        <div className="case-section__heading"><h2>{study.outcomeHeading.title}</h2><p>{study.outcomeHeading.description}</p></div>
        {study.proof && <><div className="case-proof" data-case-reveal>{[study.proof.before, study.proof.after].map(image => <ProductImage key={image.src} image={image} className="case-proof__image" />)}</div><p className="case-proof__caption">{study.proof.caption}</p></>}
        <div className="case-deliverables">{study.outcomes.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.description}</p></div>)}</div>
      </div></section>

      <section className="case-reflection case-wrap case-section"><h2>我负责做判断，<br /><span>AI 帮我把判断落地。</span></h2><div className="case-reflection__columns">{study.reflections.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.description}</p></div>)}</div><p className="case-evidence-note">{study.evidenceNote}</p></section>
      <footer className="case-next case-wrap"><p>把想法做成作品，<br />再从作品里继续学习。</p><a href={home}>返回全部项目 <ArrowIcon /></a></footer>
    </article>
  )
}
