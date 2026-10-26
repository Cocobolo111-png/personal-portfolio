import { readFileSync } from 'node:fs'

const source = JSON.parse(
  readFileSync(new URL('./knowledge/public-knowledge.json', import.meta.url), 'utf8')
)

const isPublic = entry => entry && entry.status === 'public_seed'

export const knowledge = {
  version: source.version,
  updatedAt: source.updated_at,
  identity: source.identity,
  facts: source.facts.filter(isPublic),
  projects: source.projects.filter(isPublic),
  persona: source.persona,
  excludedTopics: source.excluded_topics
}

export const projectMap = new Map(
  knowledge.projects.map(project => [project.id, project])
)

export const projectIds = new Set(projectMap.keys())

export function projectLabel(id) {
  return projectMap.get(id)?.title ?? id
}

/**
 * The prompt receives only reviewed public facts and a style-only persona
 * block. `owner_review`, `inference_only` facts and private material never
 * enter this string.
 */
export function knowledgeForPrompt() {
  const { identity, facts, projects, persona, excludedTopics } = knowledge
  const factLines = facts.map(fact => `- ${fact.statement}（来源：${fact.source}）`).join('\n')
  const projectLines = projects
    .map(project => {
      const verified = project.verified.map(item => `  - 已确认：${item}`).join('\n')
      const boundaries = project.boundaries.map(item => `  - 边界：${item}`).join('\n')
      const route = project.route ? `/${project.route}` : '无公开入口'
      return [
        `- id: ${project.id}`,
        `  名称：${project.title}（${project.category === 'work' ? 'Work' : 'Fun'}）`,
        `  站内案例：${route}`,
        `  概要：${project.summary}`,
        verified,
        boundaries
      ].join('\n')
    })
    .join('\n')
  const traitLines = persona.traits.map(trait => `- ${trait}`).join('\n')
  const excluded = excludedTopics.map(topic => `- ${topic}`).join('\n')

  return [
    `资料版本：${knowledge.version}，更新于 ${knowledge.updatedAt}。`,
    `身份：${identity.owner_name}，作品集 ${identity.portfolio_url}。${identity.positioning} Hero 表达：“${identity.hero_tagline}”。`,
    `Ask HY 的公开说明：${identity.disclosure}`,
    '公开事实：',
    factLines,
    '已核验项目：',
    projectLines,
    '人格倾向（仅用于语气和推断路径，不是事实，不可引用为本人原话）：',
    traitLines,
    '不进入公开回答的范围：',
    excluded
  ].join('\n\n')
}
