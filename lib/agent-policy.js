export function canSpend({ amount, campaignBudget, spent, maxSinglePayment = 2, approvalThreshold = 1 }) {
  const value = Number(amount)
  const remaining = Number(campaignBudget) - Number(spent)
  if (!Number.isFinite(value) || value <= 0) return { allowed: false, reason: 'Invalid payment amount' }
  if (value > maxSinglePayment) return { allowed: false, requiresApproval: true, reason: 'Payment exceeds single-payment policy' }
  if (value > remaining) return { allowed: false, reason: 'Campaign budget exceeded' }
  if (value > approvalThreshold) return { allowed: false, requiresApproval: true, reason: 'Human approval required by policy' }
  return { allowed: true, remaining: remaining - value }
}
