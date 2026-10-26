import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AskHyPanel } from '../components/AskHyPanel'
import { ArrowIcon } from '../components/ArrowIcon'
import { useAskHy } from '../hooks/useAskHy'
import { analyze, type Outcome } from '../data/funGameRules'
import { siteUrl } from '../paths'

const media = (file: string) => siteUrl(`fun/${file}`)
type Preview = 'beads' | 'journal' | 'jobflow' | 'next-round' | 'time-planning'
const demoMatches: Outcome[] = ['loss', 'loss', 'win', 'loss', 'win']

function Clip({ src, poster, label, className = '' }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const play = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const video = ref.current
    if (video && !video.src) { video.src = src; video.load() }
    void video?.play().catch(() => {})
  }
  const pause = () => { const video = ref.current; if (!video) return; video.pause(); video.removeAttribute('src'); video.load() }
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause() })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return <div className={`fun-clip ${className}`} onPointerEnter={play} onPointerLeave={pause} onFocus={play} onBlur={pause}>
    <video ref={ref} poster={poster} muted playsInline preload="none" aria-label={label} />
    <span className="fun-media-note" aria-hidden="true">Hover to play <span>↗</span></span>
  </div>
}

function GalleryCard({ id, title, description, kind, action, children, onOpen, className = '' }: { id: Preview; title: string; description: string; kind: string; action: string; children: ReactNode; onOpen: (id: Preview, trigger: HTMLButtonElement) => void; className?: string }) {
  return <article className={`fun-card ${className}`} id={id}>
    <button className="fun-card__open" type="button" onClick={event => onOpen(id, event.currentTarget)} aria-label={`${action}：${title}`}>
      <div className="fun-card__media">{children}<span className="fun-card__action">{action} <ArrowIcon /></span></div>
      <div className="fun-card__caption"><div><h2>{title}</h2><p>{description}</p></div><span>{kind}</span></div>
    </button>
  </article>
}

function NextRoundDemo() {
  const [outcomes, setOutcomes] = useState<Outcome[]>(demoMatches)
  const result = analyze(outcomes)
  return <div className="fun-game">
    <div className="fun-game__head"><strong>下一把<span> //</span></strong><span>手动体验 / Demo</span></div>
    <p className="fun-game__hint">点一下，把胜负换个方向。<br />从最新一局开始，只算眼前的战绩。</p>
    <div className="fun-game__matches" aria-label="示例对局，最新到最早">{outcomes.map((outcome, index) => <button type="button" key={index} className={outcome} aria-label={`第 ${index + 1} 场，${outcome === 'win' ? '胜' : '败'}，点击切换`} onClick={() => setOutcomes(current => current.map((value, i) => i === index ? value === 'win' ? 'loss' : 'win' : value))}>{outcome === 'win' ? '胜' : '败'}<small>{index === 0 ? '最新' : `0${index + 1}`}</small></button>)}</div>
    <div className="fun-game__result" aria-live="polite"><div><span>历史胜率</span><strong>{result.winRate}<small>%</small></strong></div><div><span>娱乐指数</span><strong>{result.score}<small>/100</small></strong></div><p>{result.title}<b>{result.advice} ↗</b></p></div>
    <p className="fun-game__boundary">复用「下一把」原项目的透明统计规则。示例数据仅在本页内存中变化；不含 OCR，不预测下一局，不代表隐藏分或官方匹配算法。</p>
    <button type="button" className="fun-text-button" onClick={() => setOutcomes(demoMatches)}>恢复示例 ↺</button>
  </div>
}

function PreviewDialog({ id, onClose, trigger }: { id: Preview; onClose: () => void; trigger: HTMLElement | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const [jobIndex, setJobIndex] = useState(0)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = ref.current
    dialog?.querySelector<HTMLElement>('button')?.focus()
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current() }
      if (event.key !== 'Tab') return
      const items = [...(dialog?.querySelectorAll<HTMLElement>('button, a[href], video[controls]') ?? [])].filter(item => item.offsetParent !== null)
      if (!items.length) return
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus() }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus() }
    }
    document.addEventListener('keydown', handle)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handle); trigger?.focus({ preventScroll: true }) }
  }, [trigger])
  const titles: Record<Preview, string> = { beads: '手上没串？盘两下。', journal: '走进两个人的世界。', jobflow: 'JobFlow · 少做一点重复劳动', 'next-round': '王者胜率实验 · 下一把', 'time-planning': '时间规划实验 · Growth OS' }
  const jobImages = [{ file: 'jobflow-board.webp', label: '岗位管理', caption: '虚构岗位与简历 · 在原扩展的隔离浏览器中验收。填写记录与真实投递状态分开。' }, { file: 'jobflow-report.webp', label: '字段核验', caption: '原扩展的字段核验界面 · 使用合成测试资料，不是真实候选人的投递记录。' }, { file: 'jobflow-import.webp', label: '事实导入', caption: '原扩展的导入预览 · 冲突需要本人核对，不静默覆盖已有资料。' }]
  return <div className="fun-modal" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div ref={ref} className={`fun-modal__dialog fun-modal__dialog--${id}`} role="dialog" aria-modal="true" aria-labelledby="fun-preview-title">
      <header><h2 id="fun-preview-title">{titles[id]}</h2><button type="button" onClick={onClose} aria-label="关闭作品预览"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" /></svg></button></header>
      {id === 'next-round' ? <NextRoundDemo /> : id === 'jobflow' ? <div className="fun-job-preview"><div className="fun-job-preview__tabs">{jobImages.map((item, index) => <button key={item.file} type="button" aria-pressed={index === jobIndex} onClick={() => setJobIndex(index)}>{item.label}</button>)}</div><img src={media(jobImages[jobIndex].file)} alt={`JobFlow ${jobImages[jobIndex].label}真实界面`} /><p>{jobImages[jobIndex].caption}</p><p>V0.1.1 本地 Chrome / Edge 扩展。支持收藏岗位、关联简历、辅助填写与核验；最终提交由本人操作。此处为截图演示。</p></div> : <div className="fun-video-preview">
        <video controls playsInline preload="metadata" poster={id === 'beads' ? media('panliangxia-stage.webp') : id === 'journal' ? siteUrl('projects/love-journal/hero.jpg') : media('time-planning.webp')} src={id === 'beads' ? media('panliangxia.mp4') : id === 'journal' ? siteUrl('projects/love-journal/portal-walkthrough.webm') : media('time-planning.mp4')} />
        <p>{id === 'beads' ? '原 H5 真实盘串操作 · 独立浏览器默认存档 · 本页播放录像，不代表公开服务。' : id === 'journal' ? '真实入口穿越录像 · 隔离空状态 · 无私人照片、留言或生活记录。植物场景为既有 AI 图像。' : '原 Growth OS 的时间块界面与编辑操作 · 使用新建示例数据库，不包含私人日程。与 AI Content Growth System 是不同项目。'}</p>
        {id !== 'time-planning' && <a className="fun-text-button" href={siteUrl(`work/${id === 'beads' ? 'panliangxia' : 'love-journal'}`)}>看看它怎么做出来的 <ArrowIcon /></a>}
      </div>}
    </div>
  </div>
}

export function FunPage() {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<Preview | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const previewTrigger = useRef<HTMLElement | null>(null)
  const chat = useAskHy()
  useEffect(() => {
    const previous = document.title
    document.title = 'Fun — 何扬的创意实验室'
    if (window.location.hash === '#ask-hy') setOpen(true)
    return () => { document.title = previous }
  }, [])
  const show = (id: Preview, trigger: HTMLButtonElement) => { previewTrigger.current = trigger; setPreview(id) }
  return <div className="fun-page" id="top">
    <header className="fun-header fun-wrap"><h1>Fun<span>.</span></h1><div><p>正经做产品，<br />不妨碍偶尔做点奇怪的。</p><span>小创造、生活里的念头，以及一些「要不试试」。</span></div></header>
    <div className="fun-gallery fun-wrap">
      <article className="fun-ask" id="ask-hy" aria-labelledby="fun-ask-title">
        <div className="fun-ask__copy"><h2 id="fun-ask-title">Ask HY<span>?</span></h2><p>一个了解我作品的 AI，<br />偶尔也会替我想些奇怪的问题。</p><button type="button" ref={triggerRef} className="fun-ask__cta" onClick={() => setOpen(true)}>和它聊聊 <ArrowIcon /></button><small>不是本人。公开事实、AI 推测，会分开说。</small></div>
        <button type="button" className="fun-ask__preview" aria-label="打开 Ask HY 真实对话面板" onClick={() => setOpen(true)}><img src={media('ask-hy-live.webp')} alt="Ask HY 真实对话：先有鸡还是先有蛋，回答标注 AI 推测" width="420" height="764" /><span>一段真实对话。接下来，轮到你。</span></button>
      </article>
      <GalleryCard id="beads" title="盘两下" description="手上没串？屏幕里也能盘两下。" kind="Interactive Toy" action="看它动起来" onOpen={show} className="fun-card--beads"><Clip src={media('panliangxia.mp4')} poster={media('panliangxia-stage.webp')} label="盘两下真实盘串录像" /></GalleryCard>
      <GalleryCard id="journal" title="Love Journal" description="给两个人的回忆，留一个可以走进去的地方。" kind="Personal Website" action="走进去看看" onOpen={show} className="fun-card--journal"><Clip src={siteUrl('projects/love-journal/portal-walkthrough.webm')} poster={siteUrl('projects/love-journal/hero.jpg')} label="Love Journal 真实植物入口穿越录像" /></GalleryCard>
      <GalleryCard id="jobflow" title="JobFlow" description="投简历这件事，能不能少做一点重复劳动？" kind="Local Tool" action="看看真实流程" onOpen={show} className="fun-card--jobflow"><img src={media('jobflow-board.webp')} alt="JobFlow 的岗位管理，两个虚构岗位的演示记录" width="1440" height="1000" loading="lazy" /><span className="fun-cover-note">收藏 → 关联简历 → 辅助填写 → 自己提交</span></GalleryCard>
      <GalleryCard id="next-round" title="下一把" description="王者胜率实验。玄学归玄学，先看清上一把。" kind="Playable Demo" action="换个战绩试试" onOpen={show} className="fun-card--game"><img src={media('next-round-report.webp')} alt="下一把原项目的娱乐状态报告，使用已标注的测试战绩" width="540" height="2074" loading="lazy" /><span className="fun-game-sticker">不包赢。<br />可以玩。</span></GalleryCard>
      <GalleryCard id="time-planning" title="时间规划实验" description="把散落的时间，重新摆在眼前。" kind="Time Experiment" action="看时间如何被安排" onOpen={show} className="fun-card--time"><Clip src={media('time-planning.mp4')} poster={media('time-planning.webp')} label="Growth OS 真实示例时间块和编辑录像" /><span className="fun-cover-note">原项目 Growth OS · 示例周 / 本地时间块</span></GalleryCard>
    </div>
    <footer className="fun-end fun-wrap"><p>有些想法，<br />做出来就已经很好玩。</p><a href={siteUrl('#work')}>回去看看正经作品 <ArrowIcon /></a></footer>
    {open && <AskHyPanel messages={chat.messages} status={chat.status} error={chat.error} mode={chat.mode} onSend={text => { void chat.send(text) }} onRetry={chat.retry} onClose={() => setOpen(false)} returnFocusRef={triggerRef} />}
    {preview && <PreviewDialog key={preview} id={preview} trigger={previewTrigger.current} onClose={() => setPreview(null)} />}
  </div>
}
