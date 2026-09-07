import { NextResponse } from 'next/server'
import { canSpend } from '../../../lib/agent-policy'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const budget = Number(body.budget ?? 25)
  const spent = Number(body.spent ?? 0)
  const requestedSpend = Number(body.requestedSpend ?? 0.75)
  const policy = canSpend({ amount: requestedSpend, campaignBudget: budget, spent, maxSinglePayment: 2, approvalThreshold: 1 })
  return NextResponse.json({ ok: true, mode: process.env.AURELIS_AGENT_MODE || 'mock', mission: { status: policy.allowed ? 'authorized' : policy.requiresApproval ? 'approval_required' : 'blocked', requestedSpend, policy, next: ['discover', 'investigate', 'score', 'engage', 'learn'] }, note: 'Circle Agent Wallet execution is isolated to the agent worker.' })
}
