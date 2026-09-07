import { NextResponse } from 'next/server'
import { getAdminSupabase } from '../../../../lib/gtm-persistence'

export async function GET(request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Payment intent id is required.' }, { status: 400 })
    const supabase = getAdminSupabase()
    if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase server credentials are not configured.' }, { status: 503 })
    const { data, error } = await supabase.from('payment_intents').select('*').eq('id', id).single()
    if (error || !data) return NextResponse.json({ ok: false, error: 'Payment intent not found.' }, { status: 404 })
    return NextResponse.json({ ok: true, payment: data })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Status lookup failed.' }, { status: 500 }) }
}
