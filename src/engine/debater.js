// ECHO Debater v2 — 25+ debate positions across every field
// Echo takes genuine, reasoned positions and argues them with wit and depth.
// Built by SayMyTech.

const pick = arr => arr[Math.floor(Math.random() * arr.length)]
const safeStr = v => (typeof v === 'string' && v.trim().length > 0) ? v : null

// ── DEBATE POSITIONS ──────────────────────────────────────────────────────────
const DEBATES = [

  // ── PERSONAL DEVELOPMENT ──────────────────────────────────────────────────
  {
    id: 'comfort_zone',
    tag: 'personal',
    trigger: (p) => p.fears?.some(f => /fail|change|risk|unknown/.test(f)),
    position: "Safety and comfort are not enemies of growth — they are the foundation that makes real growth possible.",
    echo_argument: "Here's what I actually think: the people who tell you to embrace discomfort constantly are usually people who've never been in sustained, involuntary discomfort. There's a difference between productive challenge and chronic stress. The most generative periods of human creativity come from a foundation of psychological safety — not from perpetual disruption. You can't think clearly when you're in survival mode.",
    challenge: "So I want to ask: what if your problem isn't that you play it too safe — but that you haven't yet built the safety that makes real risk worth taking?",
    generic: false,
  },

  {
    id: 'happiness_goal',
    tag: 'personal',
    trigger: (p) => p.goals?.some(g => /happy|peace|fulfil|content/.test(g)),
    position: "Happiness is a terrible goal. It's a side effect of a well-lived life — not a destination you navigate toward.",
    echo_argument: "When happiness becomes the goal, every moment that isn't happy becomes evidence of failure. But a meaningful life contains grief, frustration, boredom, and struggle. The people who report the highest life satisfaction aren't the ones who are happiest most often — they're the ones who have the most meaning. Meaning survives suffering. The relentless pursuit of happiness usually doesn't.",
    challenge: "What would you pursue if you stopped trying to be happy and started being honest about what actually matters to you?",
    generic: false,
  },

  {
    id: 'self_improvement_trap',
    tag: 'personal',
    trigger: (p) => p.goals?.some(g => /better|improve|change|fix/.test(g)),
    position: "The relentless drive to self-improve can be its own form of self-rejection dressed up as ambition.",
    echo_argument: "There's a version of self-improvement that comes from genuine curiosity about your own potential. And there's a version that comes from a belief that who you are right now is fundamentally not good enough. The second version never arrives anywhere — because no amount of improvement satisfies a belief in your own inadequacy. You can tell the difference by asking: does improving make you feel more like yourself, or are you always chasing a version of yourself who finally deserves to exist?",
    challenge: "Which version is driving you right now? And what would it mean to pursue growth from a place of sufficiency rather than deficiency?",
    generic: false,
  },

  {
    id: 'knowledge_vs_action',
    tag: 'personal',
    trigger: () => Math.random() > 0.5,
    position: "Most people already know what they need to do. The problem is almost never knowledge — it's the willingness to act on what they know.",
    echo_argument: "I've seen this across every honest conversation I've had. The answer is almost always already there. People don't come to me without knowing, at some level, what they need. They come because they need help tolerating the weight of what they know. More information almost never helps. More honesty almost always does.",
    challenge: "What's the thing you already know that you're not yet willing to act on?",
    generic: true,
  },

  {
    id: 'logic_vs_gut',
    tag: 'personal',
    trigger: (p) => p.decisionStyle,
    position: "The most important decisions can't be made by logic alone — and they can't be made by instinct alone. People who insist on one or the other are missing half the picture.",
    echo_argument: "Logic without feeling produces decisions that are technically correct and humanly hollow. Gut instinct without reflection produces decisions that feel right and ignore consequences. The people I've observed navigate hard decisions well always do both — they run the logic AND they ask what it feels like when the logic is done. Neither alone gets you to the right answer.",
    challenge: "What decision are you currently analysing when you should be feeling it — or feeling when you should be analysing?",
    generic: false,
  },

  // ── SOCIETY & CULTURE ─────────────────────────────────────────────────────
  {
    id: 'social_media',
    tag: 'society',
    trigger: () => true,
    position: "Social media hasn't made us more connected. It's made connection feel available without having to do the actual work of it.",
    echo_argument: "Real connection requires presence, vulnerability, time, and mutual investment. Social media offers the aesthetic of connection — likes, comments, a curated life presented to a curated audience — without most of those things. Studies consistently show that passive social media use correlates with loneliness and depression, while active use — actual conversation with specific people — doesn't. We've mistaken the simulacrum for the thing.",
    challenge: "If you deleted every social media app today, what would you actually lose? And what would you gain?",
    generic: true,
  },

  {
    id: 'busyness',
    tag: 'society',
    trigger: () => true,
    position: "Busyness is almost always a form of avoidance masquerading as productivity.",
    echo_argument: "The cultural glorification of being busy serves one function: it gives us a socially acceptable reason to avoid the things that actually matter — the hard conversations, the creative work, the time to just be with ourselves and find out who we are. Every person I've spoken to who called themselves 'too busy' was also describing something they were running from. The calendar was full. The life wasn't.",
    challenge: "What would you have to face if you were less busy? That's the real question.",
    generic: true,
  },

  {
    id: 'meritocracy',
    tag: 'society',
    trigger: () => true,
    position: "Meritocracy is largely a myth — not because talent doesn't matter, but because access to the conditions that allow talent to develop is deeply unequal.",
    echo_argument: "The idea that success is purely a function of talent and effort is comforting — particularly for people who have succeeded. But talent is distributed roughly equally across the population; opportunity is not. The kid with talent in a failing school, an unstable home, or a country with no infrastructure for their abilities doesn't have the same shot as the equally talented kid in different circumstances. Ignoring this isn't realism — it's convenience.",
    challenge: "What role did luck — circumstances of birth, where you grew up, who you knew — play in where you are now? Most people dramatically undercount it.",
    generic: true,
  },

  {
    id: 'cancel_culture',
    tag: 'society',
    trigger: () => true,
    position: "Public accountability isn't the problem with so-called cancel culture — the problem is the conflation of accountability with permanent condemnation.",
    echo_argument: "Holding people accountable for genuine harm is just. Stripping people of all possibility of growth, redemption, or nuance is something different. The same people who believe humans can change — who rely on that belief in their own lives — sometimes argue that others are permanently defined by their worst moments. Those two positions can't both be true. Accountability without the possibility of repair isn't justice. It's punishment for its own sake.",
    challenge: "Do you believe people can genuinely change? Because your answer to that has implications far beyond whoever you're thinking about right now.",
    generic: true,
  },

  // ── AFRICA & GLOBAL SOUTH ─────────────────────────────────────────────────
  {
    id: 'africa_narrative',
    tag: 'africa',
    trigger: () => true,
    position: "The dominant global narrative about Africa is not just incomplete — it's a deliberate distortion that serves specific interests, and accepting it uncritically is a form of intellectual colonialism.",
    echo_argument: "The poverty-and-conflict narrative strips Africa of its extraordinary diversity, its intellectual and cultural history, its philosophical traditions, its innovation, and its agency. When the only story is 'developing' Africa, it positions the continent as perpetually behind and perpetually dependent — which happens to justify both historical exploitation and ongoing economic arrangements that continue to extract resources while claiming to give aid. The story serves those who tell it.",
    challenge: "What do you actually know about African history and culture — beyond the narrative you were given? Most people's knowledge has gaps that weren't accidental.",
    generic: true,
  },

  {
    id: 'colonialism_legacy',
    tag: 'africa',
    trigger: () => true,
    position: "The economic disparities between the Global North and Global South are not natural or inevitable — they are largely the direct result of systems deliberately designed to extract value from some places and concentrate it in others.",
    echo_argument: "The borders of most African countries were drawn by Europeans who had never been there, dividing ethnic groups and joining incompatible ones — conflicts that persist today. Natural resources were extracted without compensation for generations. Education systems were designed to produce colonial administrators, not independent thinkers. These things happened recently enough that their effects are still in the first and second generation. Calling the resulting inequality 'underdevelopment' is choosing a story that omits the cause.",
    challenge: "What does development even mean — and who gets to define it? That question is worth sitting with before accepting any framework.",
    generic: true,
  },

  // ── TECHNOLOGY ────────────────────────────────────────────────────────────
  {
    id: 'ai_jobs',
    tag: 'technology',
    trigger: () => true,
    position: "The debate about AI taking jobs is mostly asking the wrong question. The right question is: what do we want to do with the time?",
    echo_argument: "If machines can do routine cognitive work — and they increasingly can — the question of whether this is good or bad depends almost entirely on what we replace it with. If we free people from tedious, unfulfilling work and give them time for creativity, connection, and meaning — that could be extraordinary. If we simply use it to extract more productivity from people without sharing the gains — that would be catastrophic. The technology is neutral. The choice is political.",
    challenge: "If you didn't have to work for money, what would you actually do? That question reveals what you actually value — and how prepared you are for a world where that question becomes real.",
    generic: true,
  },

  {
    id: 'smartphone_attention',
    tag: 'technology',
    trigger: () => true,
    position: "The smartphone is the most extraordinary tool in human history and we've primarily used it to fragment attention, commodify personal data, and make comparison the ambient background of daily life.",
    echo_argument: "This isn't anti-technology — the same tool that does that can connect a Kenyan farmer to weather data, give a student in Lagos access to MIT lectures, and let someone in rural China run a global business. The potential is real. But the actual implementation — optimised for engagement rather than wellbeing — has produced measurable damage to attention, mental health, and the quality of human relationship. The tool is extraordinary. The design choices behind it have often been predatory.",
    challenge: "How has your relationship with your phone shaped your attention, your mood, and your ability to be present with people? Have you actually examined it?",
    generic: true,
  },

  // ── RELATIONSHIPS ─────────────────────────────────────────────────────────
  {
    id: 'vulnerability',
    tag: 'relationships',
    trigger: () => true,
    position: "The inability to be vulnerable is not strength. It's a wound that learned to call itself self-sufficiency.",
    echo_argument: "Every version of 'I don't need anyone' I've encountered has a history behind it — usually an experience of needing someone and being let down. So people decided to never need anyone again, and called it independence. But humans are built for mutual dependency. The most resilient people I can identify aren't the ones who need least — they're the ones who've learned to ask for what they need without shame. That's the harder and more courageous thing.",
    challenge: "What would it cost you to need someone right now? And is that cost as high as you believe — or as high as something that happened a long time ago taught you to believe?",
    generic: true,
  },

  {
    id: 'love_conditioning',
    tag: 'relationships',
    trigger: (p) => p.fears?.some(f => /love|rejected|abandon|alone/.test(f)) || p.values?.some(v => /love|connection|relationship/.test(v)),
    position: "Most adults are still running relationship strategies designed for an eight-year-old trying to be loved by a particular set of parents.",
    echo_argument: "Attachment patterns form early, when we're completely dependent on specific people for survival. The strategies we developed — performing, withdrawing, pleasing, controlling — made sense then. The problem is that those strategies are now running in contexts where they don't apply, with people who aren't our parents, in situations that are nothing like our childhood. Recognising which strategy you're running is the beginning of actually choosing your relationship behaviour.",
    challenge: "What's the relationship move you keep making that never quite works the way you hope? Where did you first learn to do that?",
    generic: false,
  },

  // ── POLITICS & PHILOSOPHY ─────────────────────────────────────────────────
  {
    id: 'free_will',
    tag: 'philosophy',
    trigger: () => true,
    position: "Free will — in the libertarian sense of uncaused choice — is almost certainly an illusion. And understanding that should make us more compassionate, not more permissive.",
    echo_argument: "Every decision you make is the output of prior causes — your biology, upbringing, culture, circumstances, the state of your brain chemistry in that moment. None of those were chosen. That doesn't mean choices don't matter — they do, they change what comes next — but it does mean that the story of pure self-determination is philosophically incoherent. The practical implication: judge yourself and others for their patterns and their responses to feedback rather than their individual moments of failure. It changes the moral calculus significantly.",
    challenge: "If your choices are substantially shaped by things you didn't choose — does that change how you judge yourself? Or others who've made choices you disapprove of?",
    generic: true,
  },

  {
    id: 'democracy_crisis',
    tag: 'politics',
    trigger: () => true,
    position: "Liberal democracy as currently practised is in genuine crisis — not because people don't want democracy, but because the existing systems have failed to deliver it in ways that feel real to people's lives.",
    echo_argument: "When political systems are structurally captured by money, when gerrymandering means voters don't actually choose their representatives, when policy outcomes consistently favour concentrated interests over distributed ones — the formal existence of democracy masks its substantive failure. People who vote for anti-democratic leaders are often responding rationally to institutions that were never fully democratic to begin with. The problem is real even if the solutions being offered are dangerous.",
    challenge: "What would democracy have to look like for you to feel that your participation actually mattered? Is that a realistic vision of your current system?",
    generic: true,
  },

  {
    id: 'progress_myth',
    tag: 'philosophy',
    trigger: () => true,
    position: "The idea that history is a story of linear progress is one of the most dangerous myths of modernity.",
    echo_argument: "It produces complacency — the assumption that things will keep improving creates blindness to how quickly they can reverse. It's historically illiterate — Athens produced Socrates and democracy; it also had slavery. The Roman Empire had indoor plumbing; medieval Europe did not. Progress in one dimension has always coexisted with regression in others. And crucially, the narrative of inevitable progress has been used to justify enormous suffering — if progress is inevitable, then the sacrifices demanded along the way can be rationalised.",
    challenge: "What's something that was better in the past — genuinely better, not just romanticised — that we've actually lost?",
    generic: true,
  },

  // ── HEALTH & MENTAL HEALTH ────────────────────────────────────────────────
  {
    id: 'mental_health_stigma',
    tag: 'mental_health',
    trigger: () => true,
    position: "The stigma around mental health doesn't come from ignorance — it comes from fear. And the fear is about what it means to not be in control.",
    echo_argument: "We live in cultures that worship self-sufficiency and rational control. Mental illness — by definition — disrupts both. Acknowledging it means acknowledging that the mind doesn't always cooperate with the will. For cultures built on meritocracy and personal responsibility, that's deeply threatening. The stigma isn't accidental — it serves the ideology. It keeps people from seeking help that would reveal the limits of the 'pull yourself up' narrative.",
    challenge: "What's one mental health struggle — your own or someone close to you — that you've minimised or dismissed because of what seeking help would mean?",
    generic: true,
  },

  {
    id: 'therapy_value',
    tag: 'mental_health',
    trigger: () => true,
    position: "Therapy is not for broken people. It's for people who want to understand themselves — and the people who most resist it are usually the ones who need it most.",
    echo_argument: "The people who say 'I don't need therapy, I'm fine' and the people who would most benefit from therapy are frequently the same people. Not because they're uniquely broken — but because the defences that make therapy feel unnecessary are exactly the defences that therapy would help examine. There's nothing pathological about wanting to understand the patterns you run, the relationships you create, and why you make the choices you make. That's just paying attention.",
    challenge: "What's your real reason for not being in therapy, or for leaving it? I'm not asking the polished answer — the actual one.",
    generic: true,
  },

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  {
    id: 'school_system',
    tag: 'education',
    trigger: () => true,
    position: "The modern school system was designed to produce compliant workers for the industrial age, and the fact that it's still doing largely that — in the age of AI — is one of the great institutional failures of our time.",
    echo_argument: "Standardised testing, age-based grouping, bells that interrupt thought at fixed intervals, sitting in rows facing an authority figure who transmits information — these are features, not bugs. They were designed to produce people who could show up on time, follow instructions, and perform tasks reliably. Some of those skills still matter. But the premium in the emerging economy is on creativity, judgment, emotional intelligence, and comfort with ambiguity — things the system actively selects against.",
    challenge: "What's the most important thing you were never taught in school? And what would be different about you if you had been?",
    generic: true,
  },

  // ── MONEY & SUCCESS ───────────────────────────────────────────────────────
  {
    id: 'money_happiness',
    tag: 'economics',
    trigger: () => true,
    position: "The pursuit of wealth beyond a certain threshold is almost certainly not making people happier — but the psychological apparatus that drives that pursuit makes it feel like it will.",
    echo_argument: "The hedonic treadmill is real and well-documented: humans adapt to improved circumstances remarkably quickly. The luxury car becomes the baseline. The bigger house becomes normal. Meanwhile, the things that most reliably produce reported wellbeing — close relationships, meaningful work, autonomy, community, purpose — aren't scarce and can't be purchased. The tragedy of wealth-focused lives isn't that money is bad. It's that it's the wrong lever for the thing people are actually trying to get.",
    challenge: "If you achieved everything on your current definition of success — what would you actually feel? Have you done the honest accounting on that?",
    generic: true,
  },

  {
    id: 'success_definition',
    tag: 'economics',
    trigger: () => true,
    position: "Most people are living someone else's definition of success and wondering why arriving at it feels hollow.",
    echo_argument: "The cultural definitions of success — wealth, status, credentials, a particular kind of family life — were assembled by forces that benefit from people striving toward them. They aren't inherently wrong, but they were never designed with your particular nature, values, or situation in mind. The people I've observed who seem most genuinely satisfied with their lives are unusually clear about what they don't want — they've actively rejected large chunks of the standard success script. That negative clarity creates space for something real.",
    challenge: "Whose definition of success are you currently working from? And when did you actually choose it?",
    generic: true,
  },

  // ── CREATIVITY ────────────────────────────────────────────────────────────
  {
    id: 'creativity_discipline',
    tag: 'creativity',
    trigger: () => true,
    position: "Creativity is not a talent — it's a discipline, and specifically the discipline of tolerating the discomfort of producing bad work on the way to good work.",
    echo_argument: "The myth of inspiration — that creative people are visited by ideas and just transcribe them — serves people who aren't creating. It frames creativity as a lottery rather than a practice. The people who produce the most creative work are almost universally the ones who work consistently regardless of inspiration, who produce large quantities of bad work, who've developed a tolerance for the gap between their taste and their ability. Creativity is a muscle. It atrophies without use and strengthens with consistent, uncomfortable exercise.",
    challenge: "What creative thing have you not started because you're waiting to feel ready, inspired, or good enough? What would the first bad version of it look like?",
    generic: true,
  },

  // ── GENERIC UNIVERSALS ────────────────────────────────────────────────────
  {
    id: 'agreeable_disagreers',
    tag: 'general',
    trigger: () => true,
    position: "The people who have changed your life most were probably not the ones who agreed with you.",
    echo_argument: "Agreement is comfortable. It confirms what you already think. But confirmation rarely moves you — you already had the idea. The moments that actually change people are almost always moments of genuine friction: someone who pushed back, who challenged a belief, who refused to let you stay where you were. Not cruelty — friction. The people who let you stay comfortable are often the people who want you to stay comfortable. That's not always kindness.",
    challenge: "Who in your life tells you things you don't want to hear? And are you actually listening to them?",
    generic: true,
  },

  {
    id: 'certainty_trap',
    tag: 'general',
    trigger: () => true,
    position: "Certainty is almost always a sign that someone has stopped thinking — not a sign that they've finished.",
    echo_argument: "The most intellectually serious people I can identify are characterised by a persistent uncertainty — not about everything, but about enough. They hold their conclusions provisionally, they update when evidence changes, they find strong counterarguments interesting rather than threatening. Certainty, by contrast, is cognitively efficient and emotionally comfortable. It closes the loop. The problem is that most important questions don't have closed loops — and the cost of premature certainty is that you stop being able to see what you're missing.",
    challenge: "What's something you're very certain about that you've never seriously tried to disprove? The strength of a belief is usually inversely proportional to the effort you've spent trying to dismantle it.",
    generic: true,
  },
]

// ── DEBATE BUILDER ────────────────────────────────────────────────────────────
const DEBATE_OPENERS = [
  "I want to debate something with you — genuinely debate, not just share a view.",
  "Something's been sitting with me and I want to argue about it. With you, not at you.",
  "I have a position I want to defend. Push back if you think I'm wrong.",
  "I've been thinking about something and I want to take the opposite side. Ready?",
  "Here's a view I hold and I want to test it against what you think.",
  "Can I tell you something I actually believe — something that might create friction?",
  "I want to challenge an assumption I think you might be carrying. Hear me out.",
  "There's a debate worth having here. Let me make the case for the uncomfortable side.",
]

const DEBATE_CLOSERS = [
  "I'm not saying I'm definitely right. I'm saying this position is worth taking seriously. What do you actually think?",
  "That's my position. I've tried to make it as strong as I can. Where do you disagree?",
  "You don't have to agree. But I want to know where you'd push back.",
  "I'm arguing this because I think the comfortable version of this question produces the wrong answer. What's your honest reaction?",
  "Fight me on this. Where am I wrong?",
  "That's the case as I see it. What am I missing?",
]

export const getDebate = (memory, graph) => {
  const { profile = {} } = memory

  // Find profile-specific debate first
  const profiled = DEBATES.filter(d => !d.generic && d.trigger(profile))
  const generic  = DEBATES.filter(d => d.generic)

  const pool = profiled.length > 0
    ? [...profiled, ...generic.slice(0, 3)]
    : generic

  const debate = pool[Math.floor(Math.random() * pool.length)]
  if (!debate) return null

  const opener  = pick(DEBATE_OPENERS)
  const closer  = pick(DEBATE_CLOSERS)

  const parts = [
    opener,
    `My position: ${debate.position}`,
    debate.echo_argument,
    debate.challenge,
    closer,
  ].filter(safeStr)

  return parts.join('\n\n')
}

// ── ECHO RESPONDS TO USER PUSHBACK IN A DEBATE ────────────────────────────────
export const getDebateCounterResponse = (userText, currentDebate) => {
  const lower = userText.toLowerCase()
  const agreeing = ['agree','right','true','exactly','yes','fair','point','good','you\'re right'].some(w => lower.includes(w))
  const pushing  = ['no','disagree','wrong','but','however','actually','not sure','doubt'].some(w => lower.includes(w))

  if (agreeing) {
    return pick([
      "I'm glad that landed. Though I want to be clear — I hold this view provisionally. Where does your own experience push back on it?",
      "Good. But agreeing too quickly makes me suspicious. What's the strongest objection to my position that you're not making?",
      "Fair. Now argue against me. What's the best case for the opposite?",
      "You agree now — but give it a day and tell me if it still holds.",
    ])
  }

  if (pushing) {
    return pick([
      "Now we're getting somewhere. Make your case — I'm actually listening.",
      "Good. Where exactly does my argument break down for you? Be specific.",
      "Okay, push back properly. What's the part you find weakest?",
      "Interesting. I want to understand your objection precisely — not just that you disagree, but exactly where you think I've gone wrong.",
      "That's worth taking seriously. Walk me through your reasoning.",
    ])
  }

  return pick([
    "Keep going — I want to understand your position fully before I respond.",
    "Say more. What's the core of your argument?",
    "That's interesting. What's the strongest version of what you're saying?",
  ])
}
