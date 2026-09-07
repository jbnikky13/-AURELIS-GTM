import { NextResponse } from 'next/server'
import { summarizeCampaign } from '../../../../lib/campaign-analytics'
export async function POST(request) {
  try {
    const body = await request.json()
    return NextResponse.json({ ok: true, analytics: summarizeCampaign({ leads: Array.isArray(body.leads) ? body.leads : [], payments: Array.isArray(body.payments) ? body.payments : [], sent: body.sent || 0, replies: body.replies || 0 }) })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Analytics failed.' }, { status: 500 }) }
}
