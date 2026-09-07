import { NextResponse } from 'next/server'
import { executeCirclePayment } from '../../../../lib/circle-worker'

export async function POST(request) {
  try {
    const body = await request.json()
    if (!body.intent) return NextResponse.json({ ok: false, error: 'Payment intent is required.' }, { status: 400 })
    const result = await executeCirclePayment({ paymentIntent: body.intent, approved: body.approved === true })
    return NextResponse.json({ ok: true, execution: result })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || 'Circle execution failed.' }, { status: 500 })
  }
}
