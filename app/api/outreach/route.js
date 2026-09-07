import { NextResponse } from 'next/server'
import { buildOutreach } from '../../../lib/research-engine'

export async function POST(request) {
  try {
    const body = await request.json()
    if (!body.product || !body.prospect) return NextResponse.json({ ok: false, error: 'Product and prospect are required.' }, { status: 400 })
    const result = buildOutreach({ product: String(body.product).slice(0, 1000), prospect: body.prospect, evidence: Array.isArray(body.evidence) ? body.evidence.slice(0, 10) : [] })
    return NextResponse.json({ ok: true, outreach: result, requiresHumanReview: true })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Outreach generation failed.' }, { status: 500 }) }
}
