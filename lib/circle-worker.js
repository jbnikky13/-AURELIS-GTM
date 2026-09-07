function required(name) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured.`); return value }

export async function executeCirclePayment({ paymentIntent, approved }) {
  if (!approved) throw new Error('Payment has not been approved.')
  if (process.env.CIRCLE_EXECUTION_ENABLED !== 'true') return { status: 'disabled', reason: 'Circle execution is disabled. Enable only after testnet credentials and policy are verified.', network: process.env.CIRCLE_NETWORK || 'base-sepolia' }
  const network = process.env.CIRCLE_NETWORK || 'base-sepolia'
  const apiKey = required('CIRCLE_API_KEY')
  const walletId = required('CIRCLE_WALLET_ID')
  return { status: 'ready', network, walletId, apiKeyConfigured: Boolean(apiKey), paymentIntent }
}
