const STOPWORDS = new Set(['the','and','for','with','that','this','from','your','into','are','you','our','their','have','has','will','but','not','use','using','who','what','when','where','how','a','an','to','of','in','on','is','it'])

function words(text) {
  return [...new Set(String(text || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOPWORDS.has(w)))].slice(0, 24)
}

function scoreCompany(company, market, product) {
  const text = `${company.name || company.company || ''} ${company.description || ''} ${company.industry || ''}`.toLowerCase()
  const terms = words(`${market} ${product}`)
  const matches = terms.filter(term => text.includes(term))
  const hiring = /hiring|jobs|careers|recruiting/.test(text)
  const growth = /funding|raised|growth|expansion|launch|scale/.test(text)
  const score = Math.min(98, 48 + matches.length * 8 + (hiring ? 10 : 0) + (growth ? 10 : 0))
  return { ...company, score, intent: score >= 80 ? 'High' : score >= 65 ? 'Medium' : 'Low', evidence: matches.length ? `Matched public-market terms: ${matches.slice(0, 5).join(', ')}` : 'No strong keyword evidence found; treat as a hypothesis.', signals: [hiring && 'Hiring/growth signal', growth && 'Expansion/funding signal'].filter(Boolean) }
}

export function buildResearchPack({ product, market, targetUrl, companies = [] }) {
  const researched = companies.map(c => scoreCompany(c, market, product)).sort((a,b) => b.score - a.score)
  return { target: targetUrl || null, methodology: 'Public-evidence-first. Scores are hypotheses unless backed by supplied public evidence.', opportunities: researched, nextStep: researched[0] ? `Investigate ${researched[0].name || researched[0].company} first because it has the strongest current fit/intent score.` : 'Discover public company signals before requesting paid enrichment.' }
}

export function buildOutreach({ product, prospect, evidence = [] }) {
  const name = prospect?.name || 'there'
  const company = prospect?.company || 'your team'
  const proof = evidence[0] || 'your current growth motion'
  return { subject: `A GTM idea for ${company}`, message: `Hi ${name},\n\nI noticed ${proof}. We built ${product} to help teams turn GTM research into qualified opportunities without stitching together multiple tools.\n\nWould it be useful to compare notes on how ${company} is handling this today?\n\nBest,\nAURELIS`, personalizationBasis: evidence.length ? evidence : ['Generic draft — verify public evidence before sending.'] }
}
