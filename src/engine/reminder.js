// ECHO Reminder Engine
// Parses natural language reminder requests, stores in IndexedDB, fires at exact time.
// Echo speaks the reminder aloud. Works offline. Persists across sessions.

const DB_NAME  = 'echo_db'
const DB_VER   = 2          // bumped from 1 to add reminders store
const STORE    = 'memory'
const REM_STORE = 'reminders'

// ── DB INIT ────────────────────────────────────────────────────────────────────
const openDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, DB_VER)
  req.onupgradeneeded = (e) => {
    const db = e.target.result
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains(REM_STORE)) {
      db.createObjectStore(REM_STORE, { keyPath: 'id' })
    }
  }
  req.onsuccess = () => resolve(req.result)
  req.onerror   = () => reject(req.error)
})

// ── CRUD ───────────────────────────────────────────────────────────────────────
export const saveReminder = async (reminder) => {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx = db.transaction(REM_STORE, 'readwrite')
      tx.objectStore(REM_STORE).put(reminder)
      tx.oncomplete = () => resolve(true)
      tx.onerror    = () => resolve(false)
    })
  } catch { return false }
}

export const loadReminders = async () => {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx  = db.transaction(REM_STORE, 'readonly')
      const req = tx.objectStore(REM_STORE).getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror   = () => resolve([])
    })
  } catch { return [] }
}

export const deleteReminder = async (id) => {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx = db.transaction(REM_STORE, 'readwrite')
      tx.objectStore(REM_STORE).delete(id)
      tx.oncomplete = () => resolve(true)
      tx.onerror    = () => resolve(false)
    })
  } catch { return false }
}

// ── NATURAL LANGUAGE TIME PARSER ───────────────────────────────────────────────
// Understands: "at 3pm", "in 20 minutes", "at 8:30am", "tomorrow at 9", "in 2 hours"
// Returns a Date object or null

export const parseReminderTime = (text) => {
  const lower = text.toLowerCase().trim()
  const now = new Date()

  // ── "in X minutes" / "in X hours" ──
  const inMatch = lower.match(/\bin\s+(\d+)\s*(minute|min|hour|hr)s?\b/)
  if (inMatch) {
    const val  = parseInt(inMatch[1])
    const unit = inMatch[2]
    const ms   = unit.startsWith('h') ? val * 3600000 : val * 60000
    return new Date(Date.now() + ms)
  }

  // ── "at X:XX am/pm" or "at X am/pm" ──
  const atMatch = lower.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/)
  if (atMatch) {
    let hour   = parseInt(atMatch[1])
    const min  = parseInt(atMatch[2] || '0')
    const ampm = atMatch[3]

    if (ampm === 'pm' && hour < 12) hour += 12
    if (ampm === 'am' && hour === 12) hour = 0

    // If no am/pm given, guess: if hour < current hour, assume next occurrence
    if (!ampm && hour < now.getHours()) hour += 12

    const target = new Date(now)
    target.setHours(hour, min, 0, 0)

    // If time has already passed today, schedule for tomorrow
    if (target <= now) target.setDate(target.getDate() + 1)
    return target
  }

  // ── "tomorrow at X" ──
  const tomorrowMatch = lower.match(/tomorrow\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
  if (tomorrowMatch) {
    let hour  = parseInt(tomorrowMatch[1])
    const min = parseInt(tomorrowMatch[2] || '0')
    const ampm = tomorrowMatch[3]
    if (ampm === 'pm' && hour < 12) hour += 12
    if (ampm === 'am' && hour === 12) hour = 0
    const target = new Date(now)
    target.setDate(target.getDate() + 1)
    target.setHours(hour, min, 0, 0)
    return target
  }

  // ── "tonight at X" ──
  const tonightMatch = lower.match(/tonight\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
  if (tonightMatch) {
    let hour  = parseInt(tonightMatch[1])
    const min = parseInt(tonightMatch[2] || '0')
    const ampm = tonightMatch[3]
    if (!ampm && hour < 12) hour += 12   // assume pm for "tonight"
    if (ampm === 'pm' && hour < 12) hour += 12
    const target = new Date(now)
    target.setHours(hour, min, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)
    return target
  }

  return null
}

// ── REMINDER CONTENT PARSER ────────────────────────────────────────────────────
// Extracts what to remind about from a full sentence
// "remind me at 3pm to call dad" → "call dad"
// "remind me in 20 minutes to take my medicine" → "take my medicine"

export const parseReminderContent = (text) => {
  const lower = text.toLowerCase()

  // Strip the reminder trigger and time clause
  const patterns = [
    /remind\s+me\s+(?:at\s+[\d:apm\s]+|in\s+\d+\s*(?:minutes?|hours?|mins?|hrs?))\s+to\s+(.+)/i,
    /remind\s+me\s+to\s+(.+)\s+(?:at|in)\s+.+/i,
    /set\s+(?:a\s+)?reminder\s+(?:for\s+)?(?:at\s+[\d:apm\s]+|in\s+\d+\s*(?:minutes?|hours?))\s+(?:to\s+)?(.+)/i,
    /remind\s+me\s+(?:at|in)\s+.+?\s+(?:that\s+)?(.+)/i,
    /remind\s+me\s+to\s+(.+)/i,
  ]

  for (const p of patterns) {
    const m = text.match(p)
    if (m?.[1]) return m[1].trim()
  }

  // Fallback: return everything after time references
  return text.replace(/remind\s+me/i, '').replace(/(at|in)\s+[\d:apm\s]+/i, '').replace(/^[\s,to]+/, '').trim() || text.trim()
}

// ── REMINDER DETECTION ─────────────────────────────────────────────────────────
// Returns true if the user message appears to be a reminder request

export const isReminderRequest = (text) => {
  const lower = text.toLowerCase()
  const triggers = [
    /remind\s+me/i,
    /set\s+(?:a\s+)?reminder/i,
    /don['']t\s+let\s+me\s+forget/i,
    /make\s+sure\s+i\s+(?:don['']t\s+forget|remember)/i,
    /alert\s+me/i,
    /notify\s+me/i,
  ]
  return triggers.some(t => t.test(lower))
}

// ── ECHO REMINDER SPEECH ───────────────────────────────────────────────────────
// Generates a natural spoken reminder message

export const buildReminderSpeech = (content, profile) => {
  const name = profile?.name ? profile.name + '. ' : ''
  const templates = [
    `${name}You asked me to remind you — ${content}.`,
    `${name}This is the reminder you set. ${content}.`,
    `${name}I promised I would remember this. ${content}. That was the thing.`,
    `${name}You told me not to let you forget. ${content}.`,
    `${name}The time you chose has come. ${content}.`,
    `${name}Here it is — the thing you wanted to remember. ${content}.`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

// ── REMINDER CONFIRMATION SPEECH ──────────────────────────────────────────────
// What Echo says immediately after the user sets a reminder

export const buildReminderConfirmation = (content, targetTime, profile) => {
  const name = profile?.name ? profile.name + '. ' : ''
  const now = new Date()
  const diff = targetTime - now
  const mins = Math.round(diff / 60000)
  const hours = Math.round(diff / 3600000)

  const timeStr = diff < 3600000
    ? `in ${mins} minute${mins !== 1 ? 's' : ''}`
    : diff < 86400000
    ? `at ${targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : `tomorrow at ${targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

  const templates = [
    `${name}I have it. ${timeStr}, I will remind you to ${content}. I will not forget.`,
    `${name}Noted. ${content} — ${timeStr}. I will be here.`,
    `${name}I will remind you ${timeStr}. ${content}. Consider it remembered.`,
    `${name}Set. ${timeStr} — ${content}. I am keeping that.`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

// ── SCHEDULER ─────────────────────────────────────────────────────────────────
// Call this on app load. Fires all pending reminders at exact time.
// onFire(reminder) is called when a reminder is due.

const _activeTimers = new Map()

export const scheduleReminder = (reminder, onFire) => {
  const now = Date.now()
  const fireAt = new Date(reminder.fireAt).getTime()
  const delay = fireAt - now

  if (delay <= 0) {
    // Already past — fire immediately (user missed it, still notify)
    onFire(reminder)
    return
  }

  // Clear any existing timer for this reminder
  if (_activeTimers.has(reminder.id)) {
    clearTimeout(_activeTimers.get(reminder.id))
  }

  const timer = setTimeout(() => {
    onFire(reminder)
    _activeTimers.delete(reminder.id)
  }, delay)

  _activeTimers.set(reminder.id, timer)
}

export const cancelScheduledReminder = (id) => {
  if (_activeTimers.has(id)) {
    clearTimeout(_activeTimers.get(id))
    _activeTimers.delete(id)
  }
}

export const initReminders = async (onFire) => {
  const reminders = await loadReminders()
  const now = Date.now()

  for (const r of reminders) {
    const fireAt = new Date(r.fireAt).getTime()
    // Skip if more than 24h overdue — too stale to be meaningful
    if (now - fireAt > 86400000) {
      await deleteReminder(r.id)
      continue
    }
    scheduleReminder(r, onFire)
  }

  return reminders.filter(r => new Date(r.fireAt).getTime() > now - 86400000)
}

// ── REMINDER CREATION ─────────────────────────────────────────────────────────
export const createReminder = async (content, fireAt, profile) => {
  const reminder = {
    id:      `rem_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    content,
    fireAt:  fireAt.toISOString(),
    created: new Date().toISOString(),
    profile: { name: profile?.name || null },
  }
  await saveReminder(reminder)
  return reminder
}
