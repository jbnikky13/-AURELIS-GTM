import { NextResponse } from 'next/server'
import { getAdminSupabase } from '../../../../lib/gtm-persistence'
import { evaluatePayment } from '../../../../lib/payment-gate'

export async function POST(request) {
  try {
    const body = await request.json()
    const supabase = getAdminSupabase()
    if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase server credentials are not configured.' }, { status: 503 })
    const { data: intent, error } = await supabase.from('payment_intents').select('*').eq('id', body.payment_intent_id).single()
    if (error || !intent) return NextResponse.json({ ok: false, error: 'Payment intent not found.' }, { status: 404 })
    const check = evaluatePayment({ amount: intent.amount_usdc, budget: body.budget_usdc ?? intent.amount_usdc, spent: body.spent_usdc ?? 0, approved: true })
    if (check.status === 'blocked') return NextResponse.json({ ok: false, error: check.reason }, { status: 409 })
    const now = new Date().toISOString()
    const { data: updated, error: updateError } = await supabase.from('payment_intents').update({ status: 'approved', approved_at: now, approved_by: body.approved_by || 'operator' }).eq('id', intent.id).select('*').single()
    if (updateError) throw updateError
    return NextResponse.json({ ok: true, payment: { ...updated, execution: 'awaiting_circle_worker' } })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Approval failed.' }, { status: 500 }) }
}
