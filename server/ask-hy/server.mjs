import { createHash, randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { realpathSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { getConfig, loadEnvFiles } from './config.mjs'
import { knowledgeForPrompt, projectMap } from './knowledge.mjs'
import { buildSystemPrompt } from './prompt.mjs'
import {
  detectSafety,
  hasLeak,
  normalizeAnswer,
  parseModelJson,
  safetyPayload,
  sanitizeMessages
} from './guard.mjs'
import { ConcurrencyGate, DailyBudget, RateLimiter } from './limiter.mjs'

const API_PATH = '/api/ask-hy'
const HEALTH_PATH = '/api/ask-hy/health'

class UpstreamError extends Error {
  constructor(code, upstreamStatus = 0, detail = '') {
    super(code)
    this.name = 'UpstreamError'
    this.code = code
    this.upstreamStatus = upstreamStatus
    this.detail = detail
  }
}

function securityHeaders() {
  return {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY'
  }
}

function sendJson(res, status, payload, extraHeaders = {}) {
  if (res.writableEnded || res.destroyed) return
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    ...securityHeaders(),
    ...res.askHyCors,
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...extraHeaders
  })
  res.end(body)
}

function isLocalOrigin(origin) {
  return /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(origin)
}

function originAllowed(origin, config) {
  if (!origin) return true
  if (config.allowedOrigins.includes('*')) return true
  if (config.allowedOrigins.includes(origin)) return true
  // Local Vite preview/dev origins are accepted outside production only.
  return process.env.NODE_ENV !== 'production' && isLocalOrigin(origin)
}

function hostAllowed(hostHeader, config) {
  if (!hostHeader) return false
  if (config.allowedHosts.includes('*')) return true
  let host = hostHeader.trim().toLowerCase()
  if (host.startsWith('[')) {
    const end = host.indexOf(']')
    if (end > 0) host = host.slice(0, end + 1)
  } else {
    host = host.split(':')[0]
  }
  return config.allowedHosts.some(allowed => allowed.toLowerCase() === host)
}

function clientIp(req, config) {
  if (config.trustProxy) {
    const real = String(req.headers['x-real-ip'] ?? '').trim()
    if (real) return real.slice(0, 64)
    const forwarded = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
    if (forwarded) return forwarded.slice(0, 64)
  }
  return String(req.socket.remoteAddress ?? 'unknown').slice(0, 64)
}

function hashIp(ip, salt) {
  return createHash('sha256').update(`${salt || 'ask-hy'}:${ip}`).digest('hex').slice(0, 12)
}

function modeFor(config) {
  if (config.mock) return 'demo'
  if (config.apiKey) return 'live'
  return 'unconfigured'
}

async function readJson(req, maxBytes) {
  const declared = Number.parseInt(String(req.headers['content-length'] ?? ''), 10)
  if (Number.isFinite(declared) && declared > maxBytes) {
    req.resume()
    return { ok: false, status: 413, error: 'too_large' }
  }
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size <= maxBytes) chunks.push(chunk)
  }
  if (size > maxBytes) return { ok: false, status: 413, error: 'too_large' }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    return { ok: true, value }
  } catch {
    return { ok: false, status: 400, error: 'invalid_json' }
  }
}

function mockAnswer(messages) {
  const text = messages[messages.length - 1]?.content ?? ''
  if (/鸡|蛋/.test(text)) {
    return {
      answer:
        '先定义一下“蛋”。一般意义上的蛋远早于鸡；即便限定为现代鸡，它也很可能是从更早一代的蛋里孵出来的。如果让我猜，何扬会先抓住这个定义问题，再给科学答案。不过这只是我按他的思考习惯做的推测，不是他本人回答过。',
      answer_kind: 'inference',
      related_projects: []
    }
  }
  if (/traintrace/i.test(text)) {
    return {
      answer:
        '根据公开项目资料，TrainTrace 首先是一个训练记录工具：逐组记下动作、重量和次数，再用兼容的历史表现做对比，AI 反馈只解释已经确认的训练事实。它目前是本地 V1.3 RC，不宣称已经公开发布或拥有多少用户。',
      answer_kind: 'fact',
      related_projects: ['traintrace']
    }
  }
  if (/七维|涨粉/.test(text)) {
    return {
      answer:
        '不能这样说。七维评分是内容诊断框架，已有账号的历史成绩也不能被当作这套系统带来的增量；公开资料里没有已完成的 Growth OS 前瞻增长实验。历史播放和收藏只能作为历史内容结果，不能归因于它。',
      answer_kind: 'fact',
      related_projects: ['ai-content-growth-os']
    }
  }
  if (/盘两下/.test(text)) {
    return {
      answer:
        '盘两下是一个手机端的虚拟手串实验，重点是把盘珠的触摸、运动、声音和包浆做得连贯。公开案例里能确认的是三款核心手串和本地存档，没有广告、付费或用户增长成绩。',
      answer_kind: 'fact',
      related_projects: ['panliangxia']
    }
  }
  if (/创业|以后|未来/.test(text)) {
    return {
      answer:
        '公开资料里没有可靠的确定时间。我不想把对新产品的兴趣自动推断成一个已经确定的创业计划；这类私人选择也不适合由 AI 代替他作答。',
      answer_kind: 'unknown',
      related_projects: []
    }
  }
  if (/三天|奇怪/.test(text)) {
    return {
      answer:
        '我不敢替他指定一个真实计划。按他过去的节奏猜，可能会先挑一个身边具体、又有点好玩的小痛点，做一个只有一两个关键交互的 Demo，再亲自试，而不是先写一份很大的方案。这是 AI 推测，不是他本人表态。',
      answer_kind: 'inference',
      related_projects: []
    }
  }
  return {
    answer:
      '这是本地 Demo 模式的固定回答，不会调用真实模型。配置 DEEPSEEK_API_KEY 后，我可以根据公开项目资料回答问题，并把 AI 推测和事实分开。',
    answer_kind: 'unknown',
    related_projects: []
  }
}

async function callDeepSeek(messages, config, systemPrompt, model = config.model, timeoutMs = config.timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let response
  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'ask-hy/0.1'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        response_format: { type: 'json_object' },
        stream: false
      }),
      signal: controller.signal
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw new UpstreamError('TIMEOUT')
    throw new UpstreamError('NETWORK')
  } finally {
    clearTimeout(timer)
  }

  let text = ''
  try {
    text = await response.text()
  } catch {
    throw new UpstreamError('NETWORK')
  }

  if (!response.ok) {
    const detail = text.slice(0, 400).replace(/\s+/g, ' ')
    if (response.status === 401 || response.status === 403) throw new UpstreamError('AUTH', response.status, detail)
    if (response.status === 429) throw new UpstreamError('RATE', response.status, detail)
    throw new UpstreamError('UPSTREAM', response.status, detail)
  }

  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    throw new UpstreamError('UPSTREAM_FORMAT')
  }
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) {
    const error = new UpstreamError('EMPTY', response.status, `finish=${payload?.choices?.[0]?.finish_reason ?? 'unknown'}`)
    error.tokens = Number(payload?.usage?.total_tokens) || 0
    throw error
  }
  return {
    raw: parseModelJson(content),
    usage: payload.usage ?? {},
    finishReason: payload?.choices?.[0]?.finish_reason ?? ''
  }
}

async function callWithRetry(messages, config, systemPrompt, requestId) {
  const primary = config.model
  const fallback = config.fallbackModel && config.fallbackModel !== primary ? config.fallbackModel : primary
  const attempts = [primary, fallback]
  let lastError
  let tokensUsed = 0
  const deadline = Date.now() + config.timeoutMs
  for (let index = 0; index < attempts.length; index += 1) {
    const remaining = deadline - Date.now()
    if (remaining <= 0) {
      lastError = new UpstreamError('TIMEOUT')
      lastError.tokensUsed = tokensUsed
      throw lastError
    }
    try {
      const result = await callDeepSeek(messages, config, systemPrompt, attempts[index], Math.min(remaining, config.timeoutMs))
      tokensUsed += Number(result.usage?.total_tokens) || 0
      return { ...result, tokensUsed }
    } catch (error) {
      tokensUsed += Number(error.tokens) || 0
      lastError = error
      if (error.code !== 'EMPTY') {
        error.tokensUsed = tokensUsed
        throw error
      }
      console.warn(
        JSON.stringify({
          event: 'ask_hy',
          requestId,
          warning: 'empty_answer_retry',
          model: attempts[index]
        })
      )
    }
  }
  if (lastError) {
    lastError.tokensUsed = tokensUsed
    throw lastError
  }
  throw new UpstreamError('EMPTY')
}

function upstreamErrorPayload(code) {
  switch (code) {
    case 'TIMEOUT':
      return { status: 504, body: { error: 'timeout', message: '这次想得有点久，重试一下？' } }
    case 'RATE':
      return { status: 429, body: { error: 'upstream_busy', message: '模型有点忙，缓一缓再试。' } }
    case 'AUTH':
      return { status: 502, body: { error: 'upstream_auth', message: 'AI 服务暂时不可用，稍后再试。' } }
    case 'NETWORK':
      return { status: 502, body: { error: 'upstream_unavailable', message: '模型暂时没接上，重试一下？' } }
    default:
      return { status: 502, body: { error: 'upstream_error', message: '模型暂时没接上，重试一下？' } }
  }
}

export function createAskHyServer({ config }) {
  if (!config) throw new Error('createAskHyServer requires a config object')
  const systemPrompt = buildSystemPrompt(knowledgeForPrompt())
  const limiter = new RateLimiter({ windowMs: config.rateWindowMs, max: config.rateMax })
  const budget = new DailyBudget({ maxRequests: config.dailyRequests, maxTokens: config.dailyTokens })
  const gate = new ConcurrencyGate(config.maxConcurrent)
  const projectLabels = new Map([...projectMap].map(([id, project]) => [id, project.title]))
  const linkableProjectIds = new Set(
    [...projectMap].filter(([, project]) => Boolean(project.route)).map(([id]) => id)
  )

  return createServer(async (req, res) => {
    const started = Date.now()
    const requestId = randomUUID().slice(0, 8)
    const origin = String(req.headers.origin ?? '')
    const ip = clientIp(req, config)

    res.askHyCors = origin && originAllowed(origin, config)
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
          'Access-Control-Max-Age': '600',
          Vary: 'Origin'
        }
      : {}
    res.setHeader('X-Request-Id', requestId)

    if (!hostAllowed(String(req.headers.host ?? ''), config)) {
      sendJson(res, 403, { error: 'forbidden', message: '请求来源不可用。' })
      return
    }
    if (!originAllowed(origin, config)) {
      sendJson(res, 403, { error: 'forbidden', message: '请求来源不可用。' })
      return
    }

    const url = new URL(req.url ?? '/', 'http://localhost')
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { ...securityHeaders(), ...res.askHyCors })
      res.end()
      return
    }

    if (url.pathname === HEALTH_PATH && req.method === 'GET') {
      const mode = modeFor(config)
      sendJson(res, 200, {
        ok: true,
        configured: Boolean(config.apiKey),
        mode
      })
      return
    }

    if (url.pathname !== API_PATH || req.method !== 'POST') {
      sendJson(res, 404, { error: 'not_found', message: '接口不存在。' })
      return
    }

    if (!/^application\/json\b/i.test(String(req.headers['content-type'] ?? ''))) {
      sendJson(res, 415, { error: 'unsupported_media_type', message: '请求格式不支持。' })
      return
    }

    const rate = limiter.take(ip)
    const rateHeaders = { 'X-RateLimit-Remaining': String(rate.remaining) }
    if (!rate.allowed) {
      sendJson(
        res,
        429,
        { error: 'rate_limited', message: '问得有点快，缓一缓再试。' },
        { ...rateHeaders, 'Retry-After': String(rate.retryAfter) }
      )
      return
    }

    const mode = modeFor(config)
    if (!config.mock && !config.apiKey) {
      sendJson(res, 503, {
        error: 'not_configured',
        message: 'AI 尚未配置：服务端缺少 DEEPSEEK_API_KEY。'
      })
      return
    }

    let parsedBody
    try {
      parsedBody = await readJson(req, config.maxBodyBytes)
    } catch {
      sendJson(res, 400, { error: 'invalid_body', message: '请求读取失败。' })
      return
    }
    if (!parsedBody.ok) {
      const messages = {
        too_large: '这条消息太长了，缩短一点再试。',
        invalid_json: '请求格式不对。'
      }
      sendJson(res, parsedBody.status, { error: parsedBody.error, message: messages[parsedBody.error] })
      return
    }

    const messages = sanitizeMessages(parsedBody.value?.messages, {
      maxInputChars: config.maxInputChars,
      maxHistory: config.maxHistory
    })
    if (!messages.length) {
      sendJson(res, 400, { error: 'invalid_messages', message: '没有可回答的消息。' })
      return
    }

    const safety = detectSafety(messages)
    if (safety) {
      sendJson(res, 200, { ...safety, mode })
      return
    }

    const budgetStatus = budget.check()
    if (!budgetStatus.allowed) {
      sendJson(res, 429, {
        error: 'budget_limited',
        message: '今天的体验次数用得差不多了，可以看看作品，明天再来。'
      })
      return
    }
    if (!gate.enter()) {
      sendJson(res, 429, { error: 'busy', message: '现在问的人有点多，等一下再试。' })
      return
    }

    budget.addRequest()
    let kind = 'none'
    let chars = 0
    let upstreamStatus = 0
    let tokens = 0
    try {
      let raw
      if (config.mock) {
        raw = mockAnswer(messages)
      } else {
        const result = await callWithRetry(messages, config, systemPrompt, requestId)
        raw = result.raw
        tokens = Number(result.tokensUsed) || 0
        budget.addTokens(tokens)
        upstreamStatus = 200
        if (result.finishReason === 'length') {
          console.warn(JSON.stringify({ event: 'ask_hy', requestId, warning: 'finish_length' }))
        }
      }

      const normalized = normalizeAnswer(raw, { projectIds: linkableProjectIds, projectLabels })
      if (hasLeak(normalized.answer)) {
        const blocked = safetyPayload('prompt')
        kind = blocked.answer_kind
        chars = blocked.answer.length
        sendJson(res, 200, { ...blocked, mode })
        return
      }
      kind = normalized.answer_kind
      chars = normalized.answer.length
      sendJson(res, 200, { ...normalized, mode })
    } catch (error) {
      const mapped = upstreamErrorPayload(error.code)
      upstreamStatus = error.upstreamStatus || mapped.status
      if (Number(error.tokensUsed) > 0) budget.addTokens(Number(error.tokensUsed))
      if (error.code !== 'TIMEOUT' && error.code !== 'RATE' && error.code !== 'AUTH') {
        console.warn(
          JSON.stringify({
            event: 'ask_hy',
            requestId,
            upstream: error.code,
            upstreamStatus: error.upstreamStatus
          })
        )
      }
      sendJson(res, mapped.status, mapped.body)
    } finally {
      gate.leave()
      console.log(
        JSON.stringify({
          event: 'ask_hy',
          requestId,
          status: res.statusCode,
          ms: Date.now() - started,
          mode,
          kind,
          chars,
          tokens,
          upstreamStatus,
          ip: hashIp(ip, config.logSalt)
        })
      )
    }
  })
}

export function startServer(config = getConfig()) {
  const server = createAskHyServer({ config })
  server.listen(config.port, config.host, () => {
    const mode = modeFor(config)
    console.log(
      `[ask-hy] listening on http://${config.host}:${config.port} (${mode}${config.mock ? ', mock' : ''})`
    )
    if (mode === 'unconfigured') {
      console.warn('[ask-hy] DEEPSEEK_API_KEY is missing; /api/ask-hy will return 503.')
    }
  })
  const shutdown = signal => {
    console.log(`[ask-hy] ${signal}; closing`)
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(1), 5000).unref()
  }
  process.once('SIGTERM', () => shutdown('SIGTERM'))
  process.once('SIGINT', () => shutdown('SIGINT'))
  return server
}

const isEntry = process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
if (isEntry) {
  loadEnvFiles()
  startServer(getConfig())
}
