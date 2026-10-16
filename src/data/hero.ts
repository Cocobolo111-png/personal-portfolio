// Personal statements based on the existing profile, project and currentFocus data.
export const heroChapters = [
  { id: 'who', label: 'WHO I AM', note: '你好，我是何扬。', headline: { greeting: '我是', name: '何扬', product: 'AI 产品', growth: '也做内容增长。' }, description: ['在产品、内容与增长之间，把想法做出来，', '再从真实反馈里迭代。'], keyword: 'Curious by nature.', tag: 'AI · PRODUCT · GROWTH' },
  { id: 'care', label: 'WHAT I CARE ABOUT', lines: [{ before: '让 AI 少一点门槛，', accent: '', after: '' }, { before: '让体验多一点', accent: '顺手', after: '。' }], description: ['从具体问题出发，降低理解与使用 AI 的门槛，', '让每一步都更容易开始，也更容易继续。'], keyword: 'LESS FRICTION. MORE FLOW.' },
  { id: 'believe', label: 'WHAT I BELIEVE IN', lines: [{ before: '先把想法做出来，', accent: '', after: '' }, { before: '再让', accent: '真实反馈', after: '说话。' }], description: ['先实践，再验证。记录发生了什么，', '让每一次尝试，成为下一次改进的起点。'], keyword: 'MAKE. TEST. LEARN.' },
  { id: 'build', label: 'WHAT I BUILD', lines: [{ before: '把内容工作流，', accent: '', after: '' }, { before: '做成', accent: '可复用', after: '的系统。' }], description: ['连接内容生产、发布与反馈，', '把一次次重复的动作，组织成可以复用的工作流。'], keyword: 'LESS REPETITION. MORE SYSTEM.' },
  { id: 'now', label: "WHAT I'M UP TO", lines: [{ before: '正在构建，', accent: '', after: '' }, { before: 'AI Content', accent: '', after: '' }, { before: '', accent: 'Growth OS.', after: '' }], description: ['正在搭建 AI Content Growth OS，', '连接内容工作流，在实践中持续完善。'], keyword: 'WORK IN PROGRESS' },
] as const

export type HeroChapterId = typeof heroChapters[number]['id']

export type HeroArtwork = {
  id: string
  chapter: HeroChapterId
  graphic?: 'path' | 'cycle' | 'modules' | 'wip'
  // Transparent image or video in public/; no model runtime required.
  src?: string
  media?: 'image' | 'video'
  aspectRatio: string
  foregroundClip?: string
  x: string
  y: string
  size: string
  mobileX: string
  mobileY: string
  mobileSize: string
  rotate: string
  opacity: number
  layer: number
  depth: number
}

// One shared asset: its folded corner is also rendered above the title.
// Replace src and these composition values when the personal artwork arrives.
export const heroArtwork: HeroArtwork[] = [
  { id: 'creative-fold', chapter: 'who', src: '/hero/creative-fold.png', media: 'image', aspectRatio: '1196 / 1315', foregroundClip: 'polygon(54% 74%, 85% 66%, 77% 97%, 53% 94%)', x: '20%', y: '50%', size: '40.2%', mobileX: '18%', mobileY: '66%', mobileSize: '130px', rotate: '0deg', opacity: 1, layer: 0, depth: 0 },
  { id: 'open-path', chapter: 'care', graphic: 'path', aspectRatio: '1120 / 430', x: '50%', y: '50%', size: '100%', mobileX: '50%', mobileY: '50%', mobileSize: '100%', rotate: '0deg', opacity: 1, layer: 0, depth: 0 },
  { id: 'feedback-cycle', chapter: 'believe', graphic: 'cycle', aspectRatio: '1120 / 430', foregroundClip: 'inset(78% 42% 0 0)', x: '50%', y: '50%', size: '100%', mobileX: '50%', mobileY: '50%', mobileSize: '100%', rotate: '0deg', opacity: 1, layer: 0, depth: 0 },
  { id: 'workflow-modules', chapter: 'build', graphic: 'modules', aspectRatio: '1120 / 430', foregroundClip: 'inset(76% 60% 0 0)', x: '50%', y: '50%', size: '100%', mobileX: '50%', mobileY: '50%', mobileSize: '100%', rotate: '0deg', opacity: 1, layer: 0, depth: 0 },
  { id: 'open-construction', chapter: 'now', graphic: 'wip', aspectRatio: '1120 / 430', x: '50%', y: '50%', size: '100%', mobileX: '50%', mobileY: '50%', mobileSize: '100%', rotate: '0deg', opacity: 1, layer: 0, depth: 0 },
]
