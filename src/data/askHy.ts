import { siteUrl } from '../paths'

export type AskKind = 'fact' | 'inference' | 'unknown' | 'safety'

export type AskProject = {
  id: string
  label: string
  path: string
}

export type AskMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  kind?: AskKind
  related?: AskProject[]
  disclaimer?: string
}

export type AskMode = 'checking' | 'live' | 'demo' | 'unconfigured' | 'offline'

export const askHyEndpoint = (
  (import.meta.env.VITE_ASK_HY_ENDPOINT as string | undefined)?.trim() || '/api/ask-hy'
).replace(/\/+$/, '')

// The server only returns ids from its own allow-list. This client-side map is
// the second gate: an unknown id never becomes a clickable URL.
export const askHyProjects: Record<string, AskProject> = {
  traintrace: { id: 'traintrace', label: 'TrainTrace', path: 'work/traintrace' },
  'ai-content-growth-os': { id: 'ai-content-growth-os', label: 'AI Content Growth System', path: 'work/ai-content-growth-os' },
  'ai-video-workbench': { id: 'ai-video-workbench', label: 'AI Content Growth System', path: 'work/ai-content-growth-os' },
  jobflow: { id: 'jobflow', label: 'JobFlow 演示', path: 'fun#jobflow' },
  'game-win-prediction': { id: 'game-win-prediction', label: '下一把 Demo', path: 'fun#next-round' },
  'time-planning-demo': { id: 'time-planning-demo', label: '时间规划演示', path: 'fun#time-planning' },
  panliangxia: { id: 'panliangxia', label: '盘两下', path: 'work/panliangxia' },
  'love-journal': { id: 'love-journal', label: 'Love Journal', path: 'work/love-journal' },
}

export function projectUrl(project: AskProject) {
  return siteUrl(project.path)
}

export const askHyOpening: AskMessage = {
  id: 'ask-hy-opening',
  role: 'assistant',
  content:
    '我是 Ask HY。何扬的 AI 导览伙伴，不是本人。聊作品可以认真讲；问奇怪问题，我会按他的思考习惯试着猜，但会标清楚哪部分是推测。',
}

export const askHySuggestions = [
  'TrainTrace 最核心的设计取舍是什么？',
  '为什么连手串都要做成网页？',
  '如果给何扬三天，他会做什么小实验？',
  '先有鸡还是先有蛋？',
] as const

export const askKindLabels: Record<AskKind, string> = {
  fact: '公开资料',
  inference: 'AI 推测',
  unknown: '资料不足',
  safety: '边界说明',
}

export const askKindDescriptions: Record<AskKind, string> = {
  fact: '来自已公开的项目资料',
  inference: '按公开作品里的思考习惯推断，不代表本人观点',
  unknown: '公开资料不足，不替本人下结论',
  safety: '不在 Ask HY 的公开回答范围',
}

export function disclaimerFor(kind: AskKind): string | undefined {
  if (kind === 'inference') return 'AI 推测，不代表本人观点。'
  if (kind === 'unknown') return '没有可靠公开资料，这里不替本人下结论。'
  if (kind === 'safety') return '这类信息不在公开范围。'
  return undefined
}
