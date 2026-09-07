import { createClient } from '@supabase/supabase-js'

export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function persistMission({ input, result }) {
  const supabase = getAdminSupabase()
  if (!supabase) return { persisted: false, reason: 'Supabase server credentials are not configured.' }
  const campaign = { name: input.name || `${input.market} GTM Mission`, product: input.product, target_market: input.market, target_url: input.targetUrl || null, goal: input.goal, budget_usdc: result.mission.budget, spent_usdc: result.mission.spent, status: result.mission.status }
  const { data: campaignRow, error: campaignError } = await supabase.from('campaigns').insert(campaign).select('id').single()
  if (campaignError) throw campaignError
  const leads = (result.opportunities || []).map((o) => ({ campaign_id: campaignRow.id, company: o.company || o.name || 'Unknown', public_url: o.url || null, evidence: o.evidence || o.signals || [], fit_score: Number(o.fit_score ?? o.score ?? 0), intent_score: Number(o.intent_score ?? o.score ?? 0), intent: o.intent || 'Unknown' }))
  if (leads.length) { const { error } = await supabase.from('leads').insert(leads); if (error) throw error }
  if (result.paymentIntent) { const { error } = await supabase.from('payment_intents').insert({ campaign_id: campaignRow.id, service: result.paymentIntent.service, amount_usdc: result.paymentIntent.amount_usdc, status: result.paymentIntent.status, network: result.paymentIntent.network, justification: result.paymentIntent.justification }); if (error) throw error }
  const { error: runError } = await supabase.from('agent_runs').insert({ campaign_id: campaignRow.id, stage: 'mission', status: result.mission.status, input, output: result })
  if (runError) throw runError
  return { persisted: true, campaignId: campaignRow.id }
}
