import { NextResponse } from 'next/server'
import { canSpend } from '../../../lib/agent-policy'
import { buildPaymentIntent } from '../../../lib/payment-intent'

export async function POST(request) {
  try {
    const body = await request.json()
    const budget = Number(body.budget ?? 25)
    const spent = Number(body.spent ?? 0)
    const amount = Number(body.amount ?? 0)
    const policy = canSpend({ amount, campaignBudget: budget, spent, maxSinglePayment: Number(process.env.AURELIS_MAX_SINGLE_PAYMENT_USDC || 2), approvalThreshold: Number(process.env.AURELIS_REQUIRE_APPROVAL_ABOVE_USDC || 1) })
    const intent = buildPaymentIntent({ policy, service: body.service, amount, network: process.env.CIRCLE_NETWORK || 'base-sepolia', justification: body.justification })
    return NextResponse.json({ ok: true, policy, paymentIntent: intent })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || 'Payment intent failed.' }, { status: 400 })
  }
}
