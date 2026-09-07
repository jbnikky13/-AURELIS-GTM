export function evaluatePayment({ amount, budget, spent, maxSingle = 2, approvalAbove = 1, approved = false }) {
  const a = Number(amount), b = Number(budget), s = Number(spent)
  if (![a,b,s].every(Number.isFinite) || a <= 0 || b <= 0 || s < 0) return { status: 'blocked', reason: 'Invalid payment values.' }
  if (s + a > b) return { status: 'blocked', reason: 'Campaign budget would be exceeded.' }
  if (a > maxSingle) return { status: 'blocked', reason: 'Single-payment limit exceeded.' }
  if (a > approvalAbove && !approved) return { status: 'awaiting_approval', reason: 'Human approval is required for this payment.' }
  return { status: 'ready_for_execution', reason: approved ? 'Approved by policy and operator.' : 'Within automatic-spend policy.' }
}

export function paymentReceipt({ intent, transactionHash, providerReference }) {
  return { service: intent.service, amount_usdc: intent.amount_usdc, network: intent.network || 'base-sepolia', transaction_hash: transactionHash || null, provider_reference: providerReference || null, status: transactionHash ? 'confirmed' : 'prepared' }
}
