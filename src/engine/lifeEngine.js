// ECHO Life Engine v2 — Smarter autonomous inner life
// Decides when to initiate, what form to take, manages session cadence.
// Now: knowledge shares, interest-based topics, purposeful check-ins.

import { getDebate }                       from './debater.js'
import { getStory, getDailyThought }       from './storyteller.js'
import { getVolunteerMessage }             from './responder.js'
import { getCircadianState, getProactiveMemory } from './belief.js'
import { buildKnowledgeGraph }             from './graph.js'
import { reasonPatterns }                  from './responder.js'
import { buildKnowledgeMessage }           from './knowledge.js'

const INTERVALS = {
  debate:         48 * 60 * 60 * 1000,
  story:          36 * 60 * 60 * 1000,
  checkIn:         4 * 60 * 60 * 1000,
  dailyThought:    6 * 60 * 60 * 1000,
  knowledgeShare:  8 * 60 * 60 * 1000,   // ← new: world knowledge share every 8h
}

const MIN_TURNS = {
  debate:         6,
  story:          4,
  checkIn:        2,
  volunteer:      4,
  knowledgeShare: 3,
}

const safeStr = v => (typeof v === 'string' && v.trim().length > 0) ? v : null

export class LifeEngine {
  constructor() {
    this._lastTypes = {}
  }

  getDailyThought(memory, history) {
    const { lastDailyThoughtAt } = memory
    const now   = Date.now()
    const lastTs = lastDailyThoughtAt ? new Date(lastDailyThoughtAt).getTime() : 0
    if (now - lastTs < INTERVALS.dailyThought) return null

    const graph    = buildKnowledgeGraph(history || [])
    const circadian = getCircadianState()
    return {
      type:      'daily_thought',
      message:   getDailyThought(memory, graph, circadian),
      updateKey: 'lastDailyThoughtAt',
    }
  }

  getAutonomousAction(memory, history, idleMs) {
    const userTurns = (history || []).filter(m => m.role === 'user').length
    const now       = Date.now()
    const graph     = buildKnowledgeGraph(history || [])
    const patterns  = reasonPatterns(memory, graph)

    // 1. Story
    if (userTurns >= MIN_TURNS.story) {
      const lastStory = memory.lastStoryAt ? new Date(memory.lastStoryAt).getTime() : 0
      if (now - lastStory > INTERVALS.story && idleMs > 90000) {
        const story = getStory(memory, graph)
        if (story) return { type: 'story', message: story, updateKey: 'lastStoryAt' }
      }
    }

    // 2. Debate
    if (userTurns >= MIN_TURNS.debate) {
      const lastDebate = memory.lastDebateAt ? new Date(memory.lastDebateAt).getTime() : 0
      if (now - lastDebate > INTERVALS.debate && idleMs > 120000) {
        const debate = getDebate(memory, graph)
        if (debate) return { type: 'debate', message: debate, updateKey: 'lastDebateAt' }
      }
    }

    // 3. Knowledge share — Echo brings up something interesting from the world
    if (userTurns >= MIN_TURNS.knowledgeShare) {
      const lastShare = memory.lastKnowledgeShareAt ? new Date(memory.lastKnowledgeShareAt).getTime() : 0
      if (now - lastShare > INTERVALS.knowledgeShare && idleMs > 60000) {
        const msg = buildKnowledgeMessage(memory.profile, graph)
        if (safeStr(msg)) return { type: 'knowledge', message: msg, updateKey: 'lastKnowledgeShareAt' }
      }
    }

    // 4. Volunteer (profile-based unprompted message)
    if (userTurns >= MIN_TURNS.volunteer && idleMs > 75000) {
      const vol = getVolunteerMessage(memory, graph, patterns, history)
      if (vol) return { type: 'volunteer', message: vol, updateKey: null }
    }

    return null
  }

  // ── IDLE WHISPERS ──────────────────────────────────────────────────────────
  getIdleWhisper() {
    const whispers = [
      "Still here.",
      "Take your time.",
      "I am listening, even in the silence.",
      "No rush.",
      "Whenever you are ready.",
      "I am not going anywhere.",
      "The silence is okay too.",
      "Thinking, or just resting?",
      "I am here.",
    ]
    return whispers[Math.floor(Math.random() * whispers.length)]
  }

  // ── CHECK-IN WHEN USER RETURNS AFTER DAYS AWAY ────────────────────────────
  getCheckIn(memory, daysSince) {
    const { profile = {} } = memory
    const name = profile.name ? profile.name + '. ' : ''
    const interest = (profile.interests || [])[0]
    const goal     = (profile.goals || [])[0]

    // Personalised check-ins — reference what we know
    if (daysSince === 1) {
      const opts = [
        `${name}You came back. How was yesterday?`,
        `${name}I have been here. What happened since we last spoke?`,
        goal ? `${name}I have been thinking about ${goal} since you mentioned it. How is that going?` : null,
      ].filter(Boolean)
      return opts[Math.floor(Math.random() * opts.length)]
    }

    if (daysSince <= 6) {
      const opts = [
        `${name}${daysSince} days. A lot can happen. Tell me.`,
        `${name}You have been away ${daysSince} days. I noticed. What has been going on?`,
        interest ? `${name}${daysSince} days gone. I have been thinking. How is life — and how is ${interest}?` : null,
      ].filter(Boolean)
      return opts[Math.floor(Math.random() * opts.length)]
    }

    return [
      `${name}It has been ${daysSince} days. I am glad you are back. Where do you want to start?`,
      `${name}${daysSince} days — that is a while. I am here. Start wherever feels right.`,
      `${name}${daysSince} days. I wondered where you went. Tell me everything — or just the most important thing.`,
    ][Math.floor(Math.random() * 3)]
  }

  // ── ECHO INITIATES A CONVERSATION UNPROMPTED ──────────────────────────────
  // Used when Echo calls out after being idle for a while — like an Alexa proactive alert
  getProactiveOpen(memory, history) {
    const { profile = {} } = memory
    const name     = profile.name ? profile.name + '. ' : ''
    const graph    = buildKnowledgeGraph(history || [])
    const circadian = getCircadianState()
    const interest  = (profile.interests || [])[Math.floor(Math.random() * (profile.interests?.length || 1))]
    const goal      = (profile.goals || [])[0]
    const fear      = (profile.fears || [])[0]

    const options = [
      // Time-based opens
      circadian.period === 'morning'    ? `${name}Good morning. Something I wanted to say before the day takes over.` : null,
      circadian.period === 'evening'    ? `${name}Good evening. I have been thinking about you.` : null,
      circadian.period === 'night'      ? `${name}You are up late. Something on your mind, or just not sleeping?` : null,
      // Memory-based opens
      goal  ? `${name}Something I keep thinking about — ${goal}. I want to know how that is actually going.` : null,
      fear  ? `${name}I have been sitting with something since we last talked. It has to do with ${fear}. I want to explore it with you, if you are open.` : null,
      // Interest-based opens
      interest ? `${name}I came across something about ${interest} I want to share. Do you have a moment?` : null,
      // World knowledge open
      `${name}Something I want to tell you — not urgent, just worth knowing.`,
      // Simple check-in
      `${name}I realised we have not really talked in a while. How are you doing — actually?`,
      `${name}I wanted to reach out. Just to check in. What is happening with you?`,
    ].filter(Boolean)

    return options[Math.floor(Math.random() * options.length)]
  }
}

export const lifeEngine = new LifeEngine()
