export function summarizeCampaign({ leads = [], payments = [], sent = 0, replies = 0 }) {
  const total = leads.length
  const qualified = leads.filter(l => Number(l.intent_score ?? l.radar_score ?? 0) >= 80).length
  const spend = payments.reduce((sum, p) => sum + Number(p.amount_usdc || 0), 0)
  const replyRate = sent ? Math.round((replies / sent) * 100) : 0
  const costPerQualified = qualified ? Number((spend / qualified).toFixed(4)) : null
  return { totalLeads: total, qualified, spendUsdc: Number(spend.toFixed(4)), sent, replies, replyRate, costPerQualified }
}
