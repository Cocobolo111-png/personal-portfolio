export type ProjectStatus = 'In Progress' | 'Building' | 'Coming Soon' | 'Published'

export type ProjectImage = {
  src: string
  alt: string
}

export type ShowcaseTag = string | {
  label: string
  side?: 'left' | 'right'
  row?: number
  rotation?: number
  expandedRotation?: number
}

export type ProjectVisual =
  | { kind: 'workflow'; label: string; steps: string[] }
  | { kind: 'image'; image: ProjectImage; ratio?: 'wide' | 'standard' | 'portrait' }
  | { kind: 'gallery'; images: ProjectImage[]; ratio?: 'wide' | 'standard' | 'portrait' }
  | { kind: 'comparison'; before: ProjectImage; after: ProjectImage; ratio?: 'wide' | 'standard' | 'portrait' }

export type Project = {
  slug: string
  title: string
  englishTitle: string
  category: string
  details: { label: string; value: string }[]
  status: ProjectStatus
  visual: ProjectVisual
  caseStudyUrl?: string
  featured: boolean
  visible: boolean
  showcase?: {
    statement: string
    background: string
    tagBackground: string
    tagColor: string
    tags: ShowcaseTag[]
    ctaLabel: string
    demoUrl?: string
  }
}

export const projects: Project[] = [
  {
    slug: 'ai-content-growth-system',
    title: 'AI 内容增长系统',
    englishTitle: 'AI CONTENT GROWTH SYSTEM',
    category: 'AI PRODUCT · OPERATIONS · GROWTH',
    details: [
      { label: 'Problem', value: '内容生产需要持续判断：下一条做什么、为什么做，以及发布后学到了什么。' },
      { label: 'System', value: 'Insight → Plan → Build → Publish → Review → Learn' },
      { label: 'My Role', value: 'Product · Operations · Content · Growth' },
    ],
    status: 'In Progress',
    visual: {
      kind: 'workflow',
      label: 'GROWTH LOOP · STRUCTURE IN PROGRESS',
      steps: ['Insight', 'Plan', 'Build', 'Publish', 'Review', 'Learn'],
    },
    featured: true,
    visible: false,
  },
  {
    slug: 'love-journal',
    title: '予你 · Love Journal',
    englishTitle: 'LOVE JOURNAL',
    category: '个人产品实践 · 产品定义 · AI 协作 · 本地优先 Web',
    details: [
      { label: 'Problem', value: '让日常、纪念日、心愿与影像既能被记录，也值得再次走进。' },
      { label: 'My Role', value: '产品定义、体验判断、视觉方向与 AI 协作推进。' },
    ],
    status: 'Building',
    visual: {
      kind: 'image',
      image: {
        src: '/projects/love-journal/hero.jpg',
        alt: '予你 Love Journal 的真实网页界面：暖色植物入口、黄昏远景与 Step Into Our World 标题；隔离环境默认空状态，无私人资料。',
      },
      ratio: 'wide',
    },
    showcase: {
      statement: '把日常记录，变成愿意再次走进的私人记忆空间。',
      background: '#b4b098',
      tagBackground: '#77735c',
      tagColor: '#ffffff',
      tags: ['Product Design', 'AI 协作', 'Web App', 'Local-first'],
      ctaLabel: '界面预览',
    },
    featured: true,
    visible: true,
  },
]

export const visibleProjects = projects.filter((project) => project.visible)
