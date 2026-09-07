function requireEnv(name) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured.`); return value }

export async function createCircleUsdcTransfer({ destinationAddress, amount, idempotencyKey }) {
  const apiKey = requireEnv('CIRCLE_API_KEY')
  const walletId = requireEnv('CIRCLE_WALLET_ID')
  const blockchain = process.env.CIRCLE_NETWORK || 'BASE-SEPOLIA'
  if (!/^0x[a-fA-F0-9]{40}$/.test(destinationAddress)) throw new Error('Invalid destination EVM address.')
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) throw new Error('Invalid USDC amount.')
  const response = await fetch('https://api.circle.com/v1/w3s/developer/transactions/transfer', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Request-Id': idempotencyKey },
    body: JSON.stringify({ idempotencyKey, walletId, destinationAddress, amounts: [{ amount: numericAmount.toFixed(6), tokenId: process.env.CIRCLE_USDC_TOKEN_ID }] , blockchain })
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.message || `Circle transfer failed with HTTP ${response.status}.`)
  return payload
}
