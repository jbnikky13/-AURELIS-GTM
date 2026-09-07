export function buildPaymentIntent({ policy, service, amount, network = 'base-sepolia', justification }) {
  if (!policy.allowed && !policy.requiresApproval) return null
  return {
    status: policy.allowed ? 'ready_for_execution' : 'awaiting_approval',
    service: service || 'GTM intelligence enrichment',
    amount_usdc: Number(amount || 0),
    network,
    justification: justification || 'Paid intelligence requested only after free evidence is exhausted.',
    execution: 'circle-worker'
  }
}
