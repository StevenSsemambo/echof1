// ECHO Metacognition — Module 5
// Knows what it knows. Extracts profile. Gets smarter as it learns more.

import { tokenize } from './parser.js'

const STOPWORDS_SET = new Set(['i','me','my','the','a','an','is','it','he','she','they','we','you','and','or','but'])

// Words that are trigger words themselves — not the actual concept we want to store
const FEAR_TRIGGERS  = new Set(['afraid','fear','scared','terrified','worried','anxiety','anxious','dread','lose','losing'])
const GOAL_TRIGGERS  = new Set(['want','goal','hope','dream','trying','plan','someday','working','toward','achieve','become'])
const JUNK_TOKENS    = new Set(['those','these','that','this','have','been','just','very','really','still','even','also',
                                 'when','what','where','which','while','then','than','from','with','about','into','over',
                                 'more','some','such','other','much','many','most','will','well','like','know','think',
                                 'feel','felt','been','said','does','make','made','take','took','come','came','after',
                                 "i've","i'm","i'd","i'll","don't","can't","won't","wouldn't","couldn't","shouldn't"])

export const metacognize = (memory, graph) => {
  const p = memory.profile
  const gaps = []
  const strengths = []

  if (!p.name) gaps.push('your name')
  if (!p.values?.length) gaps.push('your values')
  if (!p.fears?.length) gaps.push('your fears')
  if (!p.goals?.length) gaps.push('your goals')
  if (!p.decisionStyle) gaps.push('how you make decisions')
  if (!p.coreBeliefs?.length) gaps.push('your core beliefs')

  if (p.values?.length >= 2) strengths.push('values')
  if (p.fears?.length >= 2) strengths.push('fears')
  if (p.goals?.length >= 2) strengths.push('goals')
  if (p.emotionalPatterns?.length >= 2) strengths.push('emotional patterns')
  if (graph.topConcepts?.length >= 10) strengths.push('recurring themes')
  if (p.decisionStyle) strengths.push('decision style')

  const knowledgeScore = Math.min(100, Math.round((strengths.length / 6) * 100))
  const canBeWiser = knowledgeScore >= 33
  const confidence = knowledgeScore < 20 ? 'low' : knowledgeScore < 60 ? 'medium' : 'high'

  return { gaps, strengths, knowledgeScore, canBeWiser, confidence }
}

// Extract meaningful concept words after a trigger phrase
// e.g. "I'm afraid of failing" -> finds "failing", not "afraid"
const extractConceptAfterTrigger = (raw, triggerPhrases, skipSet, existing) => {
  const lower = raw.toLowerCase()
  let clauseStart = -1

  for (const phrase of triggerPhrases) {
    const idx = lower.indexOf(phrase)
    if (idx !== -1) {
      // Move past the trigger phrase and any prepositions (of, about, that, to)
      let pos = idx + phrase.length
      const remainder = lower.slice(pos).trimStart()
      const prepMatch = remainder.match(/^(of|about|that|to|for)\s+/)
      if (prepMatch) pos += remainder.indexOf(prepMatch[0]) + prepMatch[0].length
      clauseStart = pos
      break
    }
  }

  if (clauseStart === -1) return null

  const clause = raw.slice(clauseStart)
  const tokens = tokenize(clause)
    .filter(t =>
      t.length > 3 &&
      !STOPWORDS_SET.has(t.toLowerCase()) &&
      !JUNK_TOKENS.has(t.toLowerCase()) &&
      !skipSet.has(t.toLowerCase()) &&
      !(existing || []).includes(t)
    )

  return tokens[0] || null
}

// Extract all value-keywords from a clause like "honesty and integrity"
const extractValueKeywords = (raw, triggerPhrases, existing) => {
  const lower = raw.toLowerCase()
  let clauseStart = -1

  for (const phrase of triggerPhrases) {
    const idx = lower.indexOf(phrase)
    if (idx !== -1) {
      clauseStart = idx + phrase.length
      break
    }
  }

  if (clauseStart === -1) return []

  const clause = raw.slice(clauseStart)
  return tokenize(clause)
    .filter(t =>
      t.length > 3 &&
      !STOPWORDS_SET.has(t.toLowerCase()) &&
      !JUNK_TOKENS.has(t.toLowerCase()) &&
      !(existing || []).includes(t)
    )
    .slice(0, 3) // capture up to 3 values per statement
}

export const extractProfileUpdate = (parsed, currentProfile) => {
  const updated = { ...currentProfile }
  const lower = parsed.raw.toLowerCase()

  // -- Bug 1 Fix: Name extraction -- lock after first successful capture --------
  // Only extract from deliberate introductions. Never overwrite once set.
  // Removed the greedy /i'm (\w+)/ pattern -- it corrupted name with emotion words.
  if (!updated.name) {
    const namePatterns = [
      /my name is ([A-Za-z]{2,})/i,
      /call me ([A-Za-z]{2,})/i,
      /just call me ([A-Za-z]{2,})/i,
    ]
    for (const pattern of namePatterns) {
      const match = parsed.raw.match(pattern)
      if (match && match[1].length > 1 && !STOPWORDS_SET.has(match[1].toLowerCase())) {
        updated.name = match[1]
        break
      }
    }
  }
  // If name already set -- never touch it again from this function

  // -- Bug 3 Fix: Values -- extract ALL nouns after the trigger, not just first token --
  const valueTriggers = ['i value','i believe in','important to me','i care about','matters to me','i stand for','i care deeply about']
  if (valueTriggers.some(p => lower.includes(p))) {
    const newValues = extractValueKeywords(parsed.raw, valueTriggers, updated.values)
    if (newValues.length > 0) {
      updated.values = [...new Set([...(updated.values || []), ...newValues])].slice(-10)
    }
  }

  // -- Bug 2 Fix: Fears -- skip trigger words, grab actual subject --------------
  const fearTriggerPhrases = ["i'm afraid","i am afraid","i fear","scared of","terrified of","worried about","anxiety about","i dread","i can't lose"]
  if (fearTriggerPhrases.some(p => lower.includes(p))) {
    const concept = extractConceptAfterTrigger(parsed.raw, fearTriggerPhrases, FEAR_TRIGGERS, updated.fears)
    if (concept) updated.fears = [...(updated.fears || []), concept].slice(-10)
  }

  // -- Bug 2 Fix: Goals -- skip trigger words, grab actual subject --------------
  const goalTriggerPhrases = ["i want to","my goal is","i hope to","i dream of","i'm trying to","i plan to","someday i","i'm working toward"]
  if (goalTriggerPhrases.some(p => lower.includes(p))) {
    const concept = extractConceptAfterTrigger(parsed.raw, goalTriggerPhrases, GOAL_TRIGGERS, updated.goals)
    if (concept) updated.goals = [...(updated.goals || []), concept].slice(-10)
  }

  // Decision style
  if (!updated.decisionStyle) {
    if (lower.includes('i think') || lower.includes('logically') || lower.includes('rationally'))
      updated.decisionStyle = 'analytical — you tend to think before feeling'
    else if (lower.includes('i feel') || lower.includes('gut') || lower.includes('intuition'))
      updated.decisionStyle = 'intuitive — you trust your gut more than logic'
    else if (lower.includes('what others') || lower.includes('people think') || lower.includes('told me'))
      updated.decisionStyle = "relational — others' opinions shape your choices"
  }

  // Emotional patterns
  if (parsed.mood !== 'neutral') {
    const existing = updated.emotionalPatterns || []
    if (!existing.includes(parsed.mood))
      updated.emotionalPatterns = [...existing, parsed.mood].slice(-8)
  }

  // Recurring themes
  if (parsed.concepts.length > 0)
    updated.recurringThemes = [...new Set([...(updated.recurringThemes||[]), ...parsed.concepts.slice(0,2)])].slice(-12)

  return updated
}
