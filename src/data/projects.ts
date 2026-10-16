export type ProjectStatus = 'In Progress' | 'Building' | 'Coming Soon' | 'Published'

export type ProjectImage = {
  src: string
  alt: string
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
    visible: true,
  },
]

export const visibleProjects = projects.filter((project) => project.visible)
