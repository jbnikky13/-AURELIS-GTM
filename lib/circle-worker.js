import { createCircleUsdcTransfer } from './circle-client'

function required(name) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured.`); return value }

export async function executeCirclePayment({ paymentIntent, approved, destinationAddress }) {
  if (!approved) throw new Error('Payment has not been approved.')
  if (process.env.CIRCLE_EXECUTION_ENABLED !== 'true') return { status: 'disabled', reason: 'Circle execution is disabled. Configure testnet credentials before enabling.', network: process.env.CIRCLE_NETWORK || 'BASE-SEPOLIA' }
  required('CIRCLE_API_KEY'); required('CIRCLE_WALLET_ID'); required('CIRCLE_ENTITY_SECRET_CIPHERTEXT'); required('CIRCLE_USDC_TOKEN_ID')
  if (!destinationAddress) throw new Error('Destination address is required.')
  return createCircleUsdcTransfer({ destinationAddress, amount: paymentIntent.amount_usdc, idempotencyKey: paymentIntent.id, reference: `aurelis-gtm-${paymentIntent.id}` })
}
