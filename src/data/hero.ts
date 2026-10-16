// Personal statements based on the existing profile, project and currentFocus data.
export const heroChapters = [
  { id: 'who', label: 'WHO I AM', note: '你好，我是何扬。', headline: { greeting: '我是', name: '何扬', product: 'AI 产品', growth: '也做内容增长。' }, description: ['在产品、内容与增长之间，把想法做出来，', '再从真实反馈里迭代。'], keyword: 'Curious by nature.', tag: 'AI · PRODUCT · GROWTH' },
  { id: 'care', label: 'WHAT I CARE ABOUT', note: '我在意的，是屏幕另一端的人。', line: '少一点复杂，', emphasis: '多一点好用。', description: '从具体问题出发，关注一个产品是否让人更容易理解、行动和坚持。', keyword: 'People come first.', tag: 'CLARITY · EVERYDAY USE' },
  { id: 'believe', label: 'WHAT I BELIEVE IN', note: '好想法，要到真实世界里试一试。', line: '先动手做，', emphasis: '再让反馈说话。', description: '不把发布当作终点。记录发生了什么，让每一次尝试成为下一次的起点。', keyword: 'Make. Learn. Repeat.', tag: 'BUILD · REVIEW · LEARN' },
  { id: 'build', label: 'WHAT I BUILD', note: '把内容工作流，变成可以持续运行的系统。', line: '连接产品、内容，', emphasis: '和下一次增长。', description: '正在搭建 AI 内容增长系统，串起洞察、计划、制作、发布与复盘。', keyword: 'Ideas into practice.', tag: 'AI CONTENT GROWTH · WIP' },
  { id: 'now', label: "WHAT I'M UP TO", note: '此刻，继续动手，也继续学习。', line: '保持好奇，', emphasis: '让想法继续生长。', description: '搭建 AI 内容增长系统，学习产品与增长方法，探索内容工作流的产品化。', keyword: 'Always in motion.', tag: 'BUILDING · LEARNING · EXPLORING' },
] as const

export type HeroArtwork = {
  id: string
  // Transparent image or video in public/; no model runtime required.
  src: string
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
  { id: 'creative-fold', src: '/hero/creative-fold.png', media: 'image', aspectRatio: '1196 / 1315', foregroundClip: 'polygon(54% 74%, 85% 66%, 77% 97%, 53% 94%)', x: '20%', y: '50%', size: '40.2%', mobileX: '18%', mobileY: '66%', mobileSize: '130px', rotate: '0deg', opacity: 1, layer: 0, depth: 0 },
]
