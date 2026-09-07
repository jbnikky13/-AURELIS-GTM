export function buildLearningProfile({ leads = [], outcomes = [], payments = [] }) {
  const rows = leads.map((lead) => {
    const outcome = outcomes.find((o) => o.lead_id === lead.id || o.company === lead.company) || {}
    return { ...lead, outcome: outcome.result || 'unknown', converted: outcome.result === 'converted' ? 1 : 0 }
  })
  const converted = rows.filter((r) => r.converted)
  const avgConvertedScore = converted.length ? Math.round(converted.reduce((s, r) => s + Number(r.radar_score || r.intent_score || 0), 0) / converted.length) : null
  const winningSignals = converted.flatMap((r) => Array.isArray(r.evidence) ? r.evidence : []).slice(0, 50)
  const spend = payments.reduce((s, p) => s + Number(p.amount_usdc || 0), 0)
  return { sampleSize: rows.length, conversions: converted.length, conversionRate: rows.length ? Number((converted.length / rows.length).toFixed(4)) : 0, avgConvertedScore, winningSignals, spendUsdc: Number(spend.toFixed(4)), recommendations: buildRecommendations({ rows, avgConvertedScore }) }
}
function buildRecommendations({ rows, avgConvertedScore }) {
  const recommendations = []
  if (!rows.length) recommendations.push('Collect outcome data before changing targeting.')
  if (avgConvertedScore !== null && avgConvertedScore >= 80) recommendations.push('Prioritize opportunities scoring 80+ on the next run.')
  if (avgConvertedScore !== null && avgConvertedScore < 65) recommendations.push('Broaden research and validate the ICP before increasing outreach volume.')
  if (rows.filter((r) => r.outcome === 'unknown').length) recommendations.push('Resolve unknown outcomes to improve learning confidence.')
  return recommendations
}
