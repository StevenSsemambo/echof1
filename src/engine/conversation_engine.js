// ECHO Conversation Engine
// Tracks multi-turn context, threads topics across messages,
// ensures Echo follows through on things he said, and builds
// real conversational memory within a session.

const safeStr = v => (typeof v === 'string' && v.trim().length > 0) ? v : null
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

// ── SESSION CONTEXT ────────────────────────────────────────────────────────────
// Everything Echo said and referenced this session

const _ctx = {
  echoCommitments: [],   // things Echo said he'd come back to
  topicsRaised:    [],   // topics Echo or user introduced
  questionsAsked:  [],   // questions Echo asked (with answers if given)
  namedEntities:   {},   // people, places the user mentioned by name
  userStances:     {},   // positions the user has taken
  echoStances:     {},   // positions Echo has taken
  turnCount:       0,
  lastEchoTopic:   null,
  lastUserTopic:   null,
  conversationArc: 'opening', // opening → developing → deep → closing
}

export const resetConversationEngine = () => {
  _ctx.echoCommitments = []
  _ctx.topicsRaised    = []
  _ctx.questionsAsked  = []
  _ctx.namedEntities   = {}
  _ctx.userStances     = {}
  _ctx.echoStances     = {}
  _ctx.turnCount       = 0
  _ctx.lastEchoTopic   = null
  _ctx.lastUserTopic   = null
  _ctx.conversationArc = 'opening'
}

// ── TURN PROCESSING ────────────────────────────────────────────────────────────
export const processTurn = (userText, echoText, parsed) => {
  _ctx.turnCount++

  // Update arc
  if (_ctx.turnCount > 20)     _ctx.conversationArc = 'deep'
  else if (_ctx.turnCount > 8) _ctx.conversationArc = 'developing'
  else if (_ctx.turnCount > 3) _ctx.conversationArc = 'warming'

  // Extract named entities from user (simple: capitalised words, names)
  const nameMatches = userText.match(/\b([A-Z][a-z]{2,})\b/g) || []
  nameMatches.forEach(name => {
    if (!['I','The','This','That','What','Why','How','When','Where','Who'].includes(name)) {
      _ctx.namedEntities[name] = (_ctx.namedEntities[name] || 0) + 1
    }
  })

  // Extract user stance on topics (basic)
  const lowerUser = userText.toLowerCase()
  if (parsed?.concepts?.length) {
    const topic = parsed.concepts[0]
    _ctx.lastUserTopic = topic
    if (!_ctx.topicsRaised.includes(topic)) _ctx.topicsRaised.push(topic)
  }

  // Track Echo commitments — things Echo said he'd revisit
  const commitmentPhrases = [
    'come back to', 'revisit', 'want to ask you', 'think about that',
    'return to', 'talk about that', 'explore that', 'dig into'
  ]
  if (echoText) {
    const echoLower = echoText.toLowerCase()
    commitmentPhrases.forEach(phrase => {
      if (echoLower.includes(phrase)) {
        const idx = echoLower.indexOf(phrase)
        const snippet = echoText.slice(Math.max(0, idx - 20), Math.min(echoText.length, idx + 60))
        if (!_ctx.echoCommitments.includes(snippet)) {
          _ctx.echoCommitments.push(snippet)
        }
      }
    })

    // Track questions Echo asked
    const echoQuestions = echoText.split(/[.!]/).filter(s => s.includes('?'))
    echoQuestions.forEach(q => {
      const trimQ = q.trim().slice(0, 80)
      if (trimQ && !_ctx.questionsAsked.some(x => x.question === trimQ)) {
        _ctx.questionsAsked.push({ question: trimQ, answered: false, turnAsked: _ctx.turnCount })
      }
    })
  }

  // Mark recent questions as answered (simple heuristic — user responded)
  _ctx.questionsAsked
    .filter(q => !q.answered && _ctx.turnCount - q.turnAsked <= 2)
    .forEach(q => { q.answered = true; q.answer = userText.slice(0, 100) })
}

// ── FOLLOW-THROUGH GENERATOR ───────────────────────────────────────────────────
// Returns a follow-through line if Echo should reference something from earlier

export const getFollowThrough = (parsed, history) => {
  if (_ctx.turnCount < 3) return null

  const userMsgs = history.filter(m => m.role === 'user')
  const recentUser = userMsgs.slice(-1)[0]?.content || ''

  // 1. Reference a named person the user mentioned earlier
  const frequentNames = Object.entries(_ctx.namedEntities)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)

  if (frequentNames.length && Math.random() > 0.6) {
    const name = frequentNames[0]
    const refs = [
      `You've mentioned ${name} a few times now. Tell me more about them.`,
      `${name} keeps coming up. Who is ${name} to you?`,
      `I notice ${name} appears a lot in what you're sharing. What's that relationship like?`,
    ]
    return pick(refs)
  }

  // 2. Circle back to an unanswered question
  const unanswered = _ctx.questionsAsked.filter(q => !q.answered && _ctx.turnCount - q.turnAsked > 2)
  if (unanswered.length && Math.random() > 0.5) {
    const q = unanswered[0]
    const callbacks = [
      `I asked you something earlier that you didn't quite answer — ${q.question} I want to come back to that.`,
      `Going back to something — ${q.question} I'm still curious.`,
      `You never really answered this, and I think it matters: ${q.question}`,
    ]
    q.answered = true // mark as retrieved
    return pick(callbacks)
  }

  // 3. Connect current topic to an earlier topic
  if (_ctx.topicsRaised.length >= 3 && parsed?.concepts?.length) {
    const currentTopic = parsed.concepts[0]
    const earlierTopic = _ctx.topicsRaised.find(t => t !== currentTopic && t.length > 3)
    if (earlierTopic && Math.random() > 0.65) {
      const connections = [
        `I notice "${currentTopic}" and "${earlierTopic}" have both come up — I don't think that's a coincidence.`,
        `Earlier you were talking about ${earlierTopic}. This feels connected to that. Do you see it?`,
        `"${currentTopic}" and "${earlierTopic}" in the same conversation. What's the thread between them for you?`,
      ]
      return pick(connections)
    }
  }

  return null
}

// ── ARC-AWARE RESPONSE SHAPING ─────────────────────────────────────────────────
// Different arc stages call for different conversational energy

export const getArcGuidance = () => {
  const arc = _ctx.conversationArc
  return {
    opening: {
      energy: 'warm and exploratory',
      priority: 'establish connection, learn name and context',
      lengthGuidance: 'medium — not too much, not too little',
    },
    warming: {
      energy: 'curious and engaged',
      priority: "go deeper on what they've shared, start building profile",
      lengthGuidance: "can go longer — they're engaged",
    },
    developing: {
      energy: 'incisive and personal',
      priority: 'make specific references to what you know, challenge gently',
      lengthGuidance: 'quality over length — say the precise thing',
    },
    deep: {
      energy: 'direct, honest, equal',
      priority: 'speak as wiser self, make bold observations, share your own view',
      lengthGuidance: 'can be short and sharp — relationship is established',
    },
  }[arc] || { energy: 'neutral', priority: 'respond naturally', lengthGuidance: 'medium' }
}

export const getConversationArc = () => _ctx.conversationArc
export const getTurnCount = () => _ctx.turnCount
export const getTopicsRaised = () => [..._ctx.topicsRaised]
export const getNamedEntities = () => ({ ..._ctx.namedEntities })

// ── TOPIC THREADING ────────────────────────────────────────────────────────────
// Returns a smooth transition when Echo wants to change topic

export const getTopicTransition = (fromTopic, toTopic) => {
  if (!fromTopic || !toTopic) return ''
  const transitions = [
    `That connects to something different I want to bring up — ${toTopic}.`,
    `Coming back to something — I want to shift to ${toTopic} for a second.`,
    `Speaking of which — what do you think about ${toTopic}?`,
    `That makes me think about ${toTopic}. Stick with me.`,
    `On a related note — ${toTopic}. What's your take?`,
  ]
  return pick(transitions)
}

// ── ECHO STANCE TRACKING ───────────────────────────────────────────────────────
export const recordEchoStance = (topic, position) => {
  _ctx.echoStances[topic] = position
}

export const getEchoStance = (topic) => _ctx.echoStances[topic] || null

export const getConsistencyCheck = (currentPosition, topic) => {
  const previous = _ctx.echoStances[topic]
  if (!previous || previous === currentPosition) return null
  return `I said something about ${topic} earlier — I want to make sure I'm being consistent.`
}
