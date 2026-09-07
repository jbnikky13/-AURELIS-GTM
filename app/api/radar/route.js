import { NextResponse } from 'next/server'
import { buildRadar } from '../../../lib/opportunity-radar'
export async function POST(request) {
  try {
    const body = await request.json()
    const radar = buildRadar(Array.isArray(body.leads) ? body.leads.slice(0, 500) : [])
    const stats = { total: radar.length, p1: radar.filter(x => x.priority === 'P1').length, p2: radar.filter(x => x.priority === 'P2').length, highIntent: radar.filter(x => Number(x.intent_score) >= 80).length }
    return NextResponse.json({ ok: true, stats, radar })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Radar calculation failed.' }, { status: 500 }) }
}
