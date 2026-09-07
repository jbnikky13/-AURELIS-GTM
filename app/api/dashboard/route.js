import { NextResponse } from 'next/server'
import { getAdminSupabase } from '../../../lib/gtm-persistence'

export async function GET() {
  try {
    const supabase = getAdminSupabase()
    if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase server credentials are not configured.' }, { status: 503 })
    const [campaigns, leads, payments, runs] = await Promise.all([
      supabase.from('campaigns').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('leads').select('*').order('intent_score', { ascending: false }).limit(500),
      supabase.from('payment_intents').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('agent_runs').select('*').order('created_at', { ascending: false }).limit(100)
    ])
    const error = campaigns.error || leads.error || payments.error || runs.error
    if (error) throw error
    const spend = payments.data.reduce((s, p) => s + Number(p.amount_usdc || 0), 0)
    return NextResponse.json({ ok: true, data: { campaigns: campaigns.data, leads: leads.data, payments: payments.data, runs: runs.data, summary: { campaigns: campaigns.data.length, leads: leads.data.length, highIntent: leads.data.filter(l => Number(l.intent_score || 0) >= 80).length, spendUsdc: Number(spend.toFixed(4)), pendingApprovals: payments.data.filter(p => p.status === 'awaiting_approval').length } } })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Dashboard load failed.' }, { status: 500 }) }
}
