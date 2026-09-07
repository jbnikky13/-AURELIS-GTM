import { NextResponse } from 'next/server'
import { buildLearningProfile } from '../../../lib/learning-loop'
export async function POST(request) {
  try {
    const body = await request.json()
    const profile = buildLearningProfile({ leads: Array.isArray(body.leads) ? body.leads.slice(0, 1000) : [], outcomes: Array.isArray(body.outcomes) ? body.outcomes.slice(0, 1000) : [], payments: Array.isArray(body.payments) ? body.payments.slice(0, 500) : [] })
    return NextResponse.json({ ok: true, profile })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Learning analysis failed.' }, { status: 500 }) }
}
