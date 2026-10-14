// ECHO Belief Engine v2 — Bug fixes + daily thought + proactive memory
import { tokenize } from './parser.js'

const safeStr = v => (typeof v === 'string' && v.trim().length > 0) ? v : null

// ── BELIEF INFERENCE ──────────────────────────────────────────────────────────
const BELIEF_PATTERNS = [
  {
    id: 'not_enough',
    belief: "you are not enough",
    signals: ['should be','not good enough','why can\'t i','everyone else','compare','failing','behind','mess up','disappoint','not as','can\'t seem to','always struggle'],
    inference: "Based on everything you have shared, I think you carry a quiet belief that you are not enough. You have never said it directly. But it shows up in how you talk about almost everything.",
  },
  {
    id: 'not_deserving',
    belief: "you do not deserve good things",
    signals: ['don\'t deserve','shouldn\'t have','too good for me','why me','luck','guilty','feel bad about','can\'t enjoy','wait for it to','something wrong'],
    inference: "Something I keep noticing — there is a pattern of pulling back from good things, or waiting for them to fall apart. I think part of you believes you do not quite deserve them.",
  },
  {
    id: 'must_control',
    belief: "things must be controlled or they fall apart",
    signals: ['what if','plan','make sure','just in case','can\'t afford','need to know','worried about','prepare','anticipate','what happens if'],
    inference: "I notice you spend a lot of energy anticipating what could go wrong. It is like some part of you believes that if you are not in control, everything falls apart.",
  },
  {
    id: 'burden',
    belief: "you are a burden to others",
    signals: ['don\'t want to bother','hate asking','should figure out','on my own','don\'t want to trouble','independent','not their problem','my problem','deal with it myself'],
    inference: "You rarely ask for things. You frame your needs as problems to solve alone. I think part of you believes you are a burden — and you have organised your life around not being one.",
  },
  {
    id: 'love_conditional',
    belief: "love and approval are conditional on performance",
    signals: ['if i do well','proud of me','disappointed','let down','expectations','achieve','succeed','fail them','measure up','prove','earn'],
    inference: "The way you talk about relationships — love and approval always seem connected to doing well or achieving something. I wonder if deep down you believe love has conditions attached to it.",
  },
  {
    id: 'unsafe_world',
    belief: "the world is fundamentally unsafe",
    signals: ['trust','careful','watch out','never know','people take advantage','end up','things fall','goes wrong','prepared','protect','guard'],
    inference: "There is a vigilance in how you move through the world — always watching, always prepared. I think part of you believes the world is more dangerous than most people realise.",
  },
]

export const inferBeliefs = (allHistory, profile) => {
  const allText = allHistory.filter(m => m.role === 'user').map(m => (m.content || '').toLowerCase()).join(' ')
  const detected = []

  for (const bp of BELIEF_PATTERNS) {
    const hits = bp.signals.filter(s => allText.includes(s)).length
    if (hits >= 2) {
      detected.push({ ...bp, strength: hits >= 4 ? 'strong' : 'possible', hitCount: hits })
    }
  }

  return detected.sort((a,b) => b.hitCount - a.hitCount).slice(0, 3)
}

// ── TIMELINE REASONING ────────────────────────────────────────────────────────
export const buildTimeline = (sessions, memory) => {
  const events   = []
  const now      = Date.now()
  const findings = []

  sessions.forEach((session, i) => {
    const daysAgo = Math.floor((now - new Date(session.date)) / 86400000)
    events.push({ daysAgo, summary: session.summary, index: i, date: session.date })
  })

  if (events.length >= 3) {
    const recent  = events.slice(-3)
    const earlier = events.slice(0, -3)
    earlier.forEach(e => {
      const earlyWords  = tokenize(e.summary)
      const stillPresent = recent.some(r => {
        const recentWords = tokenize(r.summary)
        return earlyWords.some(w => w.length > 4 && recentWords.includes(w))
      })
      if (!stillPresent && earlyWords.length > 2) {
        findings.push({
          type: 'unresolved',
          daysAgo: e.daysAgo,
          summary: e.summary,
          text: `${e.daysAgo} days ago you were talking about something — ${e.summary.slice(0,60)}. You have not mentioned it since. What happened there?`,
        })
      }
    })
  }

  if (events.length >= 4) {
    const moodWords = {
      positive: ['lighter','better','good','happy','excited','hopeful'],
      negative: ['heavy','hard','struggling','difficult','sad','afraid','angry'],
    }
    const score = (half) => half.map(e => {
      const t   = (e.summary || '').toLowerCase()
      const pos = moodWords.positive.filter(w => t.includes(w)).length
      const neg = moodWords.negative.filter(w => t.includes(w)).length
      return pos - neg
    }).reduce((a,b) => a+b, 0)
    const half = Math.floor(events.length / 2)
    const earlyMood  = score(events.slice(0, half))
    const recentMood = score(events.slice(half))
    if (recentMood > earlyMood + 1)  findings.push({ type:'growth',  text:'Looking back across our conversations — something has shifted. The quality of what you share feels different now. Lighter. Something has changed in you.' })
    else if (recentMood < earlyMood - 1) findings.push({ type:'decline', text:'I want to name something. Looking at the arc of our conversations — there has been a heaviness building. Something has been accumulating. What is it?' })
  }

  return { events, findings }
}

// ── ADAPTIVE LANGUAGE ─────────────────────────────────────────────────────────
export const buildLanguageProfile = (allHistory) => {
  const userMsgs = allHistory.filter(m => m.role === 'user')
  if (userMsgs.length < 3) return { favoriteWords:[], avgLength:'short', rhythm:'sparse' }

  const allTokens  = userMsgs.flatMap(m => tokenize(m.content || ''))
  const wordFreq   = {}
  allTokens.forEach(t => { if(t.length > 4) wordFreq[t] = (wordFreq[t]||0)+1 })

  const favoriteWords = Object.entries(wordFreq)
    .filter(([,count]) => count >= 2)
    .sort((a,b) => b[1]-a[1])
    .slice(0,8)
    .map(([word]) => word)

  const avgMsgLength = userMsgs.reduce((acc,m) => acc + (m.content||'').split(' ').length, 0) / userMsgs.length
  const avgLength    = avgMsgLength > 40 ? 'long' : avgMsgLength > 15 ? 'medium' : 'short'
  const hasQuestions = userMsgs.filter(m => (m.content||'').includes('?')).length > userMsgs.length * 0.3
  const rhythm       = hasQuestions ? 'questioning' : avgLength === 'short' ? 'sparse' : 'flowing'

  return { favoriteWords, avgLength, rhythm }
}

// ── ENGAGEMENT DETECTION ──────────────────────────────────────────────────────
export const detectEngagement = (history) => {
  const recentUser = history.filter(m => m.role==='user').slice(-5)
  if (recentUser.length < 3) return { level:'unknown', signal:'normal' }

  const avgLen = recentUser.reduce((a,m) => a + (m.content||'').split(' ').length, 0) / recentUser.length
  const hasQ   = recentUser.filter(m => (m.content||'').includes('?')).length > 0
  const vShort = recentUser.filter(m => (m.content||'').split(' ').length < 5).length

  if (vShort >= 3)          return { level:'disengaged',    signal:'give_space' }
  if (avgLen > 40 && hasQ)  return { level:'highly_engaged', signal:'go_deeper'  }
  if (avgLen > 20)          return { level:'engaged',        signal:'normal'     }
  return { level:'low', signal:'open_up' }
}

// ── CIRCADIAN RHYTHM ──────────────────────────────────────────────────────────
export const getCircadianState = () => {
  const h = new Date().getHours()
  if (h >= 5  && h < 9)  return { period:'dawn',       energy:'awakening',   tone:'gentle and curious' }
  if (h >= 9  && h < 12) return { period:'morning',    energy:'expansive',   tone:'warm and direct' }
  if (h >= 12 && h < 14) return { period:'midday',     energy:'grounded',    tone:'practical and clear' }
  if (h >= 14 && h < 17) return { period:'afternoon',  energy:'reflective',  tone:'thoughtful and open' }
  if (h >= 17 && h < 20) return { period:'evening',    energy:'integrating', tone:'warm and unhurried' }
  if (h >= 20 && h < 23) return { period:'night',      energy:'deep',        tone:'quiet and intimate' }
  return                         { period:'late night', energy:'raw',         tone:'honest and still' }
}

export const circadianGreeting = (circadian, profile, daysSince) => {
  const name   = safeStr(profile?.name)
  const prefix = name ? name + '. ' : ''
  const greets = {
    dawn:        [`${prefix}You are up early. What is already on your mind?`, `${prefix}Early morning thoughts are some of the most honest. I am here.`],
    morning:     [`${prefix}Good morning. What does today feel like before it has really started?`, `Morning. How did you sleep?`],
    midday:      [`${prefix}Middle of the day. How is it going — really?`, `Afternoon. What has been the most real thing so far today?`],
    afternoon:   [`${prefix}Good afternoon. What are you carrying from the morning?`, `Afternoon. What has been on your mind?`],
    evening:     [`${prefix}Good evening. What are you bringing home from today?`, `Evening. What stayed with you?`],
    night:       [`${prefix}You are up late. What is keeping you awake?`, `Late nights have a quality — more honest somehow. What is on your mind?`],
    'late night':[`${prefix}It is late. What is real for you right now?`, `The middle of the night has its own clarity. What is it?`],
  }
  const pool = greets[circadian.period] || greets.morning
  return pool[Math.floor(Math.random() * pool.length)]
}

// ── EMOTIONAL STATE PERSISTENCE ────────────────────────────────────────────────
export const getEchoEmotionalState = (memory) => {
  const recentSessions = (memory.sessions || []).slice(-3)
  if (!recentSessions.length) return { state:'open', note:null, openingTone:null }

  const heavyWords = ['struggling','hard','afraid','angry','sad','difficult','lost','broken','hurt']
  const lightWords = ['better','good','happy','excited','grateful','hopeful','proud','relieved']
  const lastSummary = (recentSessions[recentSessions.length-1]?.summary || '').toLowerCase()
  const isHeavy = heavyWords.some(w => lastSummary.includes(w))
  const isLight = lightWords.some(w => lastSummary.includes(w))

  if (isHeavy) return { state:'careful', note:'Last time was heavy.', openingTone:'You have been on my mind since last time. How are you holding up?' }
  if (isLight) return { state:'warm',    note:'Things seemed better.',  openingTone:'Something felt lighter last time we spoke. Is that still true?' }
  return { state:'open', note:null, openingTone:null }
}

// ── PROACTIVE MEMORY SURFACING ─────────────────────────────────────────────────
export const getProactiveMemory = (memory, currentParsed) => {
  const sessions = memory.sessions || []
  if (sessions.length < 2) return null

  const now     = Date.now()
  const profile = memory.profile || {}

  for (const session of sessions) {
    const daysAgo = Math.floor((now - new Date(session.date)) / 86400000)
    if ([7,14,21,30].some(d => Math.abs(daysAgo-d) <= 1)) {
      return `It has been about ${daysAgo} days since you told me — ${(session.summary||'').slice(0,55)}. I have been thinking about that. What has happened since?`
    }
  }

  const currentTokens = new Set(currentParsed?.tokens || [])
  for (const session of sessions.slice(0,-1).reverse()) {
    const sessionTokens = tokenize(session.summary || '')
    const overlap = sessionTokens.filter(t => t.length > 4 && currentTokens.has(t))
    if (overlap.length >= 2) {
      const daysAgo = Math.floor((now - new Date(session.date)) / 86400000)
      return `This is making me think of something from ${daysAgo} days ago — ${(session.summary||'').slice(0,55)}. These two things feel connected. Do you see it?`
    }
  }

  const goal0 = safeStr(profile.goals?.[0])
  if (goal0 && Math.random() > 0.7) {
    const lastGoalSession = sessions.slice().reverse().find(s =>
      tokenize(s.summary || '').some(t => goal0.includes(t))
    )
    if (lastGoalSession) {
      const daysAgo = Math.floor((now - new Date(lastGoalSession.date)) / 86400000)
      if (daysAgo > 3) return `${daysAgo} days ago you were talking about ${goal0}. I have not heard you mention it since. What happened with that?`
    }
  }

  return null
}

// ── INTEREST DETECTION ────────────────────────────────────────────────────────
// Detects topics the user lights up about — for Echo to reference autonomously

const INTEREST_SIGNALS = {
  music:       ['music','song','album','playlist','artist','band','concert','guitar','piano','listen','track','lyrics'],
  sport:       ['football','soccer','basketball','cricket','tennis','rugby','sport','match','game','team','score','player','training','gym'],
  food:        ['food','cook','restaurant','eat','recipe','cuisine','meal','chef','bake','dish','taste','flavour'],
  travel:      ['travel','trip','city','country','flight','hotel','explore','visited','abroad','holiday','adventure'],
  books:       ['book','read','novel','author','chapter','story','fiction','nonfiction','library','literature'],
  film:        ['film','movie','series','watch','episode','director','cinema','documentary','show'],
  technology:  ['tech','code','software','app','startup','ai','computer','programming','digital','internet','device'],
  nature:      ['nature','outdoors','hiking','park','forest','ocean','mountains','animals','environment','garden'],
  faith:       ['faith','god','prayer','church','mosque','temple','spiritual','religion','belief','universe'],
  art:         ['art','paint','draw','design','photography','creative','gallery','exhibition','sketch','colour'],
  business:    ['business','work','career','startup','company','money','invest','finance','market','strategy'],
  family:      ['family','parents','mother','father','sister','brother','children','kids','home','relatives'],
}

export const detectInterests = (allHistory, existingInterests = []) => {
  const allText = allHistory
    .filter(m => m.role === 'user')
    .map(m => (m.content || '').toLowerCase())
    .join(' ')

  const detected = []
  for (const [interest, signals] of Object.entries(INTEREST_SIGNALS)) {
    const hits = signals.filter(s => allText.includes(s)).length
    if (hits >= 2) detected.push(interest)
  }

  // Merge with existing, deduplicate
  return [...new Set([...existingInterests, ...detected])].slice(0, 8)
}

// ── COMMUNICATION STYLE DETECTION ─────────────────────────────────────────────
export const detectCommunicationStyle = (history) => {
  const userMsgs = history.filter(m => m.role === 'user')
  if (userMsgs.length < 5) return null

  const avgLen = userMsgs.reduce((a, m) => a + (m.content || '').split(' ').length, 0) / userMsgs.length
  const questionRate = userMsgs.filter(m => (m.content || '').includes('?')).length / userMsgs.length
  const hasDepthWords = userMsgs.some(m => {
    const t = (m.content || '').toLowerCase()
    return ['actually','honestly','truth','really','deep','part of me','never told'].some(w => t.includes(w))
  })

  if (avgLen > 50 && hasDepthWords)     return 'deep_reflective'
  if (avgLen > 30 && questionRate > 0.4) return 'curious_explorer'
  if (avgLen < 12)                       return 'brief_direct'
  if (questionRate > 0.5)                return 'question_led'
  return 'conversational'
}

// ── PROFILE UPDATE WITH INTERESTS ─────────────────────────────────────────────
export const enrichProfileFromHistory = (history, profile) => {
  const updatedInterests = detectInterests(history, profile.interests || [])
  const commStyle = detectCommunicationStyle(history)
  const lastMood  = history.filter(m => m.role === 'user').slice(-1)[0]?.mood || null

  return {
    ...profile,
    interests:          updatedInterests,
    communicationStyle: commStyle || profile.communicationStyle,
    lastKnownMood:      lastMood  || profile.lastKnownMood,
  }
}
