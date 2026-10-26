import { useCallback, useEffect, useRef, useState } from 'react'
import {
  askHyEndpoint,
  askHyOpening,
  askHyProjects,
  askKindDescriptions,
  disclaimerFor,
  type AskKind,
  type AskMessage,
  type AskMode,
  type AskProject,
} from '../data/askHy'

type ApiReply = {
  answer?: unknown
  answer_kind?: unknown
  related_projects?: unknown
  disclaimer?: unknown
  mode?: unknown
  error?: unknown
  message?: unknown
}

type SendOptions = { retry?: boolean }

class AskHyError extends Error {}

function safeKind(value: unknown): AskKind {
  if (value === 'fact' || value === 'inference' || value === 'unknown' || value === 'safety') return value
  return 'unknown'
}

function relatedProjects(value: unknown): AskProject[] {
  if (!Array.isArray(value)) return []
  const projects: AskProject[] = []
  for (const item of value) {
    const id = typeof item === 'string' ? item : (item as { id?: unknown } | null)?.id
    if (typeof id !== 'string') continue
    const project = askHyProjects[id]
    if (!project || projects.some(existing => existing.path === project.path)) continue
    projects.push(project)
    if (projects.length === 2) break
  }
  return projects
}

function friendlyMessage(status: number, data: ApiReply | null): string {
  if (status === 429) return typeof data?.message === 'string' && data.message.length <= 120 ? data.message : '问得有点快，缓一缓再试。'
  if (status === 504) return '这次想得有点久，重试一下？'
  if (status === 502) return '模型暂时没接上，重试一下？'
  if (status === 413) return '这条消息太长了，缩短一点再试。'
  if (status === 400) return '消息格式有点问题，换一句再试？'
  if (typeof data?.message === 'string' && data.message.length <= 120) return data.message
  return '这次没有接上，重试一下？'
}

export function useAskHy() {
  const [messages, setMessages] = useState<AskMessage[]>([askHyOpening])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<AskMode>('checking')
  const [lastQuestion, setLastQuestion] = useState('')
  const idRef = useRef(0)
  const busyRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const nextId = useCallback(() => {
    idRef.current += 1
    return `ask-hy-message-${idRef.current}`
  }, [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    fetch(`${askHyEndpoint}/health`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then(response => {
        if (!response.ok) throw new Error('health')
        return response.json() as Promise<{ configured?: boolean; mode?: string }>
      })
      .then(data => {
        if (cancelled) return
        if (data.mode === 'demo') setMode('demo')
        else if (data.mode === 'live' || data.configured) setMode('live')
        else setMode('unconfigured')
      })
      .catch(() => {
        if (!cancelled) setMode('offline')
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  useEffect(() => () => abortRef.current?.abort(), [])

  const send = useCallback(
    async (rawText: string, options: SendOptions = {}) => {
      const text = rawText.trim().slice(0, 600)
      if (!text || busyRef.current) return
      if (mode === 'unconfigured') {
        setError('AI 尚未配置：服务端缺少 DEEPSEEK_API_KEY。')
        setStatus('error')
        return
      }

      const baseMessages =
        !options.retry && status === 'error' && messages[messages.length - 1]?.role === 'user'
          ? messages.slice(0, -1)
          : messages
      const userMessage: AskMessage = { id: nextId(), role: 'user', content: text }
      const nextMessages = options.retry ? messages : [...baseMessages, userMessage]

      if (!options.retry) setMessages(nextMessages)
      setLastQuestion(text)
      setError('')
      setStatus('loading')
      busyRef.current = true

      const history = nextMessages
        .filter(message => message.role === 'user' || message.role === 'assistant')
        .slice(-8)
        .map(message => ({ role: message.role, content: message.content }))

      const controller = new AbortController()
      abortRef.current = controller
      const timeout = window.setTimeout(() => controller.abort(), 35_000)

      try {
        const response = await fetch(askHyEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        })
        const data = (await response.json().catch(() => null)) as ApiReply | null
        if (!response.ok) {
          if (response.status === 503 && data?.error === 'not_configured') {
            setMode('unconfigured')
            throw new AskHyError('AI 尚未配置：服务端缺少 DEEPSEEK_API_KEY。')
          }
          throw new AskHyError(friendlyMessage(response.status, data))
        }
        if (!data || typeof data.answer !== 'string' || !data.answer.trim()) {
          throw new AskHyError('返回格式不太对，重试一下？')
        }

        const kind = safeKind(data.answer_kind)
        const related = relatedProjects(data.related_projects)
        const answer: AskMessage = {
          id: nextId(),
          role: 'assistant',
          content: data.answer.trim(),
          kind,
          related,
          disclaimer:
            typeof data.disclaimer === 'string' && data.disclaimer.trim()
              ? data.disclaimer.trim()
              : disclaimerFor(kind),
        }
        setMessages(previous => [...previous, answer])
        setStatus('idle')
        setError('')
        if (data.mode === 'demo') setMode('demo')
        else if (data.mode === 'live') setMode(current => (current === 'offline' ? 'live' : current))
      } catch (caught) {
        const isAbort = caught instanceof Error && caught.name === 'AbortError'
        const message =
          isAbort
            ? '这次想得有点久，重试一下？'
            : caught instanceof AskHyError
              ? caught.message
              : '网络好像断了一下，重试一下？'
        setError(message)
        setStatus('error')
      } finally {
        window.clearTimeout(timeout)
        abortRef.current = null
        busyRef.current = false
      }
    },
    [messages, mode, nextId, status]
  )

  const retry = useCallback(() => {
    if (!lastQuestion || status === 'loading') return
    void send(lastQuestion, { retry: true })
  }, [lastQuestion, send, status])

  return {
    messages,
    status,
    error,
    mode,
    send,
    retry,
    kindDescriptions: askKindDescriptions,
  }
}
