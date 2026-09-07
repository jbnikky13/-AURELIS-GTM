const SIGNAL_WEIGHTS = { fit: 0.35, intent: 0.35, evidence: 0.2, accessibility: 0.1 }
export function scoreOpportunity(lead = {}) {
  const fit = clamp(lead.fit_score ?? lead.score)
  const intent = clamp(lead.intent_score ?? lead.score)
  const evidenceCount = Array.isArray(lead.evidence) ? lead.evidence.length : Array.isArray(lead.signals) ? lead.signals.length : 0
  const evidence = Math.min(100, evidenceCount * 20)
  const accessibility = lead.public_url ? 100 : 40
  const score = Math.round(fit * SIGNAL_WEIGHTS.fit + intent * SIGNAL_WEIGHTS.intent + evidence * SIGNAL_WEIGHTS.evidence + accessibility * SIGNAL_WEIGHTS.accessibility)
  return { ...lead, radar_score: score, priority: score >= 80 ? 'P1' : score >= 65 ? 'P2' : 'P3', why: buildWhy({ fit, intent, evidence, accessibility }) }
}
export function buildRadar(leads = []) { return leads.map(scoreOpportunity).sort((a, b) => b.radar_score - a.radar_score) }
function clamp(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0 }
function buildWhy({ fit, intent, evidence, accessibility }) {
  const reasons = []
  if (fit >= 80) reasons.push('strong ICP fit')
  if (intent >= 80) reasons.push('high buying intent')
  if (evidence >= 60) reasons.push('multiple evidence signals')
  if (accessibility >= 80) reasons.push('public profile available')
  return reasons.length ? reasons.join(', ') : 'insufficient evidence; research before outreach'
}
