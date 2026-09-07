export function normalizeLead(input = {}) {
  const company = String(input.company || input.name || 'Unknown').trim().slice(0, 200)
  const person = String(input.person_name || input.person || '').trim().slice(0, 120) || null
  const role = String(input.role || input.title || '').trim().slice(0, 160) || null
  const url = String(input.public_url || input.url || '').trim().slice(0, 1000) || null
  const evidence = Array.isArray(input.evidence) ? input.evidence.slice(0, 12) : []
  return { company, person_name: person, role, public_url: url, evidence, fit_score: clamp(input.fit_score ?? input.score), intent_score: clamp(input.intent_score ?? input.score), intent: intentLabel(input.intent_score ?? input.score), contact_status: 'unknown', outreach_status: 'draft' }
}
function clamp(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0 }
function intentLabel(score) { const n = Number(score); return n >= 80 ? 'High' : n >= 65 ? 'Medium' : 'Low' }
export function rankLeads(leads = []) { return leads.map(normalizeLead).sort((a,b) => (b.intent_score + b.fit_score) - (a.intent_score + a.fit_score)) }
export function dedupeLeads(leads = []) { const seen = new Set(); return rankLeads(leads).filter(l => { const key = `${l.company.toLowerCase()}|${l.person_name?.toLowerCase() || ''}`; if (seen.has(key)) return false; seen.add(key); return true }) }
