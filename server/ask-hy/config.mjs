import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const DEFAULTS = {
  host: '127.0.0.1',
  port: 8787,
  model: 'deepseek-v4-pro',
  baseUrl: 'https://api.deepseek.com',
  allowedOrigins: 'https://create.byheyang.cn',
  allowedHosts: 'create.byheyang.cn,127.0.0.1,localhost',
  rateMax: 12,
  rateWindowMs: 10 * 60 * 1000,
  dailyRequests: 300,
  dailyTokens: 200_000,
  maxConcurrent: 4,
  timeoutMs: 25_000,
  maxInputChars: 600,
  maxHistory: 8,
  maxTokens: 1_200,
  temperature: 0.65,
  maxBodyBytes: 32 * 1024
}

function positiveInt(value, fallback, min, max) {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function positiveNumber(value, fallback, min, max) {
  const parsed = Number.parseFloat(value ?? '')
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function boolean(value) {
  return value === '1' || value === 'true' || value === 'yes'
}

function list(value) {
  return String(value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

/**
 * Load a small dotenv-style file without a dependency. Existing process.env
 * values always win, so a local test key never gets replaced accidentally.
 */
export function loadEnvFiles() {
  const files = [
    resolve(serverRoot, '.env.local'),
    resolve(serverRoot, '.env'),
    resolve(serverRoot, 'server/ask-hy/.env')
  ]
  for (const file of files) {
    if (!existsSync(file)) continue
    const text = readFileSync(file, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!match) continue
      let value = match[2].trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(match[1] in process.env)) process.env[match[1]] = value
    }
  }
}

export function getConfig(env = process.env) {
  const baseUrl = (env.DEEPSEEK_BASE_URL?.trim() || DEFAULTS.baseUrl).replace(/\/+$/, '')
  let parsedBase
  try {
    parsedBase = new URL(baseUrl)
  } catch {
    throw new Error('DEEPSEEK_BASE_URL must be a valid http(s) URL')
  }
  if (!['http:', 'https:'].includes(parsedBase.protocol)) {
    throw new Error('DEEPSEEK_BASE_URL must use http or https')
  }

  return {
    host: env.ASK_HY_HOST?.trim() || DEFAULTS.host,
    port: positiveInt(env.ASK_HY_PORT, DEFAULTS.port, 1, 65_535),
    apiKey: env.DEEPSEEK_API_KEY?.trim() || '',
    model: env.DEEPSEEK_MODEL?.trim() || DEFAULTS.model,
    fallbackModel: env.DEEPSEEK_FALLBACK_MODEL?.trim() || '',
    baseUrl,
    mock: boolean(env.ASK_HY_MOCK),
    trustProxy: boolean(env.ASK_HY_TRUST_PROXY),
    allowedOrigins: list(env.ASK_HY_ALLOWED_ORIGINS || DEFAULTS.allowedOrigins),
    allowedHosts: list(env.ASK_HY_ALLOWED_HOSTS || DEFAULTS.allowedHosts),
    rateMax: positiveInt(env.ASK_HY_RATE_MAX, DEFAULTS.rateMax, 1, 1_000),
    rateWindowMs: positiveInt(env.ASK_HY_RATE_WINDOW_MS, DEFAULTS.rateWindowMs, 60_000, 86_400_000),
    dailyRequests: positiveInt(env.ASK_HY_DAILY_REQUESTS, DEFAULTS.dailyRequests, 1, 100_000),
    dailyTokens: positiveInt(env.ASK_HY_DAILY_TOKENS, DEFAULTS.dailyTokens, 1_000, 10_000_000),
    maxConcurrent: positiveInt(env.ASK_HY_MAX_CONCURRENT, DEFAULTS.maxConcurrent, 1, 50),
    timeoutMs: positiveInt(env.ASK_HY_TIMEOUT_MS, DEFAULTS.timeoutMs, 1_000, 60_000),
    maxInputChars: positiveInt(env.ASK_HY_MAX_INPUT_CHARS, DEFAULTS.maxInputChars, 50, 2_000),
    maxHistory: positiveInt(env.ASK_HY_MAX_HISTORY, DEFAULTS.maxHistory, 2, 20),
    maxTokens: positiveInt(env.ASK_HY_MAX_TOKENS, DEFAULTS.maxTokens, 128, 4_096),
    temperature: positiveNumber(env.ASK_HY_TEMPERATURE, DEFAULTS.temperature, 0, 1.5),
    maxBodyBytes: positiveInt(env.ASK_HY_MAX_BODY_BYTES, DEFAULTS.maxBodyBytes, 1_024, 128 * 1024),
    logSalt: env.ASK_HY_LOG_SALT?.trim() || ''
  }
}
