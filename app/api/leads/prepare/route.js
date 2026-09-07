import { NextResponse } from 'next/server'
import { dedupeLeads } from '../../../../lib/lead-pipeline'

export async function POST(request) {
  try {
    const body = await request.json()
    const leads = dedupeLeads(Array.isArray(body.leads) ? body.leads.slice(0, 500) : [])
    return NextResponse.json({ ok: true, count: leads.length, leads })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || 'Lead preparation failed.' }, { status: 500 })
  }
}
