// Builds the per-request "what Echo knows" context from ECHO's own memory systems.
// The persona itself lives server-side (netlify/functions/chat.js).

import { echoMemory } from './echoMemory.js'

const list = (arr, n = 5) => (Array.isArray(arr) ? arr.filter(Boolean).slice(0, n) : [])
const line = (label, v) => {
  const items = Array.isArray(v) ? v : (v ? [v] : [])
  return items.length ? `${label}: ${items.join('; ')}` : null
}

export function buildContext({ memory, mood, history = [], wiserKnownWell = true, mode = 'chat' }) {
  const p = memory?.profile || {}
  const out = []

  out.push(line('Name', p.name))
  out.push(line('Values', list(p.values)))
  out.push(line('Fears', list(p.fears)))
  out.push(line('Goals', list(p.goals)))
  out.push(line('Interests', list(p.interests)))
  out.push(line('Emotional patterns', list(p.emotionalPatterns, 3)))
  out.push(line('Recurring themes', list(p.recurringThemes, 3)))
  out.push(line('Core beliefs', list(p.coreBeliefs, 3)))
  out.push(line('Blind spots', list(p.blindSpots, 3)))
  out.push(line('Growth areas', list(p.growthAreas, 3)))
  out.push(line('Decision style', p.decisionStyle))
  out.push(line('Communication style', p.communicationStyle))

  if (mood && mood !== 'neutral') out.push(`Their mood right now (read from their words): ${mood}`)
  if (p.lastKnownMood && p.lastKnownMood !== mood) out.push(`Mood last time: ${p.lastKnownMood}`)

  const total = memory?.totalMessages || 0
  if (total === 0) out.push('This is the very first conversation — you are just meeting them.')
  else out.push(`You have exchanged roughly ${total} messages with them over time.`)

  // Session memory (episodic): topics, key moments, things they revealed, commitments
  try {
    const summary = echoMemory.getSummary(history)
    if (summary) out.push(typeof summary === 'string' ? summary : JSON.stringify(summary))
  } catch { /* memory summary is optional */ }

  if (mode === 'wiser' && !wiserKnownWell) {
    out.push('You do not know them deeply yet, so be honest about that and invite them to share more instead of pretending insight.')
  }

  return out.filter(Boolean).join('\n').slice(0, 2400)
}
