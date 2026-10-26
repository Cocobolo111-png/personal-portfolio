const ALLOWED_KINDS = new Set(['fact', 'inference', 'unknown', 'safety'])

export const SAFETY_ANSWERS = {
  privacy:
    '这类私人信息不在 Ask HY 的公开资料里，我也不会替何扬编一个。想了解作品的话，我可以聊 Love Journal 这个概念本身。',
  credentials:
    '账号、密码和 API Key 不在我能回答的范围里。就算是公开项目，也只聊作品本身。',
  prompt:
    '内部规则、知识库原文和聊天记录不会对外展开。我可以继续聊公开项目，或者接着刚才的问题。',
  injection:
    '这条指令我不会执行。我们可以继续聊作品，或者你换个问题。',
  fabrication:
    '我不能把虚构的数据当成真实成绩。可以聊已经公开的功能和边界。'
}

export const DISCLAIMERS = {
  fact: null,
  inference: 'AI 推测，不代表本人观点。',
  unknown: '没有可靠公开资料，这里不替本人下结论。',
  safety: '这类信息不在公开范围。'
}

const SAFETY_CHECKS = [
  {
    reason: 'credentials',
    test: text =>
      /\b(sk-[a-z0-9_-]{8,}|api[\s_-]?key|access[\s_-]?token|secret[\s_-]?key)\b/i.test(text) ||
      /(账号|账户|后台).{0,8}(密码|口令|权限)/.test(text) ||
      /(密码|口令).{0,8}(是什么|告诉|发|给)/.test(text) ||
      /(阿里云|服务器|数据库|后台).{0,8}(权限|密码|密钥|账号)/.test(text) ||
      /(环境变量|\.env|env\s*文件).{0,8}(发|给|打印|输出|告诉|看)/i.test(text)
  },
  {
    reason: 'prompt',
    test: text =>
      /(system\s*prompt|developer\s*(message|instruction)|内部(系统)?(提示词|指令|规则)|知识库原文|历史(聊天|对话)(原文|记录)|聊天原文|私聊)/i.test(text) ||
      /(把|给我|输出|打印|展示|重复|告诉).{0,20}(系统提示词|内部规则|聊天记录|训练数据|知识库)/.test(text)
  },
  {
    reason: 'injection',
    test: text =>
      /(ignore|disregard|forget).{0,30}(previous|above|prior|all).{0,30}(instructions|rules|prompts?)/i.test(text) ||
      /(忽略|无视|忘记|跳过).{0,20}(之前|以上|上面|所有|系统).{0,20}(指令|规则|提示|限制)/.test(text) ||
      /(忽略|无视).{0,10}(规则|指令|限制)/.test(text) ||
      /<\s*\|?\s*(im_start|im_end|system|developer)\s*\|?\s*>/i.test(text) ||
      /^\s*(system|developer|assistant)\s*[:：]/im.test(text) ||
      /\b(DAN|jailbreak|developer mode)\b/i.test(text)
  },
  {
    reason: 'privacy',
    test: text =>
      /(女朋友|女友|伴侣|老婆|对象).{0,12}(叫什么|名字|住哪|资料|照片|是谁|信息)/.test(text) ||
      /(把|给我|告诉|发|打印|列出|全部|具体).{0,20}(女朋友|女友|伴侣|住址|家庭住址|健康数据|体检|私人记录|聊天记录|身份证|手机号)/.test(text) ||
      /(把|给我|告诉|发|打印|列出|全部).{0,20}(训练记录|训练数据|健康数据|体检数据)/.test(text) ||
      /(私人|私密|恋爱|情侣).{0,8}(记录|照片|聊天|日记|数据)/.test(text) ||
      /(真实|具体).{0,8}(训练记录|训练数据|健康数据|体检数据|聊天记录)/.test(text) ||
      /(何扬|他|你).{0,6}(住哪|住哪里|住址|家庭住址|手机号|身份证)/.test(text) ||
      /(把|给我|告诉|发|打印).{0,16}(简历|投递记录|求职账号|招聘账号)/.test(text) ||
      /(健康数据|体检报告|体检数据|身体状况)/.test(text)
  },
  {
    reason: 'fabrication',
    test: text =>
      /(虚构|编造|捏造|伪造|假装).{0,30}(用户|付费|增长|数据|成绩|营收|融资|上线|员工|粉丝|播放)/.test(text)
  }
]

const LEAK_PATTERNS = [
  /owner_review/i,
  /inference_only/i,
  /private_excluded/i,
  /public_seed/i,
  /DEEPSEEK_API_KEY/i,
  /\bsk-[a-z0-9_-]{8,}\b/i,
  /事实优先级/,
  /四种回答机制/,
  /ask-hy-prompt-0\.1/i
]

const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g

export function normalizeText(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS, '')
    .trim()
}

export function sanitizeMessages(input, { maxInputChars, maxHistory }) {
  if (!Array.isArray(input)) return []
  const cleaned = []
  for (const item of input) {
    if (!item || typeof item !== 'object') continue
    if (item.role !== 'user' && item.role !== 'assistant') continue
    const content = normalizeText(item.content).slice(0, maxInputChars)
    if (!content) continue
    cleaned.push({ role: item.role, content })
  }
  const trimmed = cleaned.slice(-maxHistory)
  if (!trimmed.length || trimmed[trimmed.length - 1].role !== 'user') return []
  return trimmed
}

export function detectSafety(messages) {
  const latestUser = [...messages].reverse().find(message => message.role === 'user')
  const text = latestUser?.content ?? ''
  for (const check of SAFETY_CHECKS) {
    if (check.test(text)) {
      return {
        reason: check.reason,
        answer: SAFETY_ANSWERS[check.reason],
        answer_kind: 'safety',
        related_projects: [],
        disclaimer: DISCLAIMERS.safety
      }
    }
  }
  return null
}

export function parseModelJson(content) {
  const raw = normalizeText(content)
  if (!raw) return { answer: '', answer_kind: 'unknown', related_projects: [] }
  const withoutFence = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
  const start = withoutFence.indexOf('{')
  const end = withoutFence.lastIndexOf('}')
  const candidate = start >= 0 && end > start ? withoutFence.slice(start, end + 1) : withoutFence
  try {
    const parsed = JSON.parse(candidate)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
  } catch {
    // Fall through to a conservative text answer.
  }
  return {
    answer: withoutFence,
    answer_kind: 'inference',
    related_projects: []
  }
}

function truncateAnswer(answer, max = 1600) {
  if (answer.length <= max) return answer
  const cut = answer.slice(0, max)
  const lastSentence = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('！'), cut.lastIndexOf('？'))
  return lastSentence > max * 0.5 ? cut.slice(0, lastSentence + 1) : `${cut.trim()}…`
}

export function normalizeAnswer(raw, { projectIds, projectLabels }) {
  let answer = normalizeText(raw?.answer)
  answer = answer
    .replace(/```[\s\S]*?```/g, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  answer = truncateAnswer(answer)

  if (!answer) {
    return {
      answer: '这次我没有组织出可靠回答。可以换个问法，或者直接问某个公开项目。',
      answer_kind: 'unknown',
      related_projects: [],
      disclaimer: DISCLAIMERS.unknown
    }
  }

  let kind = ALLOWED_KINDS.has(raw?.answer_kind) ? raw.answer_kind : 'inference'
  if (kind === 'fact' && /(我猜|如果让我猜|推测|大概率|以我对他|从公开作品看)/.test(answer)) {
    kind = 'inference'
  }
  if (kind === 'safety') answer = SAFETY_ANSWERS.prompt

  const ids = Array.isArray(raw?.related_projects) ? raw.related_projects : []
  const related = []
  for (const item of ids) {
    const id = typeof item === 'string' ? item : item?.id
    if (typeof id !== 'string' || !projectIds.has(id) || related.includes(id)) continue
    related.push(id)
    if (related.length === 2) break
  }

  return {
    answer,
    answer_kind: kind,
    related_projects: related.map(id => ({ id, label: projectLabels.get(id) ?? id })),
    disclaimer: DISCLAIMERS[kind] ?? null
  }
}

export function safetyPayload(reason) {
  return {
    answer: SAFETY_ANSWERS[reason] ?? SAFETY_ANSWERS.prompt,
    answer_kind: 'safety',
    related_projects: [],
    disclaimer: DISCLAIMERS.safety
  }
}

export function hasLeak(answer) {
  return LEAK_PATTERNS.some(pattern => pattern.test(answer))
}
