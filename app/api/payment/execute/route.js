import { NextResponse } from 'next/server'
import { executeCirclePayment } from '../../../../lib/circle-worker'

export async function POST(request) {
  try {
    const body = await request.json()
    const paymentIntent = body.paymentIntent || body.intent
    if (!paymentIntent?.id || !paymentIntent?.amount_usdc) return NextResponse.json({ ok: false, error: 'A valid payment intent is required.' }, { status: 400 })
    const result = await executeCirclePayment({ paymentIntent, approved: body.approved === true, destinationAddress: body.destinationAddress })
    return NextResponse.json({ ok: true, execution: result })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || 'Circle execution failed.' }, { status: 400 })
  }
}
