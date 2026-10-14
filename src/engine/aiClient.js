// ECHO AI client — talks to the Netlify proxy (Gemini → Groq happens server-side).
// Returns null on ANY problem so the caller falls through to ECHO's offline engine.
// Also: a short cooldown after failures so a dead endpoint (offline, `vite dev` without
// Netlify functions, both providers down) doesn't add a delay to every message.

const ENDPOINT   = '/.netlify/functions/chat'
const TIMEOUT_MS = 20000   // > server's two 8s provider timeouts, so a Groq fallback can finish
const COOLDOWN_MS = 45000

let _coolUntil = 0
let _lastProvider = null
let _enabled = true
try { _enabled = localStorage.getItem('echo_ai') !== 'off' } catch {}

export const isAIEnabled   = () => _enabled
export const lastProvider  = () => _lastProvider   // 'gemini' | 'groq' | null (offline engine)
export const setAIEnabled  = (on) => {
  _enabled = !!on
  try { localStorage.setItem('echo_ai', on ? 'on' : 'off') } catch {}
}

/**
 * @param {{mode?:'chat'|'wiser'|'journal', context?:string, messages:{role:string,content:string}[]}} req
 * @returns {Promise<string|null>}
 */
export async function askAI({ mode = 'chat', context = '', messages }) {
  if (!_enabled) return null
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return null
  if (Date.now() < _coolUntil) return null

  const ctrl  = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        context,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data?.text) throw new Error('empty')
    _lastProvider = data.provider || null
    return data.text
  } catch (err) {
    _lastProvider = null
    _coolUntil = Date.now() + COOLDOWN_MS
    console.warn('[ECHO ai] falling back to offline engine —', err.message)
    return null
  } finally {
    clearTimeout(timer)
  }
}
