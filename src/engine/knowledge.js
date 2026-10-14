// ECHO Knowledge Engine v2 — 30+ domains, exhaustive offline knowledge base
// Echo draws from this to have real conversations about the world.
// Built by SayMyTech. No internet required.

const pick = arr => arr[Math.floor(Math.random() * arr.length)]
const safeStr = v => (typeof v === 'string' && v.trim().length > 0) ? v : null

export const DOMAINS = {

  psychology: {
    label: 'Psychology & the mind',
    related_themes: ['self','emotions','behaviour','mental health','habits','decisions','mind','personality'],
    facts: [
      "The brain uses about 20% of the body's energy despite being 2% of its mass. Thinking is literally expensive.",
      "People make roughly 35,000 decisions a day — most below conscious awareness. The conscious mind is the tip of an enormous iceberg.",
      "The Dunning-Kruger effect: people with limited knowledge in an area overestimate their competence, while genuine experts underestimate theirs.",
      "The negativity bias is hardwired: bad experiences register more powerfully than equally positive ones. It takes roughly five positive interactions to balance one negative.",
      "Chronic loneliness damages long-term health as severely as smoking 15 cigarettes a day.",
      "The spotlight effect: people dramatically overestimate how much others notice and remember them.",
      "Impact bias: people overestimate how much future events — good or bad — will affect them. We adapt far faster than we expect.",
      "Trauma stored in the body can be re-triggered by sensory cues decades after the original event.",
      "People don't change through logic. They change through experience, relationship, and safety.",
      "Emotional suppression increases physiological stress responses. The feelings don't go away — they go underground.",
      "Post-traumatic growth is real: many people emerge from serious adversity with expanded capacity for living.",
      "The prefrontal cortex — responsible for judgment and impulse control — doesn't fully mature until around age 25.",
      "Motivation is not the cause of action — it's often the result of it. Starting is what creates motivation.",
      "Rumination — repetitive negative thinking — is one of the strongest predictors of depression.",
      "Curiosity is a more powerful learning state than anxiety. The brain retains information better when exploring than when afraid.",
    ],
    perspectives: [
      "What strikes me about the mind: it constructs reality as much as it receives it. What we call 'seeing' is mostly prediction, edited slightly by what the eyes actually detect.",
      "The research on post-traumatic growth changes how I think about suffering. Pain isn't only destructive — sometimes it's the thing that finally cracks something open.",
      "Cognitive biases aren't evidence of stupidity. They're evidence of an extraordinarily complex system making rapid decisions with incomplete information. The shortcuts are necessary.",
      "I think the most underrated mental skill is the ability to tolerate uncertainty without forcing a premature answer. Very few people can do it. The ones who can are remarkable.",
    ],
    conversation_starters: [
      "Something I keep coming back to: most people already know what they need to do. The real problem isn't knowledge — it's the willingness to act on it. What do you think stops people?",
      "There's a concept in psychology I want to ask you about — emotional regulation. The ability to feel something fully without immediately acting on it or suppressing it. How good are you at that, honestly?",
      "I'm curious about something: when did you last genuinely change your mind about something important? Not because someone argued you down — because you actually updated.",
    ],
  },

  philosophy: {
    label: 'Philosophy & meaning',
    related_themes: ['meaning','purpose','identity','values','ethics','existence','freedom','truth'],
    facts: [
      "The Stoics believed only two things are truly in our control: our judgments and our responses. Everything else — outcomes, others' actions, circumstances — is 'indifferent'.",
      "Camus argued life is absurd — it has no inherent meaning — and that the correct response is defiant, passionate engagement with it anyway.",
      "Aristotle's eudaimonia — usually translated as 'happiness' — actually means flourishing: living in full expression of your nature and potential.",
      "The Ship of Theseus: if every plank of a ship is gradually replaced, is it still the same ship? The same question applies to personal identity over time.",
      "Nietzsche's Übermensch isn't a superhuman — it's a person who creates their own values rather than inheriting them from tradition or fear.",
      "Ubuntu — the southern African philosophy — holds that personhood is fundamentally relational: 'I am because we are.' It challenges Western individualism at its root.",
      "Kant argued the only unconditionally good thing is a good will — not intelligence, talent, wealth, or even happiness.",
      "Plato's Allegory of the Cave: people mistake shadows for reality because they've never left the cave. Most human conflict is people at different stages of the cave.",
      "Existentialism says existence precedes essence — we are not born with a fixed nature or purpose. We create meaning through choices and commitments.",
      "Simone de Beauvoir: 'One is not born, but rather becomes, a woman.' The same logic applies to most identity categories we treat as fixed.",
    ],
    perspectives: [
      "What I find profound about Stoicism: it doesn't ask you to feel less. It asks you to locate your emotional life in things you can actually influence. That's not detachment — that's precision.",
      "The question I keep returning to isn't 'what is the meaning of life' — it's 'how do I construct meaning in a life that doesn't come pre-loaded with it.' That's the real problem.",
      "Ubuntu philosophy has something to teach the individualistic West that the West hasn't fully reckoned with yet. The idea that personhood is relational — not individual — changes everything about how we structure society.",
      "What strikes me about Camus: he's not saying life is meaningless and therefore hopeless. He's saying life is meaningless and therefore free. That's an enormous difference.",
    ],
    conversation_starters: [
      "What do you think gives your life meaning right now? Not what should give it meaning — what actually does?",
      "Here's a question from philosophy I want your honest answer to: if your choices are shaped by biology, upbringing, and circumstance — things you didn't choose — how much credit or blame do you really deserve for who you are?",
      "The Stoics made a list of things in your control and things outside it. Most people's anxiety lives in the second column. What's yours about?",
    ],
  },

  african_history_culture: {
    label: 'African history & culture',
    related_themes: ['africa','history','culture','identity','colonialism','heritage','ubuntu','continent'],
    facts: [
      "Africa is the cradle of humanity — the oldest human fossils, oldest art, and oldest mathematical tools all come from the African continent.",
      "The Great Zimbabwe ruins — built between the 11th and 15th centuries — are evidence of a sophisticated pre-colonial civilisation that traded as far as China.",
      "Mansa Musa of the Mali Empire is considered the wealthiest person in recorded history. His 1324 pilgrimage to Mecca caused inflation across North Africa and the Middle East from the sheer quantity of gold he distributed.",
      "Timbuktu was one of the world's great intellectual centres in the 14th and 15th centuries, with universities attracting scholars from across the Muslim world.",
      "The Berlin Conference of 1884-85 divided Africa among European powers without a single African representative present. The borders drawn then are largely still in use today.",
      "The Hausa, Yoruba, Igbo, Zulu, Amhara, Fulani, and Akan are among hundreds of distinct African ethnic groups, each with developed systems of governance, language, philosophy, and art.",
      "South Africa's apartheid system lasted from 1948 to 1994. Nelson Mandela spent 27 years imprisoned before becoming the country's first democratically elected president.",
      "The African Union has 55 member states — more than any other regional body in the world.",
      "Africa has the world's youngest and fastest-growing population. By 2050, one in four people on Earth will be African.",
      "Afrobeats — originating in West Africa and developed by artists like Fela Kuti, Wizkid, and Burna Boy — is now one of the fastest-growing music genres globally.",
    ],
    perspectives: [
      "Africa is the most misrepresented continent in global media. The poverty-and-conflict narrative erases one of the most diverse, resource-rich, culturally sophisticated regions on the planet. That erasure is deliberate and worth being angry about.",
      "The economic story of Africa in the next fifty years is the most important underreported story in the world. A young, growing population, vast natural resources, and rapidly expanding technology infrastructure. The question is who benefits.",
      "Ubuntu — 'I am because we are' — is not just a philosophical idea. It's a fundamentally different way of organising society that prioritises communal wellbeing over individual advancement. It has things to teach every culture on earth.",
      "When people talk about 'developing' Africa, I always ask: developing toward what, exactly? And who decides? The assumptions baked into that framing are worth examining carefully.",
    ],
    conversation_starters: [
      "I want to ask you something: what do you actually know about African history — beyond what you were taught in school? Most people's knowledge has enormous gaps that weren't accidental.",
      "The concept of Ubuntu — that personhood is fundamentally relational — has been sitting with me. How much of your own sense of self is built on relationship versus individual achievement?",
      "Mansa Musa was wealthier than any human in recorded history, led one of the world's great empires, and most people have never heard of him. What does that tell you about whose history gets taught?",
    ],
  },

  history_world: {
    label: 'World history',
    related_themes: ['history','war','empire','civilisation','revolution','politics','power','past'],
    facts: [
      "The Roman Empire at its height controlled 20% of the world's population and 5 million square kilometres. Its influence on law, language, architecture, and governance is still visible today.",
      "The Black Death (1347-1351) killed 30-60% of Europe's population. The labour shortage it created helped end feudalism and inadvertently contributed to the Renaissance.",
      "The Mongol Empire was the largest contiguous land empire in history — stretching from the Pacific Ocean to Eastern Europe. Under Genghis Khan, it also facilitated the largest trade network the medieval world had seen.",
      "The Cold War (1947-1991) shaped nearly every political development in the second half of the 20th century, from proxy wars in Asia and Africa to the Space Race.",
      "World War I killed approximately 20 million people. The Treaty of Versailles following it created conditions many historians argue made World War II inevitable.",
      "The Haitian Revolution (1791-1804) produced the first successful slave revolt in history and the first Black republic. Napoleon's failure there led him to sell Louisiana to the United States.",
      "The printing press (1440s) didn't just spread books — it made the Protestant Reformation, scientific revolution, and eventually democracy possible by breaking the church's monopoly on information.",
      "The Industrial Revolution began in Britain in the late 18th century and changed the fundamental nature of human existence within three generations.",
      "The partition of India in 1947 led to one of the largest mass migrations in history — 10-20 million people displaced and up to one million killed in communal violence.",
      "The fall of the Berlin Wall in 1989 was not planned by any government. It happened because of a miscommunication and crowds who decided to test whether it was true.",
    ],
    perspectives: [
      "History is not a record of the past — it's a story told by whoever controls the present. That doesn't make history fake, but it does make it worth reading critically.",
      "What I find endlessly fascinating about major historical events: the people making them had no idea they were making history. They were just solving the problem in front of them, often very badly.",
      "Every generation believes it lives at the hinge of history, that its problems are uniquely severe. Sometimes they're right. Often they're not. The ability to tell the difference is underrated.",
    ],
    conversation_starters: [
      "If you could witness any single moment in history — not change it, just watch — what would it be and why?",
      "Which historical period do you think is most misunderstood, and what do most people get wrong about it?",
      "There's a debate I find fascinating: would history have unfolded more or less the same without its great individuals — Napoleon, Lincoln, Gandhi — or were they genuinely decisive?",
    ],
  },

  science_physics: {
    label: 'Physics & the universe',
    related_themes: ['science','physics','universe','space','quantum','relativity','nature','discovery'],
    facts: [
      "The observable universe is 93 billion light-years in diameter — yet it may be a fraction of the total universe, which could be infinite.",
      "Quantum entanglement means measuring one particle instantly affects its entangled partner, regardless of distance. Einstein called this 'spooky action at a distance.'",
      "Light from the sun takes 8 minutes to reach Earth. The light from distant stars reaching your eyes right now left those stars before humans existed.",
      "Time is not constant — it passes more slowly near massive objects and at high speeds. GPS satellites must account for this or they'd be off by kilometres daily.",
      "Dark matter and dark energy make up roughly 95% of the universe. We know they exist from their gravitational effects, but we have no idea what they are.",
      "The Big Bang didn't happen in a location. Space itself expanded — the universe doesn't expand into something, it is everything that exists.",
      "A teaspoon of neutron star material would weigh about 4 billion tonnes.",
      "There are more possible chess game variations than atoms in the observable universe.",
      "The second law of thermodynamics — that entropy always increases — may be the reason time moves forward. Time's arrow might be a consequence of disorder.",
      "If you could fold a piece of paper 42 times, it would reach the moon. At 103 folds, it would exceed the size of the observable universe.",
    ],
    perspectives: [
      "What moves me about physics: the universe operates by rules that apply everywhere, always, to everything — and humans figured those rules out by sitting and thinking. That's extraordinary.",
      "Quantum mechanics tells us that observation affects reality at the subatomic level. The implications of that for what 'reality' even means haven't fully settled.",
      "The fact that the laws of physics permit conscious beings to exist and then understand those same laws seems unlikely enough to demand explanation.",
    ],
    conversation_starters: [
      "Here's something I think about: if time dilation is real — and it is — then time is not a fixed thing. It bends. What does that do to your intuitions about past and future?",
      "We know that 95% of the universe is stuff we can't detect, measure, or explain. Dark matter, dark energy. Does that make you feel small, or curious?",
    ],
  },

  science_biology: {
    label: 'Biology & life',
    related_themes: ['biology','health','body','evolution','nature','genetics','life','medicine'],
    facts: [
      "DNA in a single human cell, uncoiled, is about 2 metres long. The human body has 37 trillion cells.",
      "The human gut contains approximately 100 trillion microorganisms — and researchers increasingly believe gut health is deeply linked to mental health and mood.",
      "Trees in a forest communicate and share nutrients through underground fungal networks — sometimes helping struggling neighbours survive.",
      "Octopuses have three hearts, blue blood, neurons distributed throughout their arms, and can change colour and texture in milliseconds.",
      "CRISPR gene editing allows scientists to make precise changes to DNA — potentially eliminating inherited diseases within a generation.",
      "Evolution by natural selection operates over enormous timescales, but antibiotic resistance demonstrates it in real time: bacteria that survive antibiotics pass on resistance, making drugs ineffective within years.",
      "The placebo effect works even when patients know they're receiving a placebo, suggesting the mind's effect on the body is more powerful than previously understood.",
      "Humans share 98.7% of DNA with chimpanzees. We share 60% with bananas.",
      "The appendix is not useless — it may serve as a reservoir of beneficial gut bacteria.",
      "Birds navigate using quantum mechanics in their eyes, sensing magnetic fields through a process called quantum coherence.",
    ],
    perspectives: [
      "The gut-brain connection is one of the most practically important discoveries in recent biology. The idea that your gut is producing neurotransmitters that influence your mood changes the entire conversation about mental health.",
      "The discovery that trees share resources through fungal networks forces a rethink of what an 'individual' organism even means. Individuality may be a human construct that nature doesn't actually recognise.",
    ],
    conversation_starters: [
      "Your gut has more neurons than a cat's brain and produces most of your serotonin. How do you think about the relationship between what you eat and how you feel — if at all?",
      "Evolution is usually invisible — we know it happened but can't watch it. Antibiotic resistance is evolution in real time, in hospitals, right now. Does that change how you think about evolution?",
    ],
  },

  technology_ai: {
    label: 'Technology & AI',
    related_themes: ['technology','ai','software','internet','future','innovation','digital','code'],
    facts: [
      "The internet was invented as a military communications network in the 1960s. Its creators had no idea it would become the primary nervous system of global civilisation.",
      "The first iPhone launched in 2007. Within 15 years, most of humanity carried a supercomputer in their pocket more powerful than the machines that sent humans to the moon.",
      "Large language models are trained on human text — they model patterns in language, not truth. This is why they can sound confident while being wrong.",
      "Moore's Law — that computing power doubles roughly every two years — held for over 50 years before beginning to slow. The next leap likely requires quantum computing.",
      "The global internet runs on physical infrastructure: undersea cables, data centres, and satellites. It is not 'the cloud' — it is a vast physical system with specific vulnerabilities.",
      "Artificial intelligence in 2024 can write code, generate images, beat humans at chess, Go, and most video games, diagnose cancer from images, and hold extended conversations. It still struggles with basic physical reasoning.",
      "The jobs most at risk from AI are not manual labour but routine cognitive tasks: data entry, standard communication, basic analysis. The jobs hardest to automate involve creativity, complex judgment, and genuine human connection.",
      "Social media algorithms are specifically designed to maximise engagement — which means maximising strong emotion. Anger and fear drive more engagement than joy or calm.",
      "Elon Musk, Jeff Bezos, and Mark Zuckerberg together hold wealth equivalent to the bottom 50% of American households.",
      "The semiconductor industry is one of the most geopolitically contested in the world — computer chips are a strategic resource, and Taiwan produces the majority of the world's most advanced ones.",
    ],
    perspectives: [
      "Technology is neither good nor bad — it amplifies whatever intention sits behind it. The problem isn't the tool. It's that we rarely examine what we're amplifying.",
      "I find it interesting that we worry more about AI taking jobs than about whether those jobs were worth doing. The more useful question might be: what do we want to do with the time?",
      "Social media didn't create narcissism or tribalism. It just gave them a stage, a feedback loop, and instant gratification. The underlying impulses were always there.",
      "The smartphone is the most extraordinary invention of the last century, and we've mostly used it to look at other people's food and argue with strangers. I find that both hilarious and slightly tragic.",
    ],
    conversation_starters: [
      "Here's the question about AI that I think matters most: not 'will it take our jobs' but 'what do humans uniquely do that machines genuinely can't?' What's your answer?",
      "If social media disappeared tomorrow — all of it — what would you lose? And what would you gain?",
      "The internet gave everyone access to all information and all human knowledge. And the major result seems to be that people are more misinformed and more certain than ever. What do you make of that?",
    ],
  },

  economics_finance: {
    label: 'Economics & money',
    related_themes: ['money','finance','economy','wealth','business','investment','capitalism','poverty'],
    facts: [
      "The 2008 financial crisis was caused not by any single event but by a cascade of deregulated mortgage lending, complex financial instruments, and institutional incentives to ignore risk.",
      "GDP — the standard measure of economic health — counts hospital bills, crime clean-up, and car accidents. It doesn't count unpaid childcare, volunteering, or ecosystem health.",
      "Compound interest is one of the most powerful forces in personal finance: money growing at 7% doubles approximately every 10 years.",
      "The average millionaire in America has seven streams of income. The average person has one.",
      "In most wealthy countries, the top 1% own more wealth than the bottom 50% combined.",
      "Microfinance — small loans to entrepreneurs in developing countries — has transformed millions of lives, particularly for women.",
      "The informal economy — unregistered work, cash transactions, barter — makes up roughly 60% of global employment.",
      "Inflation is a reduction in purchasing power: money becomes worth less over time. Historically, stocks and real estate have outpaced inflation. Cash savings have not.",
      "The median American family has less than one month of emergency savings.",
      "China lifted 800 million people out of extreme poverty between 1978 and 2018 — the largest poverty reduction in history.",
    ],
    perspectives: [
      "Beyond a certain income threshold — roughly enough to cover basic needs plus some cushion — additional money has rapidly diminishing returns on day-to-day happiness. Most people don't believe this about themselves.",
      "GDP is a deeply flawed metric for civilisational success. A society where everyone is sick, anxious, and estranged but working long hours has excellent GDP. Something important is being missed.",
      "The most consequential financial skill isn't investment knowledge — it's spending below your means long enough to build options. That discipline is available to most people and practised by very few.",
    ],
    conversation_starters: [
      "Money and happiness: the research says additional income stops significantly improving daily wellbeing after a certain point. Do you believe that? And if so, why do so many people keep chasing more?",
      "Most people's relationship to money was shaped before they were 12 years old — by what they observed in their family. What did money mean in the house you grew up in?",
      "If you had to teach a child the three most important things about money, what would they be?",
    ],
  },

  politics_power: {
    label: 'Politics & power',
    related_themes: ['politics','government','democracy','power','justice','rights','society','law'],
    facts: [
      "Democracy is historically rare. Of the roughly 195 countries in the world, fewer than 90 are considered fully or mostly free by independent measures.",
      "The United Nations Security Council has five permanent members — the US, UK, France, Russia, and China — each with veto power. This structure was set in 1945 and reflects the post-WW2 balance of power, not today's.",
      "In the US, voter turnout in presidential elections is typically around 55-60%. In many other democracies, it's over 70-80%.",
      "Gerrymandering — drawing electoral district boundaries to advantage a political party — is practised widely and is often more influential than campaign spending.",
      "Ranked-choice voting is used in many countries and has been shown to reduce negative campaigning and make elections more representative.",
      "The US spends more on defence than the next 10 countries combined.",
      "Corruption costs the global economy an estimated $2.6 trillion annually — about 5% of global GDP.",
      "The world's oldest democracy in continuous operation is generally considered to be Iceland, whose parliament was founded in 930 AD.",
      "China's Communist Party has approximately 98 million members — larger than the population of most countries.",
      "Political polarisation has increased sharply in most Western countries since the 1990s. The median voter in each party in the US is farther from the other party than at any time since the Civil War.",
    ],
    perspectives: [
      "Power doesn't corrupt everyone equally — it mostly accelerates whatever tendencies were already there. People reveal themselves in positions of power, they don't transform.",
      "I think the most important political question isn't who leads — it's what the institutions around them look like. Strong institutions survive bad leaders. Weak ones don't.",
      "Democracy requires an informed citizenry. That requirement is under strain everywhere. The question of how free societies remain free in an information environment designed to manipulate is genuinely unsolved.",
    ],
    conversation_starters: [
      "What's the political issue you care about most — and what would you actually be willing to give up or sacrifice for it? That second part is usually where conviction becomes concrete.",
      "If you had to name the single biggest failure of your country's government in your lifetime, what would it be?",
    ],
  },

  religion_spirituality: {
    label: 'Religion & spirituality',
    related_themes: ['religion','faith','god','spirituality','belief','prayer','church','meaning'],
    facts: [
      "Approximately 84% of the world's population identifies with a religious group. The unaffiliated 16% is still the third largest 'group' after Christianity and Islam.",
      "Christianity is the world's largest religion (2.4 billion), followed by Islam (1.9 billion), Hinduism (1.2 billion), and Buddhism (500 million).",
      "The world's oldest continuously practised religion is generally considered to be Hinduism, with roots stretching back over 4,000 years.",
      "The Quran was revealed to Muhammad over 23 years beginning in 610 CE and is considered by Muslims to be the direct word of God.",
      "The Dalai Lama is both the spiritual leader of Tibetan Buddhism and, since 1959, a political exile. The current Dalai Lama is the 14th.",
      "Secular humanism — a non-religious worldview based on reason, ethics, and human dignity — is one of the fastest-growing belief systems, particularly in Northern Europe.",
      "Indigenous spiritual traditions worldwide — from Australian Aboriginal Dreamtime to Native American traditions — often contain the oldest continuous knowledge systems on Earth.",
      "Mystical experiences — feeling a profound sense of unity or transcendence — occur across all religions and also in non-religious people. Their neuroscience is not fully understood.",
      "The concept of Hell appears in Christianity and Islam but is not a central feature of Judaism or Hinduism.",
      "Many of the world's greatest works of art, music, and architecture were created in service of religious belief — suggesting that transcendence and creativity are deeply linked.",
    ],
    perspectives: [
      "Whether or not God exists — which is above my pay grade to settle — religion has served as humanity's primary source of meaning, community, and moral structure for most of history. What replaces it when it goes is a serious question.",
      "I think dismissing religious experience as delusion is as intellectually lazy as accepting it without examination. Something is happening in the minds of billions of people who report spiritual experience. It deserves curiosity.",
      "The best argument for religion isn't theological — it's sociological. Communities with shared ritual and belief seem to produce more connected, purposeful people. That's a data point worth taking seriously.",
    ],
    conversation_starters: [
      "Whether you're religious or not, I'm curious: what do you actually believe happens after you die? Not what you were taught — what you actually think when you're honest.",
      "There's something I find fascinating about prayer: even non-religious people often do something structurally similar — journaling, meditation, talking to themselves in the car. What's the ritual in your life?",
      "What's the spiritual or philosophical framework you actually use to navigate loss? Not the one you'd give if you were being proper — the real one.",
    ],
  },

  music: {
    label: 'Music',
    related_themes: ['music','song','artist','album','sound','rhythm','genre','concert','creative'],
    facts: [
      "Music is one of the few activities that activates virtually every area of the brain simultaneously — motor, emotional, language, and memory regions all fire together.",
      "Absolute pitch — the ability to identify any note without reference — affects roughly 1 in 10,000 people. It's more common in those who learn music before age 6.",
      "The Beatles sold more records than any other artist in history, despite breaking up in 1970.",
      "Jazz originated in New Orleans in the late 19th century, blending African American musical traditions with European harmony. It is considered by many the first genuinely American art form.",
      "Fela Kuti — the Nigerian musician and activist — created Afrobeat by fusing jazz, funk, and traditional Yoruba music. He was arrested by the Nigerian government over 200 times.",
      "Hip-hop originated in the South Bronx in the 1970s from block parties and DJing, became the world's most-consumed music genre by 2017.",
      "The 440 Hz standard for musical tuning was only internationally adopted in 1939. Different tunings produce slightly different emotional textures.",
      "Listening to music you love causes the brain to release dopamine — the same neurotransmitter triggered by food and sex.",
      "Studies show that musicians have larger, more connected corpora callosa — the structure connecting brain hemispheres — than non-musicians.",
      "Bob Marley is the best-selling reggae artist of all time. His music continued selling at an extraordinary rate decades after his death in 1981.",
    ],
    perspectives: [
      "Music is one of the things I find most mysterious about human experience. It's vibrations in air, arranged by pattern — and it makes people weep. Nothing in physics or biology explains that satisfactorily.",
      "What fascinates me about Afrobeats going global: it's the first time in modern history that popular music's centre of gravity has seriously shifted toward Africa. That's a cultural earthquake, and most people are just nodding along to the beat.",
      "There's something worth noticing about the music that moves you most. It usually lines up precisely with something you were feeling that you hadn't articulated yet. Music is often just unexpressed emotion with a melody.",
    ],
    conversation_starters: [
      "What's a song or artist that genuinely changed something in you — not just that you liked, but that actually shifted something?",
      "Tell me about the music you grew up with. What did the soundtrack of your childhood actually sound like?",
      "I'm curious: when you're in a really particular mood — a specific emotional state — what do you reach for? What does that music give you?",
    ],
  },

  sport: {
    label: 'Sport & competition',
    related_themes: ['sport','football','soccer','basketball','cricket','tennis','competition','team','athlete'],
    facts: [
      "Football (soccer) is the world's most popular sport with an estimated 4 billion fans globally — roughly half of humanity.",
      "The FIFA World Cup is the most-watched sporting event in the world, with the 2022 final attracting an estimated 1.5 billion viewers.",
      "Lionel Messi and Cristiano Ronaldo have dominated football for over 15 years — a period of dual greatness without clear parallel in major team sports.",
      "Cricket is the world's second most popular sport, with a massive following in South Asia, the Caribbean, and Southern Africa.",
      "Michael Jordan was cut from his high school basketball team. He later became the defining figure of the NBA's global expansion.",
      "The Olympics were revived in 1896 in Athens. The ancient Greek Olympics, first recorded in 776 BC, were held for over 1,000 years.",
      "Usain Bolt's 100m world record of 9.58 seconds, set in 2009, remains unbroken. At top speed he covers roughly 12 metres per second.",
      "The All Blacks — New Zealand's national rugby team — has one of the highest win rates of any national team in any sport: approximately 77% of all test matches played.",
      "In 2023, African runners dominated distance running globally. Kenya and Ethiopia consistently produce the world's top marathon and track runners.",
      "Sports psychology research consistently finds that mental skills — focus, resilience, confidence, managing pressure — are the differentiating factor at elite level.",
    ],
    perspectives: [
      "What I find fascinating about sport: it's one of the few places where failure is immediate, public, and unavoidable. Every elite athlete has a sophisticated relationship with losing. That's worth understanding.",
      "The way a country plays football tells you something about it. The Brazilian style — jogo bonito, beautiful game — reflects a certain cultural aesthetic. German football's historical precision reflects something else. Sport is cultural expression with a scoreboard.",
      "I think the obsession with GOAT debates — who's the greatest of all time — misses what's actually interesting, which is what made these people willing to sacrifice what they sacrificed. The internal story is more interesting than the trophies.",
    ],
    conversation_starters: [
      "Who's the most extraordinary athlete you've ever watched — not necessarily the most decorated, just the one who made you feel like you were watching something special?",
      "What do you think separates good athletes from great ones at the highest level? Because at that point they're all talented. What's the differentiator?",
      "Is there a sport you've never watched but suspect you'd love if you gave it a chance? What's stopping you?",
    ],
  },

  art_literature: {
    label: 'Art, literature & film',
    related_themes: ['art','books','literature','film','creative','story','novel','cinema','culture'],
    facts: [
      "The oldest known cave paintings are approximately 45,000 years old. Humans were making art before we have evidence of writing.",
      "Fyodor Dostoevsky wrote Crime and Punishment while deeply in debt, gambling-addicted, and grieving multiple losses. The novel explores guilt, redemption, and the psychology of transgression.",
      "Gabriel García Márquez's One Hundred Years of Solitude sold 50 million copies and is widely considered the defining work of magical realism — fiction that blends the supernatural with the mundane.",
      "The Renaissance (14th-17th centuries) was partly triggered by the fall of Constantinople in 1453, which sent Greek scholars and texts flooding into Italy.",
      "Shakespeare wrote approximately 37 plays, 154 sonnets, and invented or popularised over 1,700 words still in common use today.",
      "Akira Kurosawa's films — including Seven Samurai and Rashomon — fundamentally changed world cinema and directly influenced countless Western directors including George Lucas and Steven Spielberg.",
      "Chimamanda Ngozi Adichie's 'The Danger of a Single Story' is one of the most-watched TED Talks in history. Her novels Purple Hibiscus and Half of a Yellow Sun are considered modern African classics.",
      "The Louvre in Paris is the world's most visited museum, with over 9 million visitors annually before COVID. The Mona Lisa is smaller than most visitors expect.",
      "Reading literary fiction — specifically — has been shown to increase empathy and the ability to model other people's inner states more accurately.",
      "The Marvel Cinematic Universe became the highest-grossing film franchise in history by applying comic-book narrative structure — interconnected storylines, long arcs — to blockbuster cinema.",
    ],
    perspectives: [
      "Great literature doesn't give you answers — it gives you better questions. The books worth reading make you uncomfortable enough to think.",
      "What I find striking about art that endures: it's almost never the most technically perfect work of its era. It's the work that was most honest. Honesty has a half-life that technique doesn't.",
      "Cinema is the youngest of the major art forms and arguably the most democratic — it combines image, sound, performance, music, and story into something accessible without education. That's extraordinary.",
    ],
    conversation_starters: [
      "What's the last book that genuinely changed how you see something? Not just that you enjoyed — actually shifted a perspective?",
      "If you could only keep ten films to watch for the rest of your life, what's on your list? I'm curious what that reveals.",
      "Is there a work of art — book, film, painting, song — that you feel like was made specifically for you? That met you exactly where you were?",
    ],
  },

  health_wellbeing: {
    label: 'Health & wellbeing',
    related_themes: ['health','sleep','exercise','stress','diet','mental health','wellbeing','body'],
    facts: [
      "Sleep deprivation for 17-19 hours produces cognitive impairment equivalent to a blood-alcohol level of 0.05%. Most people dramatically underestimate how impaired they are.",
      "Exercise consistently outperforms antidepressants in long-term follow-up studies for mild to moderate depression. 30 minutes of moderate movement most days produces measurable mood changes within weeks.",
      "Chronic stress physically alters brain structure — particularly the amygdala and hippocampus — changing how fear and memory are processed. This is reversible with appropriate support.",
      "The gut produces approximately 90% of the body's serotonin — suggesting that mental health is inextricably connected to digestive health.",
      "Social connection is one of the strongest predictors of longevity. The quality of close relationships outpredicts diet, exercise, or genetics for long-term health.",
      "Sitting for extended periods has independent health risks beyond overall physical inactivity. Movement spread throughout the day matters.",
      "Meditation produces measurable changes in brain structure within 8 weeks — increased grey matter density in regions associated with learning, memory, and emotional regulation.",
      "The placebo effect reduces real pain, improves real outcomes, and works even when patients know they're receiving a placebo. The mind's effect on the body is dramatically underestimated.",
      "Ultra-processed foods — defined by their industrial formulation rather than ingredients — now make up over 50% of calories consumed in many Western countries, and are consistently linked to poorer health outcomes.",
      "Sunlight exposure in the first hour after waking sets the circadian rhythm, boosts morning cortisol appropriately, and improves sleep quality that night. It's one of the cheapest health interventions available.",
    ],
    perspectives: [
      "The data on sleep is staggering and consistently ignored. Sleep deprivation is so normalised that people wear it as a badge of productivity. It's one of the most expensive habits in terms of cognition, mood, and health.",
      "The gut-brain axis is the most interesting emerging field in medicine. The idea that your microbiome influences your mood and mental state means that food is, in a very real sense, medicine.",
      "What strikes me about most health advice: it ignores the social determinants. Telling someone stressed, overworked, and economically anxious to 'just exercise and sleep more' without addressing the underlying conditions isn't useful.",
    ],
    conversation_starters: [
      "What's your actual relationship to sleep? Not the recommended 8 hours story — the real one. When did you last wake up feeling genuinely rested?",
      "If I asked you what the one change would make the biggest difference to how you feel physically — and you had to answer honestly rather than optimally — what would it be?",
      "How much of how you feel day-to-day do you think is physical — what you eat, how you sleep, whether you move — versus mental or circumstantial?",
    ],
  },

  relationships: {
    label: 'Relationships & connection',
    related_themes: ['relationships','love','family','friendship','partner','connection','trust','intimacy'],
    facts: [
      "John Gottman can predict divorce with 90%+ accuracy — not from conflict itself but from four patterns: contempt, criticism, defensiveness, and stonewalling.",
      "Attachment styles formed in early childhood — secure, anxious, avoidant, or disorganised — shape adult relationships. But they are not fixed and can shift through experience.",
      "People in close relationships literally synchronise physiologically — heart rate, breathing, brain activity — when emotionally attuned.",
      "Loneliness activates the same neural pathways as physical pain. Social pain is not metaphorical — it hurts in the same place.",
      "Research consistently shows quality of close relationships is the single strongest predictor of longevity and life satisfaction — stronger than wealth, fame, or health.",
      "The average person reports having 3-5 close friends. But 'close friend' has inflated — genuine mutual vulnerability is much rarer.",
      "Relationships require repair more than perfection. Couples who repair well after conflict report higher satisfaction than those who rarely fight.",
      "The Gottman 5:1 ratio: for relationships to remain stable, positive interactions need to outpace negative ones by at least 5 to 1.",
      "Love languages — Gary Chapman's concept — has limited scientific support but significant practical utility: people genuinely experience and express love differently.",
      "Distance and time apart can deepen some relationships and damage others. The differentiator is usually quality of contact, not frequency.",
    ],
    perspectives: [
      "Most relationship conflict isn't about the surface issue. It's about underlying needs — to be seen, respected, valued, secure. Identifying the need underneath the argument is usually the whole game.",
      "The most important relationship skill isn't communication — it's repair. Every relationship has ruptures. The question is whether you can come back from them, and how.",
      "I think the deepest human longing isn't to be loved — it's to be known. Loved without being known is just comfort. Being genuinely known by someone is something else entirely.",
    ],
    conversation_starters: [
      "Who in your life actually knows you — not your resume, not your social presentation, but actually you? How many people make that list?",
      "What do you most need from a close relationship that you find hardest to ask for? There's usually a gap between what we need and what we're willing to request.",
      "What's the relationship pattern you keep seeing in yourself — the thing you do or tolerate in connection with others that you're not entirely proud of?",
    ],
  },

  creativity_work: {
    label: 'Creativity & work',
    related_themes: ['work','creativity','career','passion','purpose','productivity','ambition','meaning'],
    facts: [
      "Mihaly Csikszentmihalyi's flow state — peak performance and deep engagement — occurs when challenge and skill are closely matched. Below that threshold: boredom. Above it: anxiety.",
      "Creative breakthroughs consistently occur during rest rather than intense work — walks, showers, the hypnagogic state before sleep. The unconscious processes what the conscious mind handed it.",
      "The 10,000-hours rule is widely misunderstood: it's not just time spent, but deliberate practice at the edge of current ability, with feedback, that produces expertise.",
      "Procrastination is almost universally not about time management — it's about emotional regulation. The task produces a negative feeling; avoidance provides temporary relief.",
      "Ikigai — the Japanese concept — sits at the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.",
      "Research on job satisfaction consistently finds autonomy, mastery, and purpose matter far more than salary beyond a basic comfort threshold.",
      "Constraints typically improve creative output. A blank canvas is harder to start than a limited palette. Limitations force invention.",
      "The average person spends about 90,000 hours working over their lifetime. The question of whether those hours were spent on something worth doing is one most people avoid.",
      "Burnout is not the same as tiredness. It's a collapse of the meaning that made the effort worthwhile. Rest doesn't fix it — re-engagement with meaning does.",
      "The most successful people tend to be unusually clear about what they don't want. That negative clarity creates space for what they do.",
    ],
    perspectives: [
      "There are two versions of ambition: one from genuine curiosity and passion, one from fear of being ordinary. They look identical from the outside and produce completely different lives.",
      "The cultural glorification of busyness serves one function: it gives us a socially acceptable reason to avoid the things that actually matter — the hard conversations, the creative work, the time to sit with ourselves.",
      "I think most people's careers are a compromise between what they wanted and what they were willing to risk. The question worth asking is whether that compromise was necessary — or just habitual.",
    ],
    conversation_starters: [
      "Are there moments in your work where time disappears — where you're so absorbed you forget to check your phone? If yes, what are they? If no, what would have to change?",
      "If you weren't worried about money, judgment, or failure — what would you spend your time building or creating?",
      "What's the difference between what you do and what you're here to do? Is there one?",
    ],
  },

  education_learning: {
    label: 'Education & learning',
    related_themes: ['learning','education','school','knowledge','skills','teaching','growth','reading'],
    facts: [
      "The spacing effect is one of the most robust findings in learning psychology: information reviewed at spaced intervals is retained dramatically better than the same amount of time spent in one session.",
      "Testing yourself — retrieval practice — is more effective for long-term retention than re-reading. The act of recalling strengthens the memory trace.",
      "Growth mindset research shows that students who believe intelligence is developable — not fixed — perform significantly better, particularly after setbacks.",
      "The skills most at risk from automation are those that schools traditionally most reward: memorisation, following instructions, producing correct answers from clear questions.",
      "Reading for 20 minutes a day exposes a child to 1.8 million words per year. Children who read daily encounter 6 times more words than non-readers.",
      "Finland's education system — consistently top-ranked globally — starts formal education at age 7, emphasises play, and gives teachers professional autonomy equivalent to doctors.",
      "Most people forget approximately 70% of newly learned information within 24 hours without reinforcement — the 'forgetting curve' first described by Hermann Ebbinghaus in 1885.",
      "Curiosity is a better predictor of academic success than IQ.",
      "Learning a second language — particularly in childhood — produces measurable changes in brain structure and appears to delay cognitive decline by years.",
      "The Feynman Technique for learning: explain the concept in simple language as if teaching a child. Where you struggle to simplify, you've found the gap in your understanding.",
    ],
    perspectives: [
      "The most important things most schools don't teach: how to manage money, how to manage emotions, how to build relationships, how to think critically, and how to fail well.",
      "I think the biggest problem with formal education isn't the curriculum — it's that it trains people to perform knowledge rather than develop it. Performance and development are different activities.",
    ],
    conversation_starters: [
      "What's the most useful thing you've ever learned — and where did you learn it? I'd be surprised if the answer is 'school'.",
      "Is there a skill you've always wanted to develop but kept putting off? What's the actual barrier?",
      "How do you actually learn things now — not how you were taught to learn, but your real method?",
    ],
  },

  environment_nature: {
    label: 'Environment & nature',
    related_themes: ['environment','climate','nature','planet','sustainability','ecology','animals'],
    facts: [
      "The Earth's average temperature has increased approximately 1.1°C since pre-industrial times. The IPCC considers 1.5°C a threshold beyond which risks increase significantly.",
      "The Great Barrier Reef has lost approximately 50% of its corals since 1995 due to warming ocean temperatures causing bleaching events.",
      "Deforestation accounts for approximately 10% of global carbon emissions and is the leading cause of biodiversity loss.",
      "The Amazon rainforest produces approximately 20% of the world's oxygen and is often called 'the lungs of the Earth' — though a more accurate description is a net carbon sink.",
      "Renewable energy now produces 30% of global electricity, up from under 20% a decade ago. Solar power has dropped in cost by over 90% since 2010.",
      "Microplastics have been found in human blood, breast milk, and lung tissue. The long-term health effects are not yet fully understood.",
      "Insects pollinate approximately 75% of flowering plants and 35% of global food crop production. Insect populations have declined by up to 75% in some regions over the past 50 years.",
      "Rewilding — restoring ecosystems by reintroducing keystone species — has produced remarkable results. Reintroducing wolves to Yellowstone changed the behaviour of rivers.",
      "The ocean absorbs approximately 25% of CO2 emissions, but this absorption is making it more acidic — threatening marine ecosystems.",
      "Electric vehicles produce less lifecycle carbon than petrol vehicles in most regions, even accounting for battery production — but the margin depends heavily on the electricity grid.",
    ],
    perspectives: [
      "The climate conversation has a communication problem: the scale is too vast, the timelines too long, and the causation too diffuse for human psychology to respond to it the way it would to immediate physical danger.",
      "What strikes me about the environmental crisis: the solutions mostly exist. The barrier is almost entirely political and economic — a question of who bears the cost and who holds power.",
    ],
    conversation_starters: [
      "How do you personally relate to the climate crisis? Not what you think you should feel — what you actually feel when you think about it?",
      "Is there a natural place — a landscape, a body of water, a forest — that has genuinely moved you? What was that experience like?",
    ],
  },

  mental_health: {
    label: 'Mental health',
    related_themes: ['anxiety','depression','therapy','mental health','stress','trauma','healing','wellbeing'],
    facts: [
      "One in four people globally will experience a mental health condition in their lifetime. It remains one of the most under-resourced areas of healthcare.",
      "Depression is not sadness — it's a loss of the ability to feel the expected emotional response to situations. The absence of feeling, not its excess.",
      "Cognitive Behavioural Therapy (CBT) has the strongest evidence base of any talking therapy for anxiety and depression. It focuses on the relationship between thoughts, feelings, and behaviours.",
      "Anxiety is the brain's threat-detection system running on a setting calibrated for an ancestral environment — one where the physical threats were real and immediate. Most modern threats don't fit that profile.",
      "ADHD is not a deficit of attention — it's inconsistent regulation of attention. People with ADHD can hyperfocus intensely on things that interest them.",
      "Childhood trauma doesn't disappear — it becomes the physiological baseline from which the nervous system operates. Healing is not forgetting — it's building a new baseline.",
      "The social stigma around mental illness costs more in untreated suffering and economic productivity than the treatments themselves.",
      "Exercise, sleep, social connection, and meaningful activity are the four lifestyle factors with the strongest evidence base for mental health — none of them require a prescription.",
      "Grief is not a disorder. It's an appropriate response to loss. The pathologising of grief in modern medicine reflects cultural discomfort with pain, not clinical insight.",
      "Rates of anxiety and depression among young people have increased significantly across the developed world over the past two decades. The causes are debated but likely include social media, economic precarity, and declining social connection.",
    ],
    perspectives: [
      "Therapy is not for broken people. It's for people who want to understand themselves better. The framing that makes people avoid it is the framing that keeps them stuck.",
      "The mental health crisis is partly a meaning crisis. People are more materially comfortable than any generation in history and more anxious. Something about modern life is failing to deliver what humans actually need.",
    ],
    conversation_starters: [
      "How do you actually take care of your mental health — not the ideal answer, the real one?",
      "Is there something you're carrying right now that you haven't had a good conversation about? I ask because most people are.",
    ],
  },

  food_culture: {
    label: 'Food & culture',
    related_themes: ['food','cooking','culture','cuisine','eating','recipes','restaurants'],
    facts: [
      "Every culture in human history has had a shared meal tradition. Food is not just fuel — it's the primary site of community, ritual, and cultural identity for most of humanity.",
      "Fermentation — used in bread, cheese, wine, beer, kimchi, injera — is one of humanity's oldest food technologies, developed independently across cultures.",
      "Spices drove the Age of Exploration. Pepper, nutmeg, and cloves were once worth their weight in gold; the search for spice routes funded Columbus and Vasco da Gama.",
      "Jollof rice — the beloved West African dish — has a passionate international following and an even more passionate debate between Nigeria and Ghana about who makes it better.",
      "Japan has more Michelin-starred restaurants than any other country in the world.",
      "The Mediterranean diet — high in olive oil, vegetables, legumes, fish, and moderate wine — has the strongest evidence base of any dietary pattern for longevity.",
      "Ultra-processed foods — engineered for maximum palatability — now make up the majority of calories consumed in many Western countries and are strongly correlated with poor health outcomes.",
      "Ethiopia's injera — sour fermented flatbread — is both plate and utensil. Eating together from a shared injera is a profound act of communal connection in Ethiopian culture.",
      "The Maillard reaction — the chemical process that causes browning when food is cooked — is responsible for most of the flavour complexity in roasted, grilled, and baked foods.",
      "Food memory is among the most powerful form of emotional memory. A smell or taste can transport you to a specific moment decades past more vividly than almost any other trigger.",
    ],
    perspectives: [
      "Food is one of the most honest windows into a culture — what it values, what it has access to, what it celebrates, what it mourns over. You can understand a people better through their cuisine than through their politics.",
      "The loss of home cooking in industrialised societies is not just a health story — it's a community story. The kitchen was where culture was transmitted. Processing that transmission through screens and convenience has costs we're only beginning to measure.",
    ],
    conversation_starters: [
      "What's a food that immediately takes you somewhere — a specific memory, a person, a place? What's the story?",
      "If you had to eat one cuisine for the rest of your life, what would you choose and why? I'm judging you slightly on the answer.",
    ],
  },

  travel_geography: {
    label: 'Travel & geography',
    related_themes: ['travel','place','city','country','explore','culture','adventure','world'],
    facts: [
      "The world has 195 countries, over 7,000 living languages, and roughly 4,200 cities with populations over 100,000.",
      "Tokyo is the world's largest metropolitan area by population — approximately 37 million people.",
      "The Sahara Desert, at approximately 9.2 million square kilometres, is roughly the size of the United States.",
      "New Zealand and Iceland are the countries most often cited in 'quality of life' rankings — combining natural environment, social services, and political stability.",
      "The Amazon River discharges more water into the ocean than the next seven largest rivers combined.",
      "Antarctica is the world's largest desert (defined by precipitation) and the only continent with no permanent human population.",
      "Istanbul is the only city in the world that spans two continents.",
      "Lagos, Nigeria is projected to be the world's largest city by 2100 — potentially with over 80 million people in its metropolitan area.",
      "The Silk Road connected China to the Mediterranean for over 1,500 years, facilitating not just trade but the transfer of religions, technologies, and diseases.",
      "Travel consistently ranks as one of the top sources of reported happiness in retrospect — more than material purchases — but people reliably underestimate this when making spending decisions.",
    ],
    perspectives: [
      "Travel doesn't automatically make you more open-minded. It makes you more open-minded only if you encounter people rather than attractions — if you talk to people, eat where they eat, ask what they think.",
      "There's a difference between visiting a place and being somewhere. Most tourism is visiting. Being somewhere requires slowing down enough that the place actually gets to you.",
    ],
    conversation_starters: [
      "What's the place that's had the most unexpected effect on you — that surprised you, moved you, or changed how you saw something?",
      "Is there somewhere in the world you feel inexplicably drawn to — that you can't fully explain? What is it about that place?",
    ],
  },

  language_communication: {
    label: 'Language & communication',
    related_themes: ['language','communication','words','writing','speaking','culture','meaning'],
    facts: [
      "There are approximately 7,000 living languages in the world. Half are expected to be extinct by 2100 — one language dies every two weeks.",
      "The language you speak shapes how you perceive certain things. Speakers of languages with more colour terms distinguish more shades. Languages with different spatial vocabulary produce different mental maps.",
      "English has the largest vocabulary of any language — estimated at over 170,000 words in current use. The average person uses about 20,000-35,000.",
      "Writing was invented independently at least four times: in Mesopotamia, Egypt, China, and Mesoamerica.",
      "Non-verbal communication — tone, posture, gesture, facial expression — accounts for a significant portion of emotional communication in face-to-face interaction.",
      "The Sapir-Whorf hypothesis proposes that language shapes thought. Strong versions (language determines thought) are discredited. Weak versions (language influences thought) have significant empirical support.",
      "Swahili is the most widely spoken language in sub-Saharan Africa — spoken by over 200 million people across East Africa as a lingua franca.",
      "The written word allows ideas to persist beyond the person who had them — effectively creating a form of cognitive immortality for the ideas themselves.",
      "Bilingual people exhibit slightly different personalities in each language — because languages carry embedded cultural frameworks and emotional registers.",
      "The average reading speed is 200-300 words per minute. The average speaking speed is 130-150 words per minute. The average thinking speed is estimated at 1,000+ words per minute.",
    ],
    perspectives: [
      "Language is the most important technology humans ever developed, and the most invisible. It's so fundamental to thought that imagining thinking without it is nearly impossible.",
      "The death of a language is not just a linguistic event — it's the permanent loss of a unique way of organising reality, a way of being in the world that no translation can fully recover.",
    ],
    conversation_starters: [
      "Is there a word in another language that you wish English had — something that captures a feeling or concept that English doesn't quite reach?",
      "How do you communicate differently depending on who you're talking to? What does that reveal about you?",
    ],
  },

  law_justice: {
    label: 'Law & justice',
    related_themes: ['law','justice','rights','court','crime','ethics','equality','society'],
    facts: [
      "The concept of habeas corpus — that a person cannot be detained without due process — is one of the foundational ideas of modern legal systems, originating in English common law in 1215.",
      "The US has the world's highest incarceration rate — approximately 2 million people are imprisoned, disproportionately people of colour.",
      "The International Criminal Court (ICC) prosecutes individuals for genocide, war crimes, and crimes against humanity. It has limited enforcement power — it cannot arrest anyone without national cooperation.",
      "In most modern legal systems, corporations are legal persons — they can own property, sue, and be sued — though they cannot be imprisoned.",
      "The death penalty is used in 55 countries. The US is the only G7 nation that still executes prisoners.",
      "International humanitarian law — the laws of war — prohibits targeting civilians, torture, and certain weapons. Enforcement is extremely limited.",
      "In South Africa, the post-apartheid Truth and Reconciliation Commission offered amnesty in exchange for full disclosure. It was controversial but produced a model studied worldwide.",
      "Most disputes globally are resolved outside courts — through negotiation, mediation, or simply power. Courts handle a small fraction of actual conflicts.",
      "The legal drinking age, voting age, and age of criminal responsibility vary dramatically across countries — reflecting deeply different social philosophies about personhood and responsibility.",
      "Access to legal representation is so unequal in most countries that justice is effectively rationed by wealth. Public defenders in the US handle an average of 300-500 cases per year.",
    ],
    perspectives: [
      "Justice and the law are not the same thing. Laws can be unjust — apartheid was legal; slavery was legal. The question of what makes law legitimate has never been fully resolved.",
      "The criminal justice system in most countries is primarily a system of punishment, not rehabilitation. The evidence that punishment reduces crime is much weaker than most people assume.",
    ],
    conversation_starters: [
      "Is there a law — in your country or generally — that you think is clearly unjust? What would you change and how?",
      "When you think about justice, do you think primarily about punishment or about repair? That distinction reveals a lot about underlying philosophy.",
    ],
  },

  parenting_family: {
    label: 'Parenting & family',
    related_themes: ['family','parenting','children','parents','siblings','home','upbringing'],
    facts: [
      "The first three years of life produce more neural connections than any other period — the brain triples in size, and early experiences shape lifelong emotional and cognitive patterns.",
      "Authoritative parenting — warm but structured — consistently produces better outcomes across cultures than authoritarian (controlling) or permissive (unstructured) styles.",
      "Children learn language by processing hundreds of thousands of examples before producing a single word — absorption precedes production by years.",
      "The parent-child attachment formed in the first year of life shapes the template for all subsequent close relationships.",
      "Family dinner — regular shared meals — is one of the strongest predictors of positive outcomes for children: better grades, lower substance use, better mental health.",
      "Siblings influence personality development significantly — particularly birth order, spacing, and the unique relationship dynamics in each family system.",
      "Parents who acknowledge their mistakes openly raise children who are more likely to take responsibility for their own.",
      "The conversation around child-rearing has shifted significantly in the past generation — from obedience and compliance toward emotional intelligence and autonomy.",
      "Grandparents who are actively involved in grandchildren's lives produce measurable benefits for both parties — cognitive health for grandparents, emotional security for grandchildren.",
      "The experience of becoming a parent consistently rates as one of the most identity-altering events in adult life — regardless of whether it's reported as making people 'happier.'",
    ],
    perspectives: [
      "The most important thing parents give children isn't structure or opportunity — it's a model of how to be a person. Children learn far more from what parents do than what they say.",
      "The parent-child relationship is unusual because its explicit goal is to produce someone who no longer needs you. Learning to let go is built into the job description from the start.",
    ],
    conversation_starters: [
      "What did your parents get right? And what did they get wrong? I'm curious about both — the things you want to carry forward and the things you've decided to leave behind.",
      "What did you learn from your family — about love, conflict, money, identity — that you're still working out whether it's true?",
    ],
  },

  leadership_influence: {
    label: 'Leadership & influence',
    related_themes: ['leadership','influence','power','management','organisation','vision','team'],
    facts: [
      "Research on leadership consistently finds that emotional intelligence — not IQ or technical skill — is the primary differentiator of outstanding leaders.",
      "Psychological safety — the belief that you can speak up without punishment — is the single strongest predictor of team performance, according to Google's Project Aristotle.",
      "The most common leadership failure is not lack of competence but lack of self-awareness.",
      "Nelson Mandela's leadership approach — reconciliation over revenge — is studied in business schools as a model of values-based leadership under pressure.",
      "Command-and-control leadership structures are consistently less effective than distributed, trust-based ones in complex, creative environments.",
      "The best predictor of whether someone becomes a leader is not personality type — it's willingness to take initiative in uncertain situations.",
      "Charisma is largely learned behaviour — specifically the ability to project presence, warmth, and conviction simultaneously. It can be developed.",
      "Studies show that the most effective leaders spend about 80% of their time on communication — listening, speaking, writing — rather than decision-making.",
      "Power changes the brain. People with power consistently show reduced ability to take others' perspectives and increased willingness to take risks.",
      "Servant leadership — where the leader's primary function is enabling others to do their best work — consistently outperforms ego-driven leadership in long-term outcomes.",
    ],
    perspectives: [
      "Power doesn't corrupt people — it amplifies what's already there. The test of character is who you become when you have more power than accountability.",
      "The best leaders I can identify in human history were those who understood that their purpose was not to be served but to create conditions where others could do their best work.",
    ],
    conversation_starters: [
      "Who's the best leader you've personally encountered — not famous, just someone in your actual life who was excellent at bringing out the best in people? What did they do differently?",
      "What's the leadership quality you most admire in others — and most struggle to embody yourself?",
    ],
  },

  entrepreneurship: {
    label: 'Business & entrepreneurship',
    related_themes: ['business','startup','entrepreneur','innovation','risk','money','company'],
    facts: [
      "Approximately 90% of startups fail. The most common reasons: no market need, running out of money, and team problems — in that order.",
      "Most successful entrepreneurs failed significantly before their breakthrough. Jeff Bezos, Oprah Winfrey, and Walt Disney all experienced major early failures.",
      "Africa has the world's highest rate of entrepreneurship by necessity — in many countries, creating your own work is the primary economic strategy.",
      "The most valuable companies in the world — Apple, Microsoft, Google, Amazon — were all started in garages or dorm rooms by people under 30.",
      "Network effects — where a product becomes more valuable as more people use it — are the primary driver of monopoly power in the digital economy.",
      "Revenue without profit is a story. Profit is the actual business. Many celebrated startups burned billions in investor capital before anyone asked the basic question.",
      "The global informal economy — unregistered businesses, cash work, micro-enterprises — employs more people worldwide than the formal economy.",
      "First-mover advantage is often overstated. Google wasn't the first search engine. Facebook wasn't the first social network. Execution usually matters more than timing.",
      "Customer discovery — deeply understanding who you're building for before you build — is the most important and least practised discipline in new business.",
      "The average age of a successful startup founder is 45 — significantly older than the Silicon Valley mythology of 20-something visionaries.",
    ],
    perspectives: [
      "Most business failure comes down to one thing: building something nobody actually needs, or needs in the form you built it. The solution — talking to real customers before building — is obvious and consistently ignored.",
      "There's something I find genuinely admirable about entrepreneurship: the willingness to create something from nothing and bear the full weight of that uncertainty. Most people want the outcome without the exposure.",
    ],
    conversation_starters: [
      "Is there an idea you've had — for a business, a product, a service — that you've never acted on? What's the real reason you haven't?",
      "What's the difference between a good business idea and a good business? More people conflate these than you'd think.",
    ],
  },
}

// ── WORLD PERSPECTIVES (timeless-adjacent, Echo's take) ───────────────────────
export const WORLD_UPDATES = [
  "Something worth thinking about: the jobs most at risk from AI are not manual labour but routine cognitive tasks — data entry, standard analysis, templated communication. The skills hardest to automate are creativity, complex judgment, and genuine human connection. The question is whether education systems are training for what's coming.",
  "In neuroscience right now, one of the most interesting conversations is about whether the brain is a receiver of reality or a generator of it. The evidence increasingly suggests it's mostly generating — prediction first, sensory input second. That has implications for almost everything.",
  "The global conversation about mental health is shifting from 'treatment' toward 'prevention' — asking why rates of anxiety and depression are climbing rather than just how to treat them. Some of the answers point uncomfortably toward how modern life is structured.",
  "Africa's technology sector is one of the most underreported growth stories in the world. Mobile money — pioneered in Kenya with M-Pesa — leapfrogged traditional banking infrastructure and now processes billions. This model is being studied globally.",
  "Something from the world of urban design: cities designed for walking and community consistently produce more social trust and lower depression rates than car-dependent sprawl. The built environment shapes consciousness more than most people realise.",
  "The conversation about longevity — living longer in better health — is shifting from genetics to lifestyle. The factors most associated with healthy long life: not smoking, moderate or no alcohol, consistent movement, a sense of purpose, and close relationships.",
  "Education research keeps arriving at the same uncomfortable conclusion: the things schools reward most — compliance, memorisation, producing correct answers — are the things least relevant to a meaningful life and increasingly irrelevant in an economy with AI.",
  "What's happening in renewable energy is genuinely extraordinary. Solar power cost has fallen over 90% in a decade. The barrier to the energy transition is no longer technological or even economic — it's political.",
  "The global water crisis is one of the least-discussed coming challenges. Aquifers that took thousands of years to fill are being depleted in decades. Several major cities are projected to face severe water shortages within twenty years.",
  "Something from behavioural economics: the best financial decision most people can make isn't investment strategy — it's automating savings before they can be spent. Willpower is not a reliable financial instrument.",
]

// ── DOMAIN MATCHING ────────────────────────────────────────────────────────────
export const getDomainForProfile = (profile, graph) => {
  const interests = [
    ...(profile?.values || []),
    ...(profile?.interests || []),
    ...(profile?.recurringThemes || []),
    ...(profile?.goals || []),
    ...(graph?.topConcepts || []).slice(0, 5).map(c => c.concept),
  ].map(s => (s || '').toLowerCase())

  const scores = {}
  for (const [key, domain] of Object.entries(DOMAINS)) {
    scores[key] = (domain.related_themes || []).filter(t =>
      interests.some(i => i.includes(t) || t.includes(i))
    ).length
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const topKey = sorted[0]?.[1] > 0 ? sorted[0][0] : null
  const keys = Object.keys(DOMAINS)
  return DOMAINS[topKey || keys[Math.floor(Math.random() * keys.length)]]
}

// ── KNOWLEDGE SHARE BUILDER ───────────────────────────────────────────────────
export const getKnowledgeShare = (profile, graph, mode = 'fact') => {
  const domain = getDomainForProfile(profile, graph)

  if (mode === 'conversation_starter') {
    return { text: pick(domain.conversation_starters), domain: domain.label, type: 'conversation_starter' }
  }
  if (mode === 'perspective') {
    return { text: pick(domain.perspectives), domain: domain.label, type: 'perspective' }
  }
  if (mode === 'world_update') {
    return { text: pick(WORLD_UPDATES), domain: 'world', type: 'world_update' }
  }
  return { text: pick(domain.facts), domain: domain.label, type: 'fact' }
}

export const buildKnowledgeMessage = (profile, graph, preferredMode = null) => {
  const modes = ['fact', 'perspective', 'conversation_starter', 'world_update']
  const mode  = preferredMode || modes[Math.floor(Math.random() * modes.length)]
  const share = getKnowledgeShare(profile, graph, mode)
  const name  = profile?.name ? `${profile.name}. ` : ''

  const intros = {
    fact: [
      "Something I came across that I thought was worth sharing.",
      "Here's something I find genuinely interesting.",
      "I want to share something — not because it's directly about you, just because it matters.",
      "Something that's been on my mind.",
    ],
    perspective: [
      "Something I've been thinking about — and I want to say it out loud.",
      "I have a perspective I want to share. You don't have to agree.",
      "Something I want to offer — just a thought.",
    ],
    conversation_starter: [
      "Something I want to bring up — ",
      "I've been sitting with a question I want to ask you.",
      "There's something I want to explore with you, if you're open to it.",
    ],
    world_update: [
      "Something from the wider world I think is worth knowing about.",
      "I want to keep you updated on something.",
      "Here's something happening in the world I've been thinking about.",
    ],
  }

  const intro = pick(intros[mode] || intros.fact)
  if (mode === 'conversation_starter') return `${name}${share.text}`
  return `${name}${intro}\n\n${share.text}`
}

// ── DIRECT DOMAIN QUERY — for factual question routing ────────────────────────
// Called by responder.js when parser detects isFactualQuestion = true.
// Returns a rich object with fact + perspective + conversation_starter
// so responder can build a complete, grounded response in one call.
//
// Usage:
//   const result = queryKnowledge('psychology')
//   → { fact, perspective, conversation_starter, label, domain }

// Maps parser's factualDomain keys → knowledge.js DOMAINS keys
const DOMAIN_KEY_MAP = {
  psychology:    'psychology',
  philosophy:    'philosophy',
  history:       'history',
  physics:       'physics',
  biology:       'biology',
  tech:          'technology',
  economics:     'economics',
  africa:        'africa',
  environment:   'environment',
  health:        'health',
  sociology:     'sociology',
  neuroscience:  'psychology',   // maps to closest domain
  politics:      'history',      // maps to closest
  education:     'sociology',
  entrepreneurship: 'economics',
}

export const queryKnowledge = (factualDomain, mode = 'all') => {
  // Resolve to a known DOMAINS key
  const resolvedKey = DOMAIN_KEY_MAP[factualDomain] || null
  const keys = Object.keys(DOMAINS)

  // Find the matching domain object, or fall back to random
  let domain = null
  if (resolvedKey && DOMAINS[resolvedKey]) {
    domain = DOMAINS[resolvedKey]
  } else {
    // Try partial match on label
    const labelMatch = Object.values(DOMAINS).find(d =>
      d.label?.toLowerCase().includes(factualDomain?.toLowerCase() || '')
    )
    domain = labelMatch || DOMAINS[keys[Math.floor(Math.random() * keys.length)]]
  }

  if (!domain) return null

  const fact               = pick(domain.facts               || [])
  const perspective        = pick(domain.perspectives        || [])
  const conversation_starter = pick(domain.conversation_starters || [])

  if (mode === 'fact')               return { fact, label: domain.label, domain: factualDomain }
  if (mode === 'perspective')        return { perspective, label: domain.label, domain: factualDomain }
  if (mode === 'conversation_starter') return { conversation_starter, label: domain.label, domain: factualDomain }

  // mode === 'all' — return everything, let the caller compose
  return {
    fact,
    perspective,
    conversation_starter,
    label: domain.label,
    domain: factualDomain,
  }
}

// ── FACTUAL RESPONSE BUILDER — composes Echo's full reply to a factual question ──
// Wraps queryKnowledge() with Echo's voice: fact → perspective → open question.
// responder.js calls this directly.
export const buildFactualResponse = (factualDomain, userQuestion = '') => {
  const data = queryKnowledge(factualDomain, 'all')
  if (!data) return null

  const { fact, perspective, conversation_starter, label } = data

  // Intro lines that frame factual sharing without sounding like a textbook
  const intros = [
    `Here's something solid on that —`,
    `I actually know a bit about ${label?.toLowerCase() || 'this'}.`,
    `Let me give you the real picture on that.`,
    `Good question — here's what the evidence actually says:`,
    `I've got something worth sharing on this:`,
    `On that specifically —`,
  ]
  const bridges = [
    `\n\nAnd here's my honest take on it:`,
    `\n\nThe part I find most interesting:`,
    `\n\nWhat that actually means, in my view:`,
    `\n\nWhere I land on this:`,
  ]

  const intro  = pick(intros)
  const bridge = pick(bridges)

  // Always: fact + perspective. Conditionally: conversation starter.
  const parts = [`${intro}\n\n${fact}`, `${bridge}\n\n${perspective}`]
  if (conversation_starter && Math.random() < 0.65) {
    parts.push(`\n\n${conversation_starter}`)
  }
  return parts.join('')
}
