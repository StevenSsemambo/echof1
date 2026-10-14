// ECHO Wake Word Engine
// Runs a silent continuous speech recognition loop while the app is open.
// When it hears "echo" or "hey echo", it fires onWake() — just like Alexa.
// Uses very low resource footprint: only scans for the trigger word, nothing more.

const WAKE_PHRASES = [
  'echo', 'hey echo', 'hi echo', 'yo echo',
  'echo wake', 'ok echo', 'okay echo',
]

let _recognition    = null
let _active         = false
let _onWake         = null
let _onListenStart  = null
let _onListenEnd    = null
let _suspended      = false   // true when user is already talking (full listen mode)
let _restartTimer   = null

// ── SUPPORT CHECK ──────────────────────────────────────────────────────────────
export const isWakeWordSupported = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

// ── CORE DETECTION ────────────────────────────────────────────────────────────
const containsWakeWord = (transcript) => {
  const lower = transcript.toLowerCase().trim()
  return WAKE_PHRASES.some(phrase => lower.includes(phrase))
}

// ── START BACKGROUND LISTENING ─────────────────────────────────────────────────
export const startWakeWordListener = (callbacks = {}) => {
  if (!isWakeWordSupported()) return false
  if (_active) return true

  _onWake       = callbacks.onWake       || (() => {})
  _onListenStart = callbacks.onListenStart || (() => {})
  _onListenEnd   = callbacks.onListenEnd   || (() => {})

  _active = true
  _boot()
  return true
}

const _boot = () => {
  if (!_active || _suspended) return

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  _recognition = new SpeechRecognition()

  _recognition.continuous      = true
  _recognition.interimResults  = true
  _recognition.maxAlternatives = 1
  _recognition.lang            = 'en-US'

  _recognition.onstart = () => {
    _onListenStart()
  }

  _recognition.onresult = (event) => {
    if (_suspended) return

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (containsWakeWord(transcript)) {
        // Debounce — don't fire more than once per 3 seconds
        if (_lastWakeMs && Date.now() - _lastWakeMs < 3000) continue
        _lastWakeMs = Date.now()
        _onWake(transcript.trim())
        return
      }
    }
  }

  _recognition.onerror = (e) => {
    // "no-speech" and "aborted" are normal — just restart quietly
    if (e.error === 'not-allowed') {
      _active = false
      return
    }
    _scheduleRestart()
  }

  _recognition.onend = () => {
    _onListenEnd()
    if (_active && !_suspended) {
      _scheduleRestart()
    }
  }

  try {
    _recognition.start()
  } catch (err) {
    _scheduleRestart()
  }
}

let _lastWakeMs = 0

const _scheduleRestart = () => {
  clearTimeout(_restartTimer)
  if (!_active || _suspended) return
  // Short delay before restarting to avoid hammering the API
  _restartTimer = setTimeout(() => {
    if (_active && !_suspended) _boot()
  }, 1200)
}

// ── SUSPEND / RESUME ──────────────────────────────────────────────────────────
// Call suspend() when Echo is in full conversation mode (so we don't double-listen)
// Call resume() when full conversation ends

export const suspendWakeWord = () => {
  _suspended = true
  clearTimeout(_restartTimer)
  if (_recognition) {
    try { _recognition.abort() } catch (_) {}
    _recognition = null
  }
}

export const resumeWakeWord = () => {
  if (!_active) return
  _suspended = false
  // Small delay to let previous recognition fully close
  setTimeout(_boot, 800)
}

// ── STOP COMPLETELY ───────────────────────────────────────────────────────────
export const stopWakeWordListener = () => {
  _active    = false
  _suspended = false
  clearTimeout(_restartTimer)
  if (_recognition) {
    try { _recognition.abort() } catch (_) {}
    _recognition = null
  }
}

export const isWakeWordActive = () => _active && !_suspended

// ── ECHO WAKE RESPONSES ───────────────────────────────────────────────────────
// What Echo says when it hears its name

export const getWakeResponse = (profile) => {
  const name = profile?.name ? `, ${profile.name}` : ''
  const hour = new Date().getHours()

  const timeGreet =
    hour < 9  ? `Good morning${name}.` :
    hour < 12 ? `Morning${name}.` :
    hour < 17 ? `Hey${name}.` :
    hour < 20 ? `Good evening${name}.` :
                `Hey${name}.`

  const responses = [
    `${timeGreet} I'm here. What's on your mind?`,
    `${timeGreet} You called — I'm listening.`,
    `I'm here${name}. Go ahead.`,
    `${timeGreet} What do you need?`,
    `Here${name}. I caught that. What's up?`,
    `I heard you${name}. What's going on?`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
