// ECHO Episodic Memory Engine
// Indexes conversations for key moments, self-revelations, commitments,
// and emotional arcs. Recalls relevant past exchanges when current
// conversation overlaps. Generates growth reflections over time.
//
// This is session-level memory — it lives during a conversation.
// Long-term memory is stored in IndexedDB via storage.js.
//
// Built by SayMyTech · Created by Steven

// ── SESSION EPISODIC INDEX ─────────────────────────────────────────────────────
const _index = {
  exchanges: [],       // { user, echo, tags, mood, timestamp, significance }
  keyMoments: [],      // exchanges flagged as significant
  userReveals: [],     // things user disclosed about themselves
  userCommitments: [], // things user said they'd do
  topicsDepth: {},     // topic → depth score (how deeply it was explored)
  emotionArc: [],      // sequence of emotional moments
  growthReflection: null,
}

// ── SIGNIFICANCE DETECTION ────────────────────────────────────────────────────
// Determines if an exchange is a key moment worth remembering

const SIGNIFICANCE_SIGNALS = {
  user: [
    // Self-revelation
    /i('ve| have) never (told|said|shared)/i,
    /i('ve| have) always (known|felt|believed|been)/i,
    /the truth is/i,
    /honestly,?/i,
    /i('m| am) afraid/i,
    /i('m| am) ashamed/i,
    /i('m| am) proud/i,
    /that('s| is) why i/i,
    /i think the real reason/i,
    /i('ve| have) been thinking about/i,
    /i realised/i,
    /i realized/i,
    /i want to/i,
    /i need to/i,
    /i (wish|regret)/i,
    /my (biggest|deepest|real) (fear|dream|goal|regret|problem)/i,
    // Commitments
    /i('m| am) going to/i,
    /i will/i,
    /i('m| am) (going to|planning to|trying to)/i,
    /starting (today|tomorrow|this week)/i,
    // Vulnerability
    /i don't know what to do/i,
    /i('m| am) lost/i,
    /i('m| am) struggling/i,
    /i feel (like|so)/i,
  ],
  echo: [
    // Echo's strong observations
    /i notice/i,
    /something i want to say/i,
    /can i be honest/i,
    /here('s| is) what i actually think/i,
    /the pattern i see/i,
  ],
}

function detectSignificance(userText, echoText) {
  const userScore = SIGNIFICANCE_SIGNALS.user.filter(re => re.test(userText)).length
  const echoScore = SIGNIFICANCE_SIGNALS.echo.filter(re => re.test(echoText)).length
  return userScore + echoScore
}

// ── TOPIC EXTRACTION ──────────────────────────────────────────────────────────
function extractTopics(text) {
  const topics = []
  const lower = text.toLowerCase()

  const topicMap = {
    'fear': /\b(fear|afraid|scared|anxiety|anxious|worry|worried)\b/i,
    'goal': /\b(goal|ambition|dream|aspire|plan|target|achieve)\b/i,
    'relationship': /\b(relationship|partner|friend|family|love|connection|lonely)\b/i,
    'work': /\b(work|job|career|boss|colleague|business|startup|office)\b/i,
    'identity': /\b(who i am|identity|self|person|character|values)\b/i,
    'growth': /\b(grow|change|better|improve|learn|develop)\b/i,
    'regret': /\b(regret|wish|should have|could have|mistake|wrong)\b/i,
    'meaning': /\b(meaning|purpose|why|point|worth|matter)\b/i,
    'success': /\b(success|win|achieve|accomplish|fail|failure)\b/i,
    'grief': /\b(grief|loss|lost|death|died|miss|missing)\b/i,
    'decision': /\b(decision|choose|choice|decide|dilemma|options)\b/i,
    'confidence': /\b(confidence|doubt|uncertain|sure|believe in myself)\b/i,
    'creativity': /\b(create|creative|art|build|make|design|write)\b/i,
    'money': /\b(money|finance|financial|rich|poor|debt|afford)\b/i,
    'health': /\b(health|body|exercise|sick|tired|energy|sleep)\b/i,
    'time': /\b(time|busy|overwhelmed|schedule|balance|too much)\b/i,
  }

  for (const [topic, re] of Object.entries(topicMap)) {
    if (re.test(text)) topics.push(topic)
  }

  return topics
}

// ── MOOD DETECTION ────────────────────────────────────────────────────────────
function detectMood(text) {
  const lower = text.toLowerCase()
  if (/\b(sad|depressed|unhappy|miserable|down|crying|hopeless)\b/i.test(text)) return 'sad'
  if (/\b(anxious|nervous|worried|scared|afraid|panicking)\b/i.test(text)) return 'anxious'
  if (/\b(angry|frustrated|furious|annoyed|pissed|rage)\b/i.test(text)) return 'angry'
  if (/\b(happy|excited|thrilled|great|amazing|wonderful|joyful)\b/i.test(text)) return 'joyful'
  if (/\b(hopeful|optimistic|looking forward|excited about)\b/i.test(text)) return 'hopeful'
  if (/\b(confused|lost|unsure|don't know|uncertain)\b/i.test(text)) return 'confused'
  if (/\b(tired|exhausted|drained|burned out|done)\b/i.test(text)) return 'tired'
  if (/\b(proud|accomplished|did it|succeeded|managed to)\b/i.test(text)) return 'proud'
  return 'neutral'
}

// ── USER REVEAL EXTRACTION ────────────────────────────────────────────────────
function extractUserReveal(userText) {
  // Extracts what the user disclosed about themselves
  const patterns = [
    { re: /i('m| am) (afraid|scared) of (.+)/i, field: 'fear', group: 3 },
    { re: /my (biggest|deepest|real) fear is (.+)/i, field: 'fear', group: 2 },
    { re: /i want to (.+) (but|however|except)/i, field: 'blocked_goal', group: 1 },
    { re: /i('ve| have) always wanted to (.+)/i, field: 'desire', group: 2 },
    { re: /i regret (.+)/i, field: 'regret', group: 1 },
    { re: /i wish i had (.+)/i, field: 'regret', group: 1 },
    { re: /my goal is to (.+)/i, field: 'goal', group: 1 },
    { re: /i('m| am) trying to (.+)/i, field: 'attempt', group: 2 },
    { re: /i('m| am) going to (.+)/i, field: 'commitment', group: 2 },
    { re: /i believe (.+)/i, field: 'belief', group: 1 },
    { re: /i('ve| have) never (.+)/i, field: 'never_done', group: 2 },
    { re: /the truth is (.+)/i, field: 'truth', group: 1 },
    { re: /i('m| am) proud (of|that) (.+)/i, field: 'pride', group: 3 },
    { re: /i struggle with (.+)/i, field: 'struggle', group: 1 },
  ]

  for (const { re, field, group } of patterns) {
    const match = userText.match(re)
    if (match && match[group]) {
      return {
        field,
        content: match[group].trim().replace(/[.!?]+$/, ''),
        raw: userText,
      }
    }
  }
  return null
}

// ── COMMITMENT EXTRACTION ─────────────────────────────────────────────────────
function extractCommitment(userText) {
  const patterns = [
    /i('m| am) going to (.+)/i,
    /i will (.+) (starting|from|today|tomorrow)/i,
    /i('ll| will) (.+)/i,
    /starting (today|tomorrow|this week|monday), i('ll| will) (.+)/i,
  ]
  for (const re of patterns) {
    if (re.test(userText)) return userText.trim()
  }
  return null
}

// ── MAIN API ──────────────────────────────────────────────────────────────────
export const echoMemory = {

  // Called after each exchange — indexes it for future reference
  indexExchange(userText, echoText, profile = {}) {
    if (!userText || !echoText) return

    const significance = detectSignificance(userText, echoText)
    const topics = extractTopics(userText)
    const mood = detectMood(userText)
    const reveal = extractUserReveal(userText)
    const commitment = extractCommitment(userText)

    const exchange = {
      user: userText.slice(0, 300),
      echo: echoText.slice(0, 300),
      topics,
      mood,
      significance,
      timestamp: Date.now(),
    }

    _index.exchanges.push(exchange)

    // Accumulate topic depth
    topics.forEach(t => {
      _index.topicsDepth[t] = (_index.topicsDepth[t] || 0) + 1 + (significance * 0.5)
    })

    // Flag key moments
    if (significance >= 2) {
      _index.keyMoments.push({ ...exchange, flagged: true })
    }

    // Store user reveals
    if (reveal) {
      _index.userReveals.push({ ...reveal, timestamp: Date.now() })
    }

    // Store commitments
    if (commitment) {
      _index.userCommitments.push({
        text: commitment,
        timestamp: Date.now(),
        followed_up: false,
      })
    }

    // Track emotion arc
    if (mood !== 'neutral') {
      _index.emotionArc.push({ mood, timestamp: Date.now() })
    }

    // Invalidate cached growth reflection
    _index.growthReflection = null
  },

  // Gets a summary of what's happened this session — feeds into brain.js
  getSummary(conversationHistory = []) {
    const lines = []

    if (_index.exchanges.length === 0) {
      return null
    }

    // Top topics explored
    const topTopics = Object.entries(_index.topicsDepth)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([t]) => t)
    if (topTopics.length) {
      lines.push(`Topics explored this session: ${topTopics.join(', ')}`)
    }

    // Emotion arc
    if (_index.emotionArc.length > 1) {
      const arc = _index.emotionArc.map(e => e.mood).join(' → ')
      lines.push(`Emotional arc: ${arc}`)
    }

    // Key moments
    if (_index.keyMoments.length) {
      const recent = _index.keyMoments.slice(-3).map(m => `"${m.user.slice(0, 80)}..."`)
      lines.push(`Key moments:\n  ${recent.join('\n  ')}`)
    }

    // User reveals
    if (_index.userReveals.length) {
      const reveals = _index.userReveals.slice(-4).map(r => `${r.field}: ${r.content}`)
      lines.push(`What they've disclosed:\n  ${reveals.join('\n  ')}`)
    }

    // Commitments
    if (_index.userCommitments.length) {
      const commits = _index.userCommitments.slice(-3).map(c => c.text)
      lines.push(`Things they said they'd do:\n  ${commits.join('\n  ')}`)
    }

    return lines.join('\n\n')
  },

  // Recalls an earlier moment relevant to current text
  recall(currentText) {
    if (_index.exchanges.length < 3) return null

    const currentTopics = extractTopics(currentText)
    if (!currentTopics.length) return null

    // Find a past exchange that overlaps in topic and was significant
    const candidates = _index.exchanges
      .slice(0, -2) // Don't recall the most recent exchange
      .filter(ex => ex.topics.some(t => currentTopics.includes(t)) && ex.significance >= 1)
      .sort((a, b) => b.significance - a.significance)

    return candidates[0] || null
  },

  // Like recall() but returns a ready-to-use response sentence rather than raw exchange
  // This is what brain.js and responder.js should call for natural context threading
  recallAsThread(currentText) {
    const exchange = this.recall(currentText)
    if (!exchange) return null

    const snippet = exchange.user.slice(0, 70).trim()
    const topic   = exchange.topics[0] || 'this'

    const templates = [
      `Something you said earlier is sitting with me — "${snippet}…" — I keep thinking about how that connects to this.`,
      `You mentioned ${topic} before. I don't think that thread is finished.`,
      `Earlier you said "${snippet}…" — I notice it coming up again. There's a pattern here worth naming.`,
      `This keeps circling back to ${topic}. That's not a coincidence.`,
      `I remember what you said about ${topic}. I think you're still in that same current — just a different moment in it.`,
    ]

    return templates[Math.floor(Math.random() * templates.length)]
  },

  // Generates a "growth reflection" — who this person is becoming
  getGrowthReflection(profile = {}) {
    if (_index.growthReflection) return _index.growthReflection

    const reveals = _index.userReveals
    const commits = _index.userCommitments
    const topTopics = Object.entries(_index.topicsDepth)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t)

    if (reveals.length < 2 && commits.length < 1) return null

    const parts = []

    if (topTopics.length) {
      parts.push(`This session has circled around: ${topTopics.join(', ')}.`)
    }

    if (reveals.length) {
      const lastReveal = reveals[reveals.length - 1]
      parts.push(`Something that stood out: you said "${lastReveal.content}" — in the context of ${lastReveal.field}.`)
    }

    if (commits.length) {
      const lastCommit = commits[commits.length - 1]
      parts.push(`You made a commitment: "${lastCommit.text}". I haven't forgotten that.`)
    }

    const reflection = parts.join(' ')
    _index.growthReflection = reflection
    return reflection
  },

  // Check if a commitment was made and echo should follow up
  hasPendingCommitment() {
    return _index.userCommitments.some(c => !c.followed_up)
  },

  // Get pending commitment for follow-up
  getPendingCommitment() {
    return _index.userCommitments.find(c => !c.followed_up) || null
  },

  // Mark a commitment as followed up
  markCommitmentFollowedUp(index = 0) {
    if (_index.userCommitments[index]) {
      _index.userCommitments[index].followed_up = true
    }
  },

  // Reset for new session
  reset() {
    _index.exchanges = []
    _index.keyMoments = []
    _index.userReveals = []
    _index.userCommitments = []
    _index.topicsDepth = {}
    _index.emotionArc = []
    _index.growthReflection = null
  },

  // Expose index for debugging
  getIndex() {
    return { ..._index }
  },
}
