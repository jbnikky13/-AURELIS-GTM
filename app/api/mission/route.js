import { NextResponse } from 'next/server'
import { canSpend } from '../../../lib/agent-policy'

const fallbackSignals = [
  { company: 'Northstar AI', signal: 'Recent GTM hiring suggests a growing outbound motion', score: 92, intent: 'High', reason: 'Hiring multiple revenue roles while expanding the sales motion.' },
  { company: 'Orbit Labs', signal: 'Enterprise expansion creates a likely need for pipeline automation', score: 87, intent: 'High', reason: 'Enterprise positioning usually increases research and prospecting workload.' },
  { company: 'Meridian Cloud', signal: 'Growth team is evaluating outbound tooling', score: 81, intent: 'Medium', reason: 'Tooling change is a strong timing signal for a GTM workflow product.' }
]
function clean(value, max = 5000) { return String(value || '').trim().slice(0, max) }
function number(value, fallback = 0) { const n = Number(value); return Number.isFinite(n) ? n : fallback }

async function generateWithGemini(input) {
  if (!process.env.GEMINI_API_KEY) return null
  const prompt = `You are AURELIS, an evidence-first GTM intelligence agent. Return ONLY valid JSON with keys: icp, opportunities, recommended_action, spend_plan. Product: ${input.product}. Target market: ${input.market}. Target URL: ${input.targetUrl || 'none'}. Budget: ${input.budget} USDC. Goal: ${input.goal}. Never invent private contact data; distinguish evidence from hypotheses; opportunities contain company, signal, score 0-100, intent High/Medium/Low, reason; spend_plan contains service, amount_usdc, justification, approval_required. Prefer free public research before paid enrichment.`
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }) })
  if (!response.ok) return null
  const data = await response.json(); const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

export async function POST(request) {
  try {
    const body = await request.json(); const product = clean(body.product); const market = clean(body.market); const targetUrl = clean(body.targetUrl, 1000); const goal = clean(body.goal)
    const budget = Math.min(number(body.budget, 25), number(process.env.AURELIS_MAX_CAMPAIGN_BUDGET_USDC, 25)); const spent = Math.max(0, number(body.spent, 0))
    if (!product || !market || !goal || !Number.isFinite(budget) || budget <= 0 || spent > budget) return NextResponse.json({ ok: false, error: 'Product, target market, goal and a valid budget are required.' }, { status: 400 })
    const ai = await generateWithGemini({ product, market, targetUrl, goal, budget })
    const opportunities = Array.isArray(ai?.opportunities) && ai.opportunities.length ? ai.opportunities.slice(0, 10) : fallbackSignals
    const proposedSpend = Math.max(0, number(ai?.spend_plan?.amount_usdc, 0.75)); const maxSinglePayment = number(process.env.AURELIS_MAX_SINGLE_PAYMENT_USDC, 2); const approvalThreshold = number(process.env.AURELIS_REQUIRE_APPROVAL_ABOVE_USDC, 1)
    const policy = canSpend({ amount: proposedSpend, campaignBudget: budget, spent, maxSinglePayment, approvalThreshold }); const remaining = Math.max(0, budget - spent)
    const paymentIntent = policy.allowed || policy.requiresApproval ? { status: policy.allowed ? 'ready_for_execution' : 'awaiting_approval', service: ai?.spend_plan?.service || 'GTM intelligence enrichment', amount_usdc: proposedSpend, network: process.env.CIRCLE_NETWORK || 'base-sepolia', justification: ai?.spend_plan?.justification || 'Paid intelligence is proposed only after free evidence is exhausted.' } : null
    return NextResponse.json({ ok: true, mode: ai ? 'gemini' : 'fallback', mission: { status: policy.allowed ? 'authorized' : policy.requiresApproval ? 'approval_required' : 'blocked', budget, spent, remaining, policy }, icp: ai?.icp || { market, likely_buyers: ['Founder', 'Head of Sales', 'VP Growth'], triggers: ['Hiring', 'Funding', 'New market', 'Tool replacement'] }, opportunities, recommendedAction: ai?.recommended_action || 'Prioritize the highest-intent accounts, validate public evidence, then request paid enrichment only where it can materially improve confidence.', spendPlan: ai?.spend_plan || { service: 'GTM intelligence enrichment', amount_usdc: proposedSpend, justification: 'Use paid intelligence only after free evidence is exhausted.', approval_required: policy.requiresApproval }, paymentIntent, pipeline: ['discover', 'investigate', 'score', 'engage', 'learn'] })
  } catch (error) { return NextResponse.json({ ok: false, error: error?.message || 'Mission failed.' }, { status: 500 }) }
}
