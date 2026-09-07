import { execFile } from 'node:child_process'

function circle(args) {
  return new Promise((resolve, reject) => {
    execFile('circle', args, { timeout: 30_000 }, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr || error.message))
      try { resolve(JSON.parse(stdout)) } catch { resolve({ raw: stdout.trim() }) }
    })
  })
}

export async function getAgentBalance(address, chain = process.env.CIRCLE_CHAIN || 'BASE') {
  return circle(['wallet', 'balance', '--address', address, '--chain', chain, '--output', 'json'])
}

export async function payService({ address, service, chain = process.env.CIRCLE_CHAIN || 'BASE' }) {
  // Keep the exact payment operation behind this boundary. The worker should first
  // validate AURELIS policy and persist an approval/payment-intent record.
  return circle(['services', 'pay', service, '--address', address, '--chain', chain, '--output', 'json'])
}

export async function listServices(query) {
  return circle(['services', 'search', query, '--output', 'json'])
}

if (process.argv[1]?.endsWith('circle-agent.js')) {
  console.log('AURELIS Circle worker ready. Import this module from the agent runtime.')
}
