// ECHO Voice Engine v3 — Human-feeling synthesis + recognition
// Pre-processes text for natural rhythm, pauses, pitch variation

let synth          = window.speechSynthesis || null
let voices         = []
let selectedVoice  = null
let onSpeakStart   = null
let onSpeakEnd     = null
let currentUtt     = null
let audioCtx       = null
let ambientGain    = null
let recognition    = null

// ── AUDIO CONTEXT ─────────────────────────────────────────────────────────────
export function resumeAudio() {
  if (audioCtx?.state === 'suspended') audioCtx.resume().catch(() => {})
}

// ── AMBIENT SOUND ─────────────────────────────────────────────────────────────
export function initAmbient() {
  try {
    if (audioCtx) return
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)()
    ambientGain = audioCtx.createGain()
    ambientGain.gain.setValueAtTime(0.016, audioCtx.currentTime)
    ambientGain.connect(audioCtx.destination)
    ;[60, 120, 180].forEach(freq => {
      const osc = audioCtx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
      osc.connect(ambientGain)
      osc.start()
    })
  } catch (_) {}
}

// ── VOICE INIT ────────────────────────────────────────────────────────────────
export async function initVoice() {
  if (!synth) return
  return new Promise(resolve => {
    const load = () => {
      voices = synth.getVoices()
      const preferred = [
        v => v.name.toLowerCase().includes('samantha'),
        v => v.name.toLowerCase().includes('karen'),
        v => v.name.toLowerCase().includes('moira'),
        v => v.name.toLowerCase().includes('daniel'),
        v => v.name.toLowerCase().includes('oliver'),
        v => v.name.toLowerCase().includes('serena'),
        v => v.name.toLowerCase().includes('tom'),
        v => v.lang === 'en-GB' && v.localService,
        v => v.lang.startsWith('en') && v.localService,
        v => v.lang.startsWith('en'),
      ]
      for (const test of preferred) {
        const found = voices.find(test)
        if (found) { selectedVoice = found; break }
      }
      resolve()
    }
    if (synth.getVoices().length) load()
    else synth.onvoiceschanged = load
  })
}

export function setVoiceCallbacks(onStart, onEnd) {
  onSpeakStart = onStart
  onSpeakEnd   = onEnd
}

// ── HUMAN TEXT PRE-PROCESSOR ──────────────────────────────────────────────────
// Transforms raw text into chunks with breathing pauses and natural rhythm

function preprocessForSpeech(text, opts = {}) {
  const { rate = 0.76, pitch = 1.0, emotion = 'neutral' } = opts

  // Clean text: remove markdown artifacts, strip undefined
  let clean = text
    .replace(/undefined/gi, '')
    .replace(/\[object Object\]/gi, '')
    .replace(/\*\*/g, '').replace(/\*/g, '')
    .replace(/_{2,}/g, '').replace(/#+ /g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  // Split into natural speech chunks at sentence boundaries
  // Each chunk gets its own utterance = natural pauses between them
  const rawChunks = clean
    .split(/(?<=[.!?…])\s+|(?<=\n\n)/)
    .map(c => c.trim())
    .filter(c => c.length > 1)

  // Merge very short chunks
  const chunks = []
  let buf = ''
  for (const c of rawChunks) {
    buf = buf ? buf + ' ' + c : c
    if (buf.split(' ').length >= 6 || /[.!?…]$/.test(buf)) {
      chunks.push(buf.trim())
      buf = ''
    }
  }
  if (buf) chunks.push(buf.trim())

  return chunks.map((chunk, i) => {
    // Determine rate for this chunk
    let chunkRate = rate
    let chunkPitch = pitch

    // Questions: slightly higher pitch at end
    const isQuestion = chunk.endsWith('?')
    if (isQuestion) chunkPitch = pitch + 0.08

    // Emotional content: slower
    const heavyWords = ['grief','loss','devastated','broken','afraid','terrified','shame','ashamed','alone']
    if (heavyWords.some(w => chunk.toLowerCase().includes(w))) chunkRate = Math.max(0.62, rate - 0.08)

    // Short punchy statements: slightly faster
    if (chunk.split(' ').length < 6 && !isQuestion) chunkRate = Math.min(0.88, rate + 0.06)

    // First chunk of a response: slightly slower (settling in)
    if (i === 0) chunkRate = Math.max(0.65, chunkRate - 0.04)

    // Pause before chunk (ms) — simulates breathing
    const pauseBefore = i === 0 ? 0
      : chunk.startsWith('But') || chunk.startsWith('And') || chunk.startsWith('So') ? 180
      : chunk.startsWith('Because') || chunk.startsWith('The') ? 220
      : 280  // standard inter-sentence breath

    return { text: chunk, rate: chunkRate, pitch: chunkPitch, pauseBefore }
  })
}

// Add natural hesitations before deep/philosophical content
function addHesitation(text) {
  const deepMarkers = [
    "Here's what I think",
    "Something I believe",
    "I want to be honest",
    "Let me say something",
    "Here's the truth",
    "What I actually think",
  ]
  const isDeep = deepMarkers.some(m => text.includes(m))
  if (isDeep && Math.random() > 0.5) return '...' // spoken as pause
  return ''
}

// ── SPEAK ─────────────────────────────────────────────────────────────────────
export async function speak(text, opts = {}) {
  if (!synth || !text) return
  stopSpeaking()

  const chunks = preprocessForSpeech(text, opts)
  if (!chunks.length) return

  onSpeakStart?.()

  // Speak chunks sequentially with natural pauses between
  for (let i = 0; i < chunks.length; i++) {
    const { text: chunkText, rate, pitch, pauseBefore } = chunks[i]
    if (!chunkText.trim()) continue

    // Pause before this chunk (breath between sentences)
    if (pauseBefore > 0) {
      await new Promise(r => setTimeout(r, pauseBefore))
    }

    await new Promise((resolve) => {
      const utt        = new SpeechSynthesisUtterance(chunkText)
      utt.voice        = selectedVoice
      utt.rate         = Math.max(0.55, Math.min(1.1, rate))
      utt.pitch        = Math.max(0.8, Math.min(1.3, pitch))
      utt.volume       = 1.0
      utt.onend        = () => resolve()
      utt.onerror      = () => resolve()
      currentUtt       = utt
      synth.speak(utt)
    })

    // Tiny gap between chunks (natural breath)
    if (i < chunks.length - 1) {
      await new Promise(r => setTimeout(r, 60))
    }
  }

  onSpeakEnd?.()
  currentUtt = null
}

export function stopSpeaking() {
  if (synth) { synth.cancel(); currentUtt = null }
}

export function isSpeaking() { return synth?.speaking || false }

// ── SPEECH RECOGNITION ────────────────────────────────────────────────────────
export function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return false
  recognition = new SR()
  recognition.continuous     = false
  recognition.interimResults = true
  recognition.lang           = 'en-US'
  return true
}

export function startListening({ onInterim, onFinal, onEnd, onError }) {
  if (!recognition) return false
  recognition.onresult = (e) => {
    let interim = '', final = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript
      e.results[i].isFinal ? (final += t) : (interim += t)
    }
    if (interim) onInterim?.(interim)
    if (final)   onFinal?.(final)
  }
  recognition.onerror = (e) => { if (e.error !== 'no-speech') onError?.(e.error) }
  recognition.onend   = () => onEnd?.()
  try { recognition.start(); return true }
  catch { return false }
}

export function stopListening() {
  try { recognition?.stop() } catch {}
}
