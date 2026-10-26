export class RateLimiter {
  constructor({ windowMs, max, now = () => Date.now() }) {
    this.windowMs = windowMs
    this.max = max
    this.now = now
    this.hits = new Map()
  }

  take(key) {
    const now = this.now()
    const cutoff = now - this.windowMs
    const previous = this.hits.get(key) ?? []
    const active = previous.filter(timestamp => timestamp > cutoff)
    if (active.length >= this.max) {
      const retryAfter = Math.max(1, Math.ceil((active[0] + this.windowMs - now) / 1000))
      this.hits.set(key, active)
      return { allowed: false, remaining: 0, retryAfter }
    }
    active.push(now)
    this.hits.set(key, active)
    if (this.hits.size > 5_000) this.cleanup(now)
    return { allowed: true, remaining: this.max - active.length, retryAfter: 0 }
  }

  cleanup(now = this.now()) {
    const cutoff = now - this.windowMs
    for (const [key, timestamps] of this.hits) {
      const active = timestamps.filter(timestamp => timestamp > cutoff)
      if (active.length) this.hits.set(key, active)
      else this.hits.delete(key)
    }
  }
}

export class DailyBudget {
  constructor({ maxRequests, maxTokens, now = () => Date.now() }) {
    this.maxRequests = maxRequests
    this.maxTokens = maxTokens
    this.now = now
    this.day = ''
    this.requests = 0
    this.tokens = 0
  }

  rollover() {
    const day = new Date(this.now()).toISOString().slice(0, 10)
    if (day !== this.day) {
      this.day = day
      this.requests = 0
      this.tokens = 0
    }
  }

  check() {
    this.rollover()
    if (this.requests >= this.maxRequests) {
      return { allowed: false, reason: 'requests', requests: this.requests, tokens: this.tokens }
    }
    if (this.tokens >= this.maxTokens) {
      return { allowed: false, reason: 'tokens', requests: this.requests, tokens: this.tokens }
    }
    return { allowed: true, requests: this.requests, tokens: this.tokens }
  }

  addRequest() {
    this.rollover()
    this.requests += 1
  }

  addTokens(count) {
    this.rollover()
    const parsed = Number.isFinite(count) ? Math.max(0, count) : 0
    this.tokens += parsed
  }

  snapshot() {
    this.rollover()
    return { day: this.day, requests: this.requests, tokens: this.tokens }
  }
}

export class ConcurrencyGate {
  constructor(max) {
    this.max = max
    this.active = 0
  }

  enter() {
    if (this.active >= this.max) return false
    this.active += 1
    return true
  }

  leave() {
    this.active = Math.max(0, this.active - 1)
  }
}
