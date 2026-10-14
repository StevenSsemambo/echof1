// ECHO Knowledge Graph — Module 2
// Builds a living map of who you are. Grows every conversation.

import { tokenize } from './parser.js'

const CATEGORIES = {
  people:     ['friend','family','mother','father','sister','brother','partner','wife','husband','colleague','boss','teacher','mentor'],
  places:     ['home','work','school','office','hospital','church','gym','city','country','university'],
  emotions:   ['happy','sad','angry','afraid','love','hate','joy','fear','hope','grief','anxiety','peace','stress'],
  values:     ['honest','loyal','kind','strong','brave','creative','independent','caring','responsible','ambitious','patient'],
  struggles:  ['money','health','relationship','career','family','purpose','identity','confidence','failure','rejection','loss'],
  goals:      ['success','happiness','freedom','security','growth','achievement','balance','meaning','connection','creativity'],
  activities: ['work','study','exercise','write','read','travel','create','build','learn','practice','meditate'],
}

export const buildKnowledgeGraph = (history) => {
  const nodes = {}
  const edges = {}

  for (const msg of history) {
    if (msg.role !== 'user') continue
    const tokens = tokenize(msg.content)
    const ts = msg.ts || new Date()

    tokens.forEach(token => {
      let category = 'general'
      for (const [cat, words] of Object.entries(CATEGORIES)) {
        if (words.some(w => token.includes(w) || w.includes(token))) { category = cat; break }
      }
      if (!nodes[token]) nodes[token] = { weight: 0, category, firstSeen: ts, lastSeen: ts, count: 0 }
      nodes[token].weight += 1
      nodes[token].count  += 1
      nodes[token].lastSeen = ts
    })

    // Co-occurrence edges
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < Math.min(i + 5, tokens.length); j++) {
        const key = [tokens[i], tokens[j]].sort().join('|')
        if (!edges[key]) edges[key] = { weight: 0 }
        edges[key].weight += 1
      }
    }
  }

  const topConcepts = Object.entries(nodes)
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, 30)
    .map(([concept, data]) => ({ concept, ...data }))

  const clusters = {}
  topConcepts.forEach(({ concept, category }) => {
    if (!clusters[category]) clusters[category] = []
    clusters[category].push(concept)
  })

  return { nodes, edges, topConcepts, clusters }
}
