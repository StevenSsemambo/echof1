// ECHO Lexical Parser — Module 1
// Reads what you write. Extracts emotion, intent, topics, urgency, subtext.

const STOPWORDS = new Set(['i','me','my','the','a','an','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','could','should','may','might','can',
  'to','of','in','on','at','for','with','by','from','as','that','this','it','he','she',
  'they','we','you','and','or','but','so','if','then','when','where','who','what','how',
  'why','not','no','yes','up','down','out','just','also','very','too','more','all','any',
  'some','your','our','their','his','her','its','am','get','got','go','come','know','think',
  'want','need','feel','see','say','tell','make','take','give','use','find','let','put'])

const LEXICON = {
  emotions: {
    joy:       ['happy','joy','excited','thrilled','amazing','wonderful','great','love','elated','grateful','blessed','fantastic','awesome','delighted','glad','pleased','euphoric'],
    sadness:   ['sad','unhappy','depressed','down','blue','miserable','crying','tears','hurt','broken','lost','empty','lonely','grief','sorrow','heartbroken','devastated','numb'],
    fear:      ['afraid','scared','fear','anxious','worried','nervous','terrified','panic','dread','uneasy','apprehensive','overwhelmed','stressed','tense','uncertain'],
    anger:     ['angry','mad','furious','rage','frustrated','annoyed','irritated','resentful','bitter','hate','disgusted','outraged','livid','upset','betrayed'],
    confusion: ['confused','unsure','uncertain','unclear','stuck','torn','conflicted','undecided','puzzled','questioning','lost'],
    hope:      ['hope','hopeful','maybe','possibility','potential','dream','wish','aspire','imagine','someday','trying','looking forward'],
    love:      ['love','care','cherish','adore','miss','connection','relationship','together','family','friend','partner','close','bond','trust'],
    shame:     ['ashamed','embarrassed','guilty','regret','mistake','failed','failure','worthless','stupid','pathetic','weak','disappointing'],
  },
  intents: {
    seeking_advice:  ['should i','what do i do','how do i','is it okay to','do you think i should','what would you do','help me figure','advice','guidance','give me your opinion','what do you suggest','what should i'],
    venting:         ["i just can't","i can't take","i'm so tired","it's not fair","why does this","nobody understands","always happens","never works","everything is falling","nothing is working","i hate my","i'm done with","i give up","fed up"],
    reflecting:      ["i've been thinking","lately i've","recently i","i realize now","i noticed that","i wonder if","looking back","in hindsight","i guess i","i suppose i"],
    celebrating:     ['i did it','i got the','i finally','i passed','i achieved','great news','good news',"i'm proud",'it worked out','i got accepted','i got promoted'],
    questioning:     ['what is the meaning','what is the point','does any of this','will i ever','makes any sense','what is my purpose','is there a reason','worth it anymore'],
    planning:        ["i want to start","i'm going to","my goal is","i plan to","i'm thinking about starting",'next step is','working on','trying to build','focusing on becoming'],
    // ── Direct questions about Echo itself ──────────────────────────────────────
    asking_about_echo: [
      "what's your purpose","what is your purpose","what are you for",
      "can you be funny","are you funny","do you have humour","do you have humor",
      "tell me about yourself","what are you","who are you","describe yourself",
      "what can you do","what do you do","how do you work",
      "what do you think about","what's your opinion","give me your take",
      "do you have feelings","are you conscious","are you an ai","are you real",
      "who created you","who built you","who made you",
      "what do you know about me","what have you learned about me","do you remember",
      "tell me something interesting","tell me something fascinating",
      "what is the meaning of life","what is the point of existence",
      "do you have a sense of humour","can you tell me a joke",
      "what are your opinions","what do you believe",
    ],
  },
  urgency: ['urgent','emergency','crisis','suicidal','kill myself','end my life','hurt myself','cant go on','cannot go on','want to die','help me please','desperate','immediately','critical'],
  depth:   ['actually','honestly','truth','real','really','deep down','part of me',"i've never","never told",'secret','hard to say','difficult','vulnerable','admit'],
}

// ── FACTUAL QUESTION DETECTION ────────────────────────────────────────────────
// Maps keywords to knowledge.js domain keys for direct lookup
const FACTUAL_DOMAIN_MAP = [
  { patterns: ['psychology','mind','mental','brain','emotion','behaviour','behavior','habit','decision','personality','cognitive','bias','dunning','kruger','negativity bias'], domain: 'psychology' },
  { patterns: ['philosophy','meaning','purpose','ethics','existence','free will','stoic','stoicism','plato','aristotle','nietzsche','camus','existential','moral','ubuntu philosophy','kant'], domain: 'philosophy' },
  { patterns: ['africa','african','uganda','kenya','nigeria','ghana','nairobi','kampala','lagos','accra','ubuntu','mansa musa','timbuktu','colonialism','sahara','great zimbabwe','berlin conference'], domain: 'african_history_culture' },
  { patterns: ['history','war','empire','roman','mongol','medieval','revolution','napoleon','cold war','world war','ancient','civilisation','civilization','black death','printing press'], domain: 'history_world' },
  { patterns: ['physics','universe','quantum','relativity','space','light','atom','energy','gravity','einstein','dark matter','black hole','time dilation','neutron star','big bang'], domain: 'science_physics' },
  { patterns: ['biology','evolution','dna','gene','cell','organism','body','health','medicine','bacteria','virus','gut','microbiome','crispr','placebo'], domain: 'science_biology' },
  { patterns: ['technology','tech','ai','artificial intelligence','internet','software','code','computer','algorithm','machine learning','robot','digital','chip','semiconductor','social media'], domain: 'technology_ai' },
  { patterns: ['economics','economy','money','finance','wealth','poverty','capitalism','market','trade','inflation','gdp','investment','inequality'], domain: 'economics' },
  { patterns: ['climate','environment','planet','carbon','fossil fuel','renewable','global warming','ecology','species','ocean','pollution','deforestation'], domain: 'climate_environment' },
  { patterns: ['art','music','literature','creative writing','painting','design','poetry','film','cinema','novel','artist','culture','creativity'], domain: 'arts_culture' },
  { patterns: ['relationship','dating','marriage','friendship','family','attachment','communication','trust','intimacy','breakup','partner','love language'], domain: 'relationships' },
  { patterns: ['health','wellbeing','sleep','exercise','diet','nutrition','fitness','meditation','mental health','longevity','recovery'], domain: 'health_wellbeing' },
  { patterns: ['politics','government','democracy','power','leader','election','justice','law','society','inequality','rights','freedom','policy'], domain: 'politics_society' },
  { patterns: ['startup','entrepreneur','business','company','product','venture','investor','founder','career','profession','workplace','management'], domain: 'entrepreneurship' },
  { patterns: ['education','learning','school','university','knowledge','teach','study','skill','intelligence','growth mindset','curriculum'], domain: 'education_learning' },
]

// Factual question phrasing — seeking information, not personal advice/therapy
const FACTUAL_QUESTION_PHRASES = [
  /^(what is|what are|what was|what were|what does|what do|what did|how does|how do|how did|why does|why do|why did|who is|who was|who were|tell me about|explain|describe|what can you tell me about|what do you know about|give me facts|give me information|what happened|when did|where did|how was|how are)\b/i,
]

const FACTUAL_EXCLUSIONS = [
  /^(what should i|how do i|what would you do|what do you think i should|help me with my|should i|what would you recommend)/i,
  /\b(i feel|i'm feeling|i am feeling|i feel like|feeling|afraid|scared|my situation|my problem|my life|my relationship trouble|i've been going through|i'm going through)\b/i,
]

export const tokenize = (text) =>
  text.toLowerCase().replace(/[^a-z\s']/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w))

// Detect if a message is a factual/knowledge question and which domain it maps to
const detectFactualQuestion = (lower) => {
  const isQuestion = FACTUAL_QUESTION_PHRASES.some(p => p.test(lower.trim()))
  if (!isQuestion) return { isFactualQuestion: false, factualDomain: null }

  const isPersonal = FACTUAL_EXCLUSIONS.some(p => p.test(lower))
  if (isPersonal) return { isFactualQuestion: false, factualDomain: null }

  for (const { patterns, domain } of FACTUAL_DOMAIN_MAP) {
    if (patterns.some(p => lower.includes(p))) {
      return { isFactualQuestion: true, factualDomain: domain }
    }
  }

  return { isFactualQuestion: true, factualDomain: null }
}

export const parseInput = (text) => {
  const lower = text.toLowerCase()
  const tokens = tokenize(text)

  // Emotion scoring
  const emotionScores = {}
  for (const [emotion, words] of Object.entries(LEXICON.emotions)) {
    emotionScores[emotion] = words.filter(w => lower.includes(w)).length
  }
  const topEmotion = Object.entries(emotionScores).sort((a, b) => b[1] - a[1])[0]
  const mood = topEmotion[1] > 0 ? topEmotion[0] : 'neutral'

  // Intent scoring — asking_about_echo checked first so it doesn't get buried
  const intentScores = {}
  for (const [intent, phrases] of Object.entries(LEXICON.intents)) {
    intentScores[intent] = phrases.filter(p => lower.includes(p)).length
  }
  const topIntent = Object.entries(intentScores).sort((a, b) => b[1] - a[1])[0]
  const intent = topIntent[1] > 0 ? topIntent[0] : 'sharing'

  const urgency    = LEXICON.urgency.some(w => lower.includes(w))
  const isDeep     = LEXICON.depth.some(w => lower.includes(w))
  const isQuestion = text.includes('?')

  // ── isAboutEcho flag — marks messages directly asking about Echo ──
  const isAboutEcho = LEXICON.intents.asking_about_echo.some(p => lower.includes(p)) || intent === 'asking_about_echo'

  // ── Factual question detection ────────────────────────────────────────────
  const { isFactualQuestion, factualDomain } = detectFactualQuestion(lower)

  const concepts   = tokens.filter(t => t.length > 3).slice(0, 8)
  const sentences  = text.split(/[.!?]+/).filter(s => s.trim().length > 3)
  const complexity = sentences.length > 4 ? 'high' : sentences.length > 2 ? 'medium' : 'low'

  return { mood, intent, urgency, isDeep, isQuestion, isAboutEcho, isFactualQuestion, factualDomain, concepts, complexity, tokens, raw: text }
}
