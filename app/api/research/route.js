import { NextResponse } from 'next/server'
import { buildOutreach, buildResearchPack } from '../../../lib/research-engine'

function clean(v, max = 4000) { return String(v || '').trim().slice(0, max) }

export async function POST(request) {
  try {
    const body = await request.json()
    const product = clean(body.product)
    const market = clean(body.market)
    const targetUrl = clean(body.targetUrl, 1000)
    const companies = Array.isArray(body.companies) ? body.companies.slice(0, 100) : []
    if (!product || !market) return NextResponse.json({ ok: false, error: 'Product and target market are required.' }, { status: 400 })
    const pack = buildResearchPack({ product, market, targetUrl, companies })
    const top = pack.opportunities[0]
    const outreach = top ? buildOutreach({ product, prospect: { name: top.name, company: top.name || top.company }, evidence: top.signals || [] }) : null
    return NextResponse.json({ ok: true, research: pack, outreach })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || 'Research failed.' }, { status: 500 })
  }
}
