import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  askHySuggestions,
  askKindDescriptions,
  askKindLabels,
  projectUrl,
  type AskMessage,
  type AskMode,
} from '../data/askHy'

type Props = {
  messages: AskMessage[]
  status: 'idle' | 'loading' | 'error'
  error: string
  mode: AskMode
  onSend: (text: string) => void
  onRetry: () => void
  onClose: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

const modeCopy: Record<AskMode, { label: string; tone: string; title: string }> = {
  checking: { label: '连接中', tone: 'idle', title: '正在连接 AI 服务' },
  live: { label: 'LIVE', tone: 'live', title: '真实 DeepSeek 模型' },
  demo: { label: 'DEMO', tone: 'demo', title: '本地模拟模式，不是真实模型' },
  unconfigured: { label: '未配置', tone: 'warn', title: '服务端缺少 DEEPSEEK_API_KEY' },
  offline: { label: '离线', tone: 'warn', title: 'AI 服务未连接' },
}

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 9 9 3M3 3h6v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Message({ message }: { message: AskMessage }) {
  const assistant = message.role === 'assistant'
  return (
    <article className={`ask-hy__message ${assistant ? 'ask-hy__message--assistant' : 'ask-hy__message--user'}`}>
      {assistant && (
        <div className="ask-hy__message-head">
          <span className="ask-hy__mark" aria-hidden="true">hy</span>
          <span>Ask HY</span>
          {message.kind && (
            <span
              className={`ask-hy__badge ask-hy__badge--${message.kind}`}
              title={askKindDescriptions[message.kind]}
            >
              {askKindLabels[message.kind]}
            </span>
          )}
        </div>
      )}
      <p className="ask-hy__bubble">{message.content}</p>
      {message.related && message.related.length > 0 && (
        <div className="ask-hy__links" aria-label="相关案例">
          {message.related.map(project => (
            <a key={project.id} className="ask-hy__project" href={projectUrl(project)}>
              查看 {project.label} <Arrow />
            </a>
          ))}
        </div>
      )}
      {message.disclaimer && <p className="ask-hy__disclaimer">{message.disclaimer}</p>}
    </article>
  )
}

export function AskHyPanel({
  messages,
  status,
  error,
  mode,
  onSend,
  onRetry,
  onClose,
  returnFocusRef,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const [draft, setDraft] = useState('')

  onCloseRef.current = onClose

  const loading = status === 'loading'
  const unavailable = mode === 'unconfigured'
  const showSuggestions = !messages.some(message => message.role === 'user')

  useEffect(() => {
    const active = document.activeElement
    previousFocusRef.current =
      active instanceof HTMLElement && active !== document.body
        ? active
        : (returnFocusRef?.current ?? null)

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80)

    const focusables = () => {
      const panel = panelRef.current
      if (!panel) return [] as HTMLElement[]
      return Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea:not([disabled])')
      ).filter(element => element.offsetParent !== null && element.getAttribute('aria-hidden') !== 'true')
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement
      if (!panelRef.current?.contains(current)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      const target = previousFocusRef.current ?? returnFocusRef?.current
      target?.focus()
    }
  }, [returnFocusRef])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)')
    const apply = () => document.body.classList.toggle('ask-hy-lock', query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => {
      query.removeEventListener('change', apply)
      document.body.classList.remove('ask-hy-lock')
    }
  }, [])

  useEffect(() => {
    const log = logRef.current
    if (!log) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    log.scrollTo({ top: log.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, status, error])

  const resize = () => {
    const input = inputRef.current
    if (!input) return
    input.style.height = 'auto'
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`
  }

  const submit = () => {
    const text = draft.trim()
    if (!text || loading || unavailable) return
    onSend(text)
    setDraft('')
    window.requestAnimationFrame(resize)
  }

  const modeInfo = modeCopy[mode]

  return (
    <>
      <button className="ask-hy-scrim" type="button" tabIndex={-1} aria-label="关闭 Ask HY" onClick={onClose} />
      <div
        ref={panelRef}
        className="ask-hy"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-hy-title"
        aria-describedby="ask-hy-desc"
        aria-busy={loading}
      >
        <header className="ask-hy__header">
          <div className="ask-hy__identity">
            <span className="ask-hy__mark ask-hy__mark--large" aria-hidden="true">hy</span>
            <div>
              <h2 id="ask-hy-title">Ask HY</h2>
              <p id="ask-hy-desc">不是何扬本人 · AI 实验</p>
            </div>
          </div>
          <div className="ask-hy__header-actions">
            <span className={`ask-hy__mode ask-hy__mode--${modeInfo.tone}`} title={modeInfo.title}>
              <i aria-hidden="true" />
              {modeInfo.label}
            </span>
            <button className="ask-hy__close" type="button" onClick={onClose} aria-label="关闭 Ask HY">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        {mode === 'demo' && (
          <div className="ask-hy__banner ask-hy__banner--demo" role="status">
            Demo 模式：当前是本地模拟回答，不是真实模型。
          </div>
        )}
        {mode === 'unconfigured' && (
          <div className="ask-hy__banner ask-hy__banner--warn" role="status">
            AI 尚未配置：服务端缺少 DEEPSEEK_API_KEY。页面和作品仍可浏览。
          </div>
        )}
        {mode === 'offline' && (
          <div className="ask-hy__banner ask-hy__banner--warn" role="status">
            AI 服务未连接。页面仍可使用，发送后会再试。
          </div>
        )}

        <div ref={logRef} className="ask-hy__messages" role="log" aria-live="polite" aria-relevant="additions text">
          {messages.map(message => <Message key={message.id} message={message} />)}

          {showSuggestions && (
            <div className="ask-hy__suggestions" aria-label="推荐问题">
              <p>可以先从这些开始</p>
              {askHySuggestions.map((question, index) => (
                <button
                  key={question}
                  type="button"
                  className="ask-hy__suggestion"
                  disabled={loading || unavailable}
                  onClick={() => onSend(question)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {question}
                  <Arrow />
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="ask-hy__typing" role="status" aria-label="Ask HY 正在想">
              <i /><i /><i />
            </div>
          )}

          {status === 'error' && error && (
            <div className="ask-hy__error" role="alert">
              <p>{error}</p>
              <button type="button" onClick={onRetry} disabled={loading}>重试</button>
            </div>
          )}
        </div>

        <form
          className="ask-hy__composer"
          onSubmit={event => {
            event.preventDefault()
            submit()
          }}
        >
          <div className="ask-hy__input-row">
            <label className="ask-hy__sr-only" htmlFor="ask-hy-input">问 Ask HY 一个问题</label>
            <textarea
              id="ask-hy-input"
              ref={inputRef}
              rows={1}
              maxLength={600}
              value={draft}
              onChange={event => {
                setDraft(event.target.value)
                resize()
              }}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  submit()
                }
              }}
              placeholder={
                unavailable
                  ? 'AI 尚未配置'
                  : mode === 'checking'
                    ? '正在连接 AI…'
                    : '问点具体的，或者奇怪一点的…'
              }
              disabled={unavailable}
              aria-describedby="ask-hy-composer-note"
            />
            <button
              className="ask-hy__send"
              type="submit"
              aria-label="发送消息"
              disabled={loading || unavailable || !draft.trim()}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div id="ask-hy-composer-note" className="ask-hy__composer-meta">
            <span>对话仅保留在当前页面，不写入知识库</span>
            <span>{draft.length > 480 ? `${draft.length}/600` : 'Enter 发送'}</span>
          </div>
        </form>
      </div>
    </>
  )
}
