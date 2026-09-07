function requireEnv(name) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured.`); return value }

export async function createCircleUsdcTransfer({ destinationAddress, amount, idempotencyKey, reference }) {
  const apiKey = requireEnv('CIRCLE_API_KEY')
  const walletId = requireEnv('CIRCLE_WALLET_ID')
  const entitySecretCiphertext = requireEnv('CIRCLE_ENTITY_SECRET_CIPHERTEXT')
  const tokenId = requireEnv('CIRCLE_USDC_TOKEN_ID')
  const blockchain = process.env.CIRCLE_NETWORK || 'BASE-SEPOLIA'
  if (blockchain !== 'BASE-SEPOLIA') throw new Error(`AURELIS testnet execution requires BASE-SEPOLIA; received ${blockchain}.`)
  if (!/^0x[a-fA-F0-9]{40}$/.test(destinationAddress)) throw new Error('Invalid destination EVM address.')
  if (!/^[0-9a-fA-F-]{36}$/.test(walletId)) throw new Error('CIRCLE_WALLET_ID must be a UUID.')
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 2) throw new Error('Invalid USDC amount or single-payment policy limit exceeded.')
  const requestId = idempotencyKey || crypto.randomUUID()
  const response = await fetch('https://api.circle.com/v1/w3s/developer/transactions/transfer', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    body: JSON.stringify({ idempotencyKey: requestId, walletId, destinationAddress, entitySecretCiphertext, amounts: [numericAmount.toFixed(6)], tokenId, blockchain, feeLevel: 'MEDIUM', refId: reference || 'aurelis-gtm' })
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.message || `Circle transfer failed with HTTP ${response.status}.`)
  return payload
}
