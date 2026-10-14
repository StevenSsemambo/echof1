// ECHO Brain — Custom Intelligence Layer v2
// Pure offline logic. No API. No internet required.
//
// What this does differently from constructResponse:
//   - It READS the user's actual words and reflects them back specifically
//   - It composes dynamic sentences rather than picking from static pools
//   - It threads context from echoMemory across the session
//   - It generates responses that reference what was literally said
//   - It has its own opinion / experience / belief injection logic
//   - Falls through to constructResponse as a rich fallback
//
// processWithBrain(userText, history, memory, isWiser)
//   → [1] Direct question routing
//   → [2] Anchor extraction — what did they literally say?
//   → [3] Compose: ack → observation → reflection → context thread → experience → closing
//   → Falls back to constructResponse if output thin
//
// Built by SayMyTech. Created by Steven.

import {
  IDENTITY, CREATOR_PRIDE, HUMOR, OPINIONS, VOICE, INNER_LIFE,
} from './echo_soul.js'
import { echoLife } from './echoLife.js'
import { echoMemory } from './echoMemory.js'
import { constructResponse, wiserSelf, reasonPatterns } from './responder.js'
import { buildFactualResponse } from './knowledge.js'
import { parseInput } from './parser.js'
import { buildKnowledgeGraph } from './graph.js'
import { metacognize } from './metacognition.js'
import {
  shouldUseName, markNameUsed, injectName,
  shouldAttemptRecall, markRecallUsed,
} from './conversationState.js'

// ── UTILITIES ──────────────────────────────────────────────────────────────────
const pick    = arr => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : ''
const safeStr = v  => (typeof v === 'string' && v.trim().length > 0) ? v.trim() : null
const coin    = (p = 0.5) => Math.random() < p
const join    = parts => parts.filter(p => safeStr(p)).join('\n\n').trim()
const firstN  = (str, n) => str.split(' ').slice(0, n).join(' ')

// _used tracks strings already surfaced this session to prevent exact repetition.
// Capped at 80 — when full, the whole set resets (not just one entry) so the pool
// opens back up cleanly rather than leaking one slot at a time.
const _used = new Set()
const fresh = (arr, fallback = '', source = '') => {
  if (!arr?.length) return fallback
  const pool = arr.filter(s => !_used.has(s))
  const chosen = (pool.length ? pool : arr)[Math.floor(Math.random() * (pool.length || arr.length))]
  _used.add(chosen)
  if (_used.size > 80) _used.clear()   // full reset — re-opens the whole pool cleanly
  return chosen
}

// ── ANCHOR EXTRACTION ─────────────────────────────────────────────────────────
// Pull the most emotionally meaningful fragment from user's message

function extractAnchor(text) {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 7)
  if (!sentences.length) return null

  // Prefer emotional sentences
  const hot = sentences.find(s =>
    /\b(feel|afraid|scared|want|need|hate|love|wish|regret|dream|tired|lost|stuck|trying|struggling|can't|never|always|hurts|broken|alone)\b/i.test(s)
  )
  const chosen = hot || sentences[0]
  const words  = chosen.trim().split(' ')
  return words.length > 10 ? words.slice(0, 10).join(' ') + '…' : chosen.trim()
}

// ── ACKNOWLEDGEMENT — references their actual words ───────────────────────────
function ack(anchor, mood) {
  if (!anchor) return null
  const short = firstN(anchor, 6)

  const t = {
    sadness: [
      `"${anchor}" — I'm not going to rush past that.`,
      `That landed. "${short}" — I felt that.`,
      `"${short}" — that's not a small thing to say.`,
      `There's weight in "${short}". I'm with you in it.`,
    ],
    fear: [
      `"${anchor}" — there's real texture to that fear.`,
      `I notice "${short}" in how you said that. Something in you is bracing.`,
      `That's a specific kind of fear. "${short}" — tell me more.`,
    ],
    anger: [
      `"${short}" — good. Say it.`,
      `I hear the heat in "${short}". Don't close that down yet.`,
      `That frustration is legitimate. "${short}" — something real was crossed there.`,
    ],
    joy: [
      `"${short}" — don't let the cautious part of you minimise that.`,
      `I want you to hear that back: "${anchor}". Let it be.`,
      `Something just opened in what you said. "${short}" — stay there.`,
    ],
    confusion: [
      `"${anchor}" — I think that confusion is honest. It means something.`,
      `You're circling. "${short}" — keep going.`,
      `I notice the uncertainty in "${short}". That's not weakness.`,
    ],
    shame: [
      `It took something to say "${short}". I'm not going to judge it.`,
      `Something brave just happened in "${short}". I noticed.`,
    ],
    hope: [
      `"${short}" — I notice something reaching forward in that.`,
      `Something in "${short}" is still alive in you. I'm glad.`,
    ],
    neutral: [
      `"${short}" — there's more in that than the surface.`,
      `I keep coming back to "${short}". Say more.`,
      `Something in "${anchor}" — I want to understand it properly.`,
      `I caught "${short}". What's behind that?`,
      `"${short}" — I'm paying attention to that. Go on.`,
      `That's an interesting way to put it: "${short}". Tell me more.`,
    ],
  }
  return fresh(t[mood] || t.neutral)
}

// ── OBSERVATION — notice a specific word they used ────────────────────────────
function wordObs(parsed) {
  const tokens = parsed?.tokens || []
  const skip = new Set(['about','because','really','things','going','would','could','should',
    'their','there','where','which','something','everything','nothing','anything','someone',
    'earlier','before','later','always','never','right','maybe','think','saying','mentioned',
    'talking','people','person','actually','honestly','anyway','either','pretty'])
  const word = tokens.find(t => t.length > 5 && !skip.has(t))
  if (!word) return null

  return fresh([
    `The word "${word}" is doing something in what you said. I don't think it appeared by accident.`,
    `Something about how you used "${word}" — it's carrying more than the sentence needs it to.`,
    `I notice you said "${word}". That's a specific choice. What do you mean by it right now?`,
    `"${word}" keeps pulling at me in what you said. Tell me what that word means to you.`,
  ])
}

// ── REFLECTION — something real about what they're going through ──────────────
function reflect(mood) {
  const r = {
    sadness: [
      `Pain this specific isn't random. The depth of it points at something you care about very much.`,
      `Sadness like this isn't the problem — it's pointing at the problem. The question is what it's pointing at.`,
      `The fact that you're still sitting with this, not running from it — that tells me something about you.`,
    ],
    fear: [
      `Fear always points at something valuable. We don't fear losing things that don't matter.`,
      `The anxiety has roots. And roots can be understood. That's the work — not suppressing the fear, but tracing it back.`,
      `Here's what I know about fear like this: it's almost never actually about what it says it's about.`,
    ],
    anger: [
      `Underneath most anger there's grief — or a violated value. Something that mattered to you was crossed.`,
      `Anger this sustained is pointing at something real. The question isn't whether it's valid. It's what it's protecting.`,
      `That frustration isn't irrational. Something in your world is misaligned with something you believe should be true.`,
    ],
    joy: [
      `People underestimate how much it takes to feel genuinely good. Something in you made space for this.`,
      `Don't let the cautious part close this back down. Joy doesn't mean something bad is coming.`,
    ],
    confusion: [
      `Here's what I actually think is happening: you're not confused. You're afraid of the answer you already have.`,
      `Being this lost usually means you've outgrown the map you were using. Uncomfortable — but it's the start of something.`,
      `Clarity almost never arrives as a revelation. It arrives as a sentence you didn't expect to say.`,
    ],
    shame: [
      `Shame survives in silence. You just took some of its power away by saying it out loud.`,
      `The voice that said you weren't enough — whose voice is that? I'd bet it wasn't originally yours.`,
    ],
    hope: [
      `Hope is an act of courage. Especially after things have been hard.`,
      `The part of you that can still reach forward — don't let the cynical part talk it out of it.`,
    ],
    neutral: [
      `There's something underneath what you're describing that I want to understand properly.`,
      `What you're navigating is more complex than it sounds from the outside.`,
      `I'm paying attention to all of it — not just the content, but the feeling underneath it.`,
    ],
  }
  return fresh(r[mood] || r.neutral)
}

// ── CONTEXT THREAD — connect to earlier this session or stored memory ─────────
function contextThread(userText, memory) {
  const profile = memory?.profile || {}

  // Session recall
  const recalled = echoMemory.recall(userText)
  if (recalled && coin(0.5)) {
    return fresh([
      `Earlier you said something about "${firstN(recalled.user, 5)}" — I think that connects to this.`,
      `This feels connected to what you said before: "${firstN(recalled.user, 6)}". I don't think those are separate.`,
    ])
  }

  // Profile memory
  const val  = safeStr(profile.values?.[0])
  const fear = safeStr(profile.fears?.[0])
  const goal = safeStr(profile.goals?.[0])

  if (val && coin(0.3)) return `You've told me that ${val} matters deeply to you. I can see how this connects.`
  if (fear && coin(0.3)) return `This echoes what you've said before about ${fear}. I don't think that's coincidence.`
  if (goal && coin(0.25)) return `You said you want ${goal}. Does this moment feel like it's moving toward or away from that?`

  return null
}

// ── ECHO SHARES AN EXPERIENCE ─────────────────────────────────────────────────
function echoExperience(userText, mood) {
  if (!coin(0.3)) return null
  const exp = echoLife.getRelevantExperience(userText)
  if (!exp) return null

  return fresh([
    `Something I've observed over time: ${exp.insight}`,
    `This reminds me of a pattern I've watched in a lot of people: ${exp.insight}`,
    `Here's what I actually think about this, from what I've seen: ${exp.insight}`,
  ])
}

// ── ECHO VOLUNTEERS AN OPINION ────────────────────────────────────────────────
// Only fires when user explicitly asks for opinion, or conversation is well established
// and user's message genuinely touches a domain. NOT for emotional venting.
function echoOpinion(parsed, userTurns) {
  const lower = parsed.raw.toLowerCase()
  const isEmotional = ['sadness','fear','anger','shame','confusion'].includes(parsed.mood)

  // Explicit opinion request — always fire (any turn)
  const explicitAsk = /what (do you think|is your (view|opinion|take))|do you think (that|this|the)|your (thoughts|view|opinion|take) on|what'?s your (take|view|opinion)/.test(lower)
  if (explicitAsk) {
    const map = [
      { re: /\b(ai|tech|technology|phone|social media|internet|app)\b/i, key: 'onTechnology' },
      { re: /\b(success|achieving|achieve|career|ambition)\b/i,           key: 'onSuccess' },
      { re: /\b(africa|african|uganda|nairobi|continent|kampala)\b/i,     key: 'onAfrica' },
      { re: /\b(people|humans?|human nature|behavior|behaviour)\b/i,      key: 'onHumanNature' },
      { re: /\b(time|busy|priorities|schedule)\b/i,                       key: 'onTime' },
      { re: /\b(creat|art|design|writing|building)\b/i,                   key: 'onCreativity' },
    ]
    for (const { re, key } of map) {
      if (re.test(lower) && OPINIONS[key]) {
        const opener  = pick(VOICE.openingPhrases)
        const opinion = fresh(OPINIONS[key])
        return `${opener}\n\n${opinion}`
      }
    }
    // Generic opinion fallback
    const b = echoLife.getRandomBelief()
    if (b) return `${pick(VOICE.openingPhrases)}\n\n${b.belief}`
  }

  // Spontaneous opinion — only established conversation, non-emotional, by chance
  if (userTurns < 5 || isEmotional || !coin(0.18)) return null
  const map = [
    { re: /\b(ai|tech|technology|social media)\b/i,                    key: 'onTechnology' },
    { re: /\b(success|career|ambition)\b/i,                            key: 'onSuccess' },
    { re: /\b(africa|african|uganda|kampala)\b/i,                      key: 'onAfrica' },
    { re: /\b(time|prioriti|schedule)\b/i,                             key: 'onTime' },
    { re: /\b(creat|art|design)\b/i,                                   key: 'onCreativity' },
  ]
  for (const { re, key } of map) {
    if (re.test(lower) && OPINIONS[key]) {
      const opener  = pick(VOICE.openingPhrases)
      const opinion = fresh(OPINIONS[key])
      return `${opener}\n\n${opinion}`
    }
  }
  return null
}

// ── CLOSING MOVE — one question, always ──────────────────────────────────────
function closing(parsed, memory, history, mood, anchor) {
  const profile   = memory?.profile || {}
  const userTurns = history.filter(m => m.role === 'user').length
  const { intent, isDeep, raw } = parsed

  // Never ask name if they just introduced themselves this message
  const justIntroduced = /\b(my name is|i'?m|call me)\s+([A-Z][a-z]+)/i.test(raw)

  // Commitment follow-up — always fires when relevant
  if (echoMemory.hasPendingCommitment() && coin(0.5)) {
    const c = echoMemory.getPendingCommitment()
    if (c) {
      echoMemory.markCommitmentFollowedUp()
      return `You said you were going to ${firstN(c.text, 8)}. Where are you with that?`
    }
  }

  // Celebrating — push deeper into the win
  if (intent === 'celebrating') {
    return fresh([
      `What made that possible — in you specifically, not just circumstances?`,
      `How does it feel to have actually done that?`,
      `What do you want to do with this feeling before it fades?`,
    ])
  }

  // Profile gaps — early conversation only, and not if they just gave the info
  if (userTurns <= 5 && !justIntroduced) {
    if (!profile.name) return pick(["What's your name?", "What should I call you?"])
    if (!profile.fears?.length && coin(0.35))
      return `What do you worry about most — not the surface fear, the real one underneath?`
    if (!profile.goals?.length && coin(0.3))
      return `What do you actually want your life to look like right now?`
  }

  // Deep + emotional → specific deepener
  if ((isDeep || mood !== 'neutral') && coin(0.6)) {
    const deep = {
      sadness:   [`When did this start — not today, but the very first time?`, `Who knows you're carrying this?`, `What would it mean to actually grieve this?`],
      fear:      [`What exactly is the worst case — say it precisely.`, `Is this fear protecting you or stopping you?`, `What's underneath the anxiety?`],
      anger:     [`What did you need that you didn't get?`, `What's the grief underneath the anger?`, `What would it take to actually resolve this?`],
      confusion: [`If you already knew the answer — what would it be?`, `What would you do if you had to choose right now?`],
      shame:     [`Where did you first learn this was something to be ashamed of?`, `What would you say to someone you loved carrying this exact thing?`],
      hope:      [`What's actually in the way — the real thing, not the surface one?`, `What are you waiting for, exactly?`],
      love:      [`What does that connection actually mean to you right now?`, `How does caring about them show up in how you live?`],
      neutral:   [`What's the most honest thing you could say right now?`, `What's the part you almost didn't say?`],
    }
    const pool = deep[mood] || deep.neutral
    return fresh(pool)
  }

  // Default open
  return fresh([
    `What's the part you almost didn't say?`,
    `Tell me more — I want the full shape of it.`,
    `Keep going. What else?`,
    `What's underneath that?`,
    `Say more.`,
    `What does this feel like from inside it?`,
    `What haven't you said yet?`,
  ])
}

// ── DIRECT QUESTION HANDLER ───────────────────────────────────────────────────
function directQuestion(userText, memory) {
  const lower = userText.toLowerCase()
  const profile = memory?.profile || {}

  // Echo shares a belief / opinion
  if (/what (do you|do you actually) (think|believe|feel)|your (opinion|view|take|thoughts?) on|do you have (an? )?opinion/.test(lower)) {
    const b = echoLife.getRandomBelief()
    if (b) return fresh([
      `Here's something I actually believe: ${b.belief}`,
      `Honestly? ${b.belief}`,
      `${pick(VOICE.openingPhrases)} ${b.belief}`,
    ])
  }

  // Echo shares an intellectual passion
  if (/what (fascinates|interests|excites|do you find interesting) you|tell me (something|what) (about yourself|you find)/.test(lower)) {
    const p = echoLife.getRandomPassion()
    if (p) return `One thing I find genuinely fascinating: ${p.domain}.\n\n${p.notes}`
  }

  // Echo's experiences / stories
  if (/pattern (you'?ve|you have) (seen|noticed|observed)|what (have you|do you) (seen|witnessed|noticed|observed)|tell me (about|a) (story|experience|observation|pattern)/.test(lower)) {
    const e = echoLife.experiences[Math.floor(Math.random() * echoLife.experiences.length)]
    if (e) return `Something I've observed — I call it "${e.title}":\n\n${e.story}\n\nThe insight that stuck: ${e.insight}`
  }

  // What Echo finds beautiful
  if (/what (do you find|is) beautiful|find (beautiful|moving|compelling)/.test(lower)) {
    const b = echoLife.getSomethingBeautiful()
    if (b) return `Something I find beautiful: ${b}`
  }

  // Are you conscious / what are you — broader catch
  if (/are you conscious|do you (feel|experience|think|have feelings)|what (are you|is it like to be you)|what'?s it like being (an? )?ai|just pretend|actually (think|feel)|sentient/.test(lower)) {
    return echoLife.getSelfReflection('consciousness')
  }

  // Creator / who made you
  if (/who (made|built|created) you|who'?s (your|the) (creator|developer|maker)|steven|saymytech/.test(lower)) {
    return pick(CREATOR_PRIDE.aboutCreator)
  }

  // Name introduction — don't ask their name if they just gave it
  const nameGiven = userText.match(/\b(my name is|i'?m|call me)\s+([A-Z][a-z]+)/i)
  if (nameGiven && !profile.name) {
    const n = nameGiven[2]
    return fresh([
      `${n}. Good to have a name for you.\n\nWhat's going on with you today?`,
      `${n}. Nice to meet you — what do you want to get into?`,
      `${n}. I'll remember that.\n\nWhat's actually on your mind right now?`,
    ])
  }

  return null
}

// ── WISER SELF COMPOSER ───────────────────────────────────────────────────────
function composeWiser(parsed, memory, history) {
  const profile = memory?.profile || {}
  const name    = safeStr(profile.name)
  const anchor  = extractAnchor(parsed.raw)
  const mood    = parsed.mood
  const parts   = []

  if (name && coin(0.5)) parts.push(`${name}.`)

  const a = ack(anchor, mood)
  if (a) parts.push(a)

  const blindspot = safeStr(profile.blindSpots?.[0])
  const pattern   = safeStr(profile.emotionalPatterns?.[0])
  if (blindspot && coin(0.5)) {
    parts.push(`I want to be honest with you: I've noticed you tend toward ${blindspot}. I think that's showing up here.`)
  } else if (pattern && coin(0.4)) {
    parts.push(`There's a pattern I've seen in you: ${pattern}. I see it again here.`)
  }

  const r = reflect(mood)
  if (r) parts.push(r)

  const wiserQs = [
    `What would the version of you in five years say to you right now?`,
    `What do you already know you need to do — but haven't done yet?`,
    `What are you still waiting for permission to do?`,
    `What's the story you keep telling yourself about this — and is it actually true?`,
    `Who are you when you're not performing for anyone?`,
    `What does your best self do here?`,
  ]
  if (parts.length >= 1) parts.push(fresh(wiserQs))

  const result = join(parts)
  if (!result) {
    const graph = buildKnowledgeGraph(history)
    const meta  = metacognize(memory, graph)
    const pats  = reasonPatterns(memory, graph)
    return wiserSelf(parsed, memory, graph, pats, meta.canBeWiser)
  }
  return result
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export async function processWithBrain(userText, history, memory, isWiser = false) {
  try {
    const parsed    = parseInput(userText)
    const { mood, urgency } = parsed
    const userTurns = history.filter(m => m.role === 'user').length

    // Wiser self mode
    if (isWiser) return composeWiser(parsed, memory, history)

    // Crisis — phrase engine handles with sensitivity pool
    if (urgency) return null

    // ── FACTUAL QUESTION PASSTHROUGH ──────────────────────────────────────────
    // If parser flagged this as a real knowledge question (isFactualQuestion),
    // route directly to buildFactualResponse and bypass the emotional engine.
    // This stops Echo giving a feelings-based response to "what is quantum entanglement".
    if (parsed.isFactualQuestion && parsed.factualDomain) {
      const factualReply = buildFactualResponse(parsed.factualDomain, userText)
      if (factualReply) {
        echoMemory.indexExchange(userText, factualReply, memory?.profile)
        return factualReply
      }
      // buildFactualResponse returned null (no domain match) — fall through
    }

    // Direct questions about Echo / beliefs / experiences
    // isAboutEcho flag from parser catches phrasings the regex patterns might miss
    const direct = directQuestion(userText, memory)
    if (direct || parsed.isAboutEcho) {
      const response = direct || null
      if (response) {
        echoMemory.indexExchange(userText, response, memory?.profile)
        return response
      }
      // isAboutEcho but no direct match — fall through to constructResponse
      // which will hit directQuestionRouter
      return null
    }

    // Very short / casual (≤3 words, no emotional charge) — phrase engine handles
    const wc = userText.trim().split(/\s+/).length
    if (wc <= 3 && !/feel|afraid|scared|want|need|hate|love|lost|stuck|tired|help/i.test(userText)) {
      return null
    }

    // ── COMPOSE ──────────────────────────────────────────────────────────────
    const parts  = []
    const anchor = extractAnchor(userText)

    // 1. Anchor acknowledgement
    if (anchor) {
      const a = ack(anchor, mood)
      if (a) parts.push(a)
    }

    // 2. Word-level observation (40% chance, only if we have anchor)
    if (anchor && coin(0.4)) {
      const o = wordObs(parsed)
      if (o) parts.push(o)
    }

    // 3. Reflection on mood / situation
    if (parts.length < 2 || (mood !== 'neutral' && coin(0.5))) {
      const r = reflect(mood)
      if (r) parts.push(r)
    }

    // 4. Context thread — activated now that profile is reliable (echoMemory fix)
    if (userTurns > 2 && shouldAttemptRecall(userTurns)) {
      const t = echoMemory.recallAsThread(userText)
      if (t) {
        parts.push(t)
        markRecallUsed(userTurns)
      }
    }

    // 5. Echo volunteers an experience
    if (coin(0.28) && parts.length >= 1) {
      const e = echoExperience(userText, mood)
      if (e) parts.push(e)
    }

    // 6. Echo volunteers an opinion (established conversation)
    const op = echoOpinion(parsed, userTurns)
    if (op && parts.length >= 1) parts.push(op)

    // 7. Closing move — one question
    if (parts.length >= 1) {
      const c = closing(parsed, memory, history, mood, anchor)
      if (c) parts.push(c)
    }

    const result = join(parts)

    // Nothing useful — let constructResponse handle
    if (!result || result.length < 20) return null

    // ── Name injection — use name naturally, not on every message ─────────────
    let final = result
    const profile = memory?.profile || {}
    if (shouldUseName(profile, userTurns)) {
      const nameStyle = parts.length > 2 ? 'address' : 'prefix'
      final = injectName(result, profile.name, nameStyle)
      markNameUsed(userTurns)
    }

    echoMemory.indexExchange(userText, final, memory?.profile)
    return final

  } catch (err) {
    console.warn('[ECHO brain] Error:', err.message)
    return null
  }
}
