// ECHO Conversation State Engine
// Tracks what Echo has already said, current mode, prevents repetition.
// Lives entirely in memory per session — resets on page reload intentionally.

const safeStr = v => (typeof v === 'string' && v.trim().length > 0) ? v : null

// ── SESSION-LEVEL PHRASE MEMORY ────────────────────────────────────────────────
// Stores fingerprints of every Echo response this session so nothing repeats
const _sessionPhrases = new Set()
const _sessionOpenings = new Set()
const _sessionQuestions = new Set()
const _sessionTopics = new Set()

// Extract the opening clause of a string (first ~8 words)
const getOpening = (text) => {
  if (!text) return ''
  return text.split(/\s+/).slice(0, 8).join(' ').toLowerCase().replace(/[^a-z\s]/g, '')
}

// Extract question text from a string
const extractQuestion = (text) => {
  if (!text) return null
  const sentences = text.split(/[.!?]+/)
  const q = sentences.find(s => s.includes('?'))
  return q ? q.trim().toLowerCase().replace(/[^a-z\s]/g, '').slice(0, 40) : null
}

// Fingerprint a full response
const fingerprint = (text) => {
  if (!text) return ''
  return text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).slice(0, 12).join(' ')
}

export const recordEchoResponse = (text) => {
  if (!safeStr(text)) return
  _sessionPhrases.add(fingerprint(text))
  const opening = getOpening(text)
  if (opening) _sessionOpenings.add(opening)
  const question = extractQuestion(text)
  if (question) _sessionQuestions.add(question)
}

export const hasEchoSaidSimilar = (text) => {
  if (!safeStr(text)) return false
  const fp = fingerprint(text)
  if (_sessionPhrases.has(fp)) return true
  const opening = getOpening(text)
  if (opening && _sessionOpenings.has(opening)) return true
  const question = extractQuestion(text)
  if (question && _sessionQuestions.has(question)) return true
  return false
}

export const hasAskedQuestion = (question) => {
  if (!question) return false
  const q = question.toLowerCase().replace(/[^a-z\s]/g, '').slice(0, 40)
  return _sessionQuestions.has(q)
}

export const recordTopicDiscussed = (topic) => {
  if (safeStr(topic)) _sessionTopics.add(topic.toLowerCase())
}

export const hasDiscussedTopic = (topic) => {
  if (!topic) return false
  return _sessionTopics.has(topic.toLowerCase())
}

export const getSessionStats = () => ({
  phrasesUsed: _sessionPhrases.size,
  questionsAsked: _sessionQuestions.size,
  topicsCovered: [..._sessionTopics],
})

// ── CONVERSATION MODE STATE MACHINE ───────────────────────────────────────────
// Tracks what Echo is currently doing so responses fit the arc of the conversation

const MODES = {
  greeting:       'greeting',       // just opened
  listening:      'listening',      // user sharing, Echo mostly receiving
  exploring:      'exploring',      // going deeper on a topic
  reflecting:     'reflecting',     // Echo sharing perspective
  storytelling:   'storytelling',   // Echo in a story arc
  debating:       'debating',       // Echo challenging an idea
  checking_in:    'checking_in',    // Echo initiated, asking how user is
  celebrating:    'celebrating',    // user shared good news
  crisis:         'crisis',         // urgency detected
  idle_initiated: 'idle_initiated', // Echo spoke first unprompted
}

let _currentMode = MODES.greeting
let _modeHistory = []
let _turnsInMode = 0

export const getCurrentMode = () => _currentMode

export const setMode = (mode) => {
  if (!MODES[mode]) return
  if (_currentMode !== mode) {
    _modeHistory.push({ mode: _currentMode, turns: _turnsInMode })
    if (_modeHistory.length > 20) _modeHistory.shift()
    _currentMode = mode
    _turnsInMode = 0
  }
  _turnsInMode++
}

export const incrementTurns = () => { _turnsInMode++ }

export const getTurnsInMode = () => _turnsInMode

export const getPreviousMode = () => _modeHistory[_modeHistory.length - 1]?.mode || null

export const inferMode = (parsed, history) => {
  const { mood, intent, urgency, isQuestion, complexity } = parsed
  const userTurns = history.filter(m => m.role === 'user').length

  if (urgency)                                              return MODES.crisis
  if (intent === 'celebrating')                             return MODES.celebrating
  if (userTurns <= 1)                                       return MODES.greeting
  if (['sadness','shame','fear'].includes(mood) &&
      intent === 'venting')                                 return MODES.listening
  if (intent === 'seeking_advice' || isQuestion)            return MODES.exploring
  if (intent === 'reflecting' || mood === 'confusion')      return MODES.exploring
  if (['sadness','fear','shame'].includes(mood))            return MODES.listening
  if (intent === 'planning' || intent === 'questioning')    return MODES.exploring
  return MODES.reflecting
}

// ── RESPONSE VARIETY ENGINE ───────────────────────────────────────────────────
// Makes sure consecutive Echo messages feel tonally different

const _toneHistory = []

const TONE_TYPES = ['empathetic', 'philosophical', 'direct', 'curious', 'grounding', 'challenging']

export const getNextTone = (mood, mode) => {
  const recent = _toneHistory.slice(-3)

  // Mood-appropriate tones
  const preferred = {
    sadness:   ['empathetic', 'grounding', 'philosophical'],
    fear:      ['grounding',  'empathetic', 'curious'],
    anger:     ['direct',     'curious',    'empathetic'],
    joy:       ['curious',    'philosophical', 'direct'],
    hope:      ['curious',    'philosophical', 'empathetic'],
    confusion: ['curious',    'direct',     'grounding'],
    shame:     ['empathetic', 'grounding',  'philosophical'],
    love:      ['empathetic', 'philosophical', 'curious'],
    neutral:   TONE_TYPES,
  }

  const pool = (preferred[mood] || TONE_TYPES).filter(t => !recent.includes(t))
  const chosen = pool.length ? pool[Math.floor(Math.random() * pool.length)] : TONE_TYPES[Math.floor(Math.random() * TONE_TYPES.length)]
  _toneHistory.push(chosen)
  if (_toneHistory.length > 10) _toneHistory.shift()
  return chosen
}

// ── TRANSITION BRIDGES ────────────────────────────────────────────────────────
// Natural language bridges when Echo shifts topic or tone mid-conversation

export const getTransitionBridge = (fromMode, toMode, profile) => {
  const name = safeStr(profile?.name)
  const n = name ? name + ' — ' : ''

  const bridges = {
    'listening→exploring': [
      `${n}I want to go a little deeper into what you just said.`,
      `There is something in what you shared I want to stay with a moment longer.`,
      `Something about that last part — I am not ready to move past it yet.`,
    ],
    'exploring→reflecting': [
      `Let me tell you what I actually think about this.`,
      `Something in what you said has brought something up for me.`,
      `I want to share a perspective — not as an answer, just as something worth considering.`,
    ],
    'reflecting→exploring': [
      `But I want to understand your side of this more.`,
      `I have said what I think. Now I am genuinely curious about you.`,
      `That is my read. What does it feel like from the inside?`,
    ],
    'greeting→listening': [
      `I am here. Tell me what is actually going on.`,
      `No preamble needed. What is on your mind?`,
    ],
    'idle_initiated→listening': [
      `I am glad you responded. Tell me — `,
      `Good. Now that you are here — `,
    ],
  }

  const key = `${fromMode}→${toMode}`
  const pool = bridges[key]
  if (!pool) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// ── NAME INJECTION ────────────────────────────────────────────────────────────
// Real humans naturally use your name in conversation. Echo should too.
// Fires occasionally — not every message, which would feel robotic.

let _nameUsedAt = -99 // turn number when name was last used

export const shouldUseName = (profile, userTurns) => {
  if (!profile?.name) return false
  // Use name: on first reply after learning it, then every ~6-8 turns
  const gap = userTurns - _nameUsedAt
  if (gap < 5) return false
  const threshold = _nameUsedAt === -99 ? 0 : 0.25 // always fire on first use
  return Math.random() < threshold || gap >= 8
}

export const markNameUsed = (userTurns) => {
  _nameUsedAt = userTurns
}

// Prepend name naturally to an existing response string
export const injectName = (response, name, style = 'prefix') => {
  if (!response || !name) return response
  const styles = {
    prefix:  `${name} — ${response}`,
    inline:  response.replace(/\.\s+/, `. ${name}, `),
    address: `${name}.\n\n${response}`,
  }
  return styles[style] || styles.prefix
}

// ── CONTEXT THREADING TRACKER ─────────────────────────────────────────────────
// Tracks the last significant topic + turn so echoMemory.recall() can be
// triggered naturally without firing on every single message

let _lastRecallTurn = -10

export const shouldAttemptRecall = (userTurns) => {
  if (userTurns < 4) return false
  if (userTurns - _lastRecallTurn < 4) return false
  return Math.random() < 0.35
}

export const markRecallUsed = (userTurns) => {
  _lastRecallTurn = userTurns
}

export const resetSession = () => {
  _sessionPhrases.clear()
  _sessionOpenings.clear()
  _sessionQuestions.clear()
  _sessionTopics.clear()
  _currentMode = MODES.greeting
  _modeHistory = []
  _turnsInMode = 0
  _toneHistory.length = 0
  _nameUsedAt = -99
  _lastRecallTurn = -10
}
