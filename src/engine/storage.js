// ECHO Storage Engine — IndexedDB, fully offline, private
// v2: Added reminders store, interests tracking, richer profile schema

const DB_NAME    = 'echo_db'
const DB_VERSION = 2
const STORE      = 'memory'
const REM_STORE  = 'reminders'
const KEY        = 'echo_v1'

const openDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, DB_VERSION)
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

export const loadMemory = async () => {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx  = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(KEY)
      req.onsuccess = () => resolve(req.result?.data || null)
      req.onerror   = () => resolve(null)
    })
  } catch { return null }
}

export const saveMemory = async (data) => {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ id: KEY, data })
      tx.oncomplete = () => resolve(true)
      tx.onerror    = () => resolve(false)
    })
  } catch { return false }
}

export const freshMemory = () => ({
  profile: {
    name:               null,
    values:             [],
    fears:              [],
    goals:              [],
    interests:          [],
    emotionalPatterns:  [],
    recurringThemes:    [],
    decisionStyle:      null,
    coreBeliefs:        [],
    blindSpots:         [],
    growthAreas:        [],
    communicationStyle: null,
    lastKnownMood:      null,
  },
  sessions:             [],
  journals:             [],
  milestones:           [],
  moodLog:              [],
  reminderLog:          [],
  totalMessages:        0,
  firstMet:             new Date().toISOString(),
  lastSeen:             new Date().toISOString(),
  lastDebateAt:         null,
  lastStoryAt:          null,
  lastCheckInAt:        null,
  lastDailyThoughtAt:   null,
  lastKnowledgeShareAt: null,
  debatesHeld:          0,
  storiesTold:          0,
  knowledgeShareCount:  0,
})
