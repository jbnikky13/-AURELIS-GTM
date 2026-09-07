import { NextResponse } from 'next/server'
import { evaluatePayment } from '../../../../lib/payment-gate'

export async function POST(request) {
  try {
    const body = await request.json()
    const result = evaluatePayment({ amount: body.amount_usdc, budget: body.budget_usdc, spent: body.spent_usdc, maxSingle: Number(process.env.AURELIS_MAX_SINGLE_PAYMENT_USDC || 2), approvalAbove: Number(process.env.AURELIS_REQUIRE_APPROVAL_ABOVE_USDC || 1), approved: body.approved === true })
    return NextResponse.json({ ok: true, payment: { ...result, service: body.service || 'GTM intelligence', amount_usdc: Number(body.amount_usdc), network: process.env.CIRCLE_NETWORK || 'base-sepolia' } })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Payment preparation failed.' }, { status: 500 }) }
}
