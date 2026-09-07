# AURELIS GTM

AURELIS GTM is a budget-aware autonomous go-to-market agent. It combines opportunity intelligence, prospect scoring, personalized outreach and agent-native USDC payments into one controlled workflow.

## What is different

- **Opportunity Radar:** prioritize accounts using business events and buying-intent evidence.
- **Evidence-first scoring:** every lead gets fit, intent, confidence and a reason-to-contact.
- **Budget-aware autonomy:** the agent can request paid intelligence, but a policy engine enforces campaign and per-payment limits.
- **Human approval rail:** sensitive or expensive actions can be held for approval.
- **Learning loop:** campaign outcomes feed future ICP and outreach decisions.
- **Agent Wallet ledger:** payment intent, service, amount and transaction receipt can be stored alongside the GTM decision.

## Current foundation

The repository is intentionally started with a polished command center, a spend-policy engine and an agent API boundary. Circle Agent Wallet execution belongs in an isolated worker rather than exposing wallet credentials to the Next.js browser/server UI.

Circle's current Agent Wallet documentation describes programmable spending policies, USDC payments and x402 service payments. The Circle CLI is the supported command interface for agent wallets and service payments.

## Local development

Requires Node.js 20.18.2+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Circle setup

Install the current Circle CLI in the agent-worker environment:

```bash
npm install -g @circle-fin/cli
circle --version
circle wallet login your-email@example.com --testnet
circle wallet list --type agent --chain BASE-SEPOLIA
```

Do not put a private key, mnemonic or OTP in `.env.local`. Circle Agent Wallets use email authentication and policy controls; the agent worker should own the operational session.

For a first test, use Circle's supported testnet flow and fund the agent wallet from the Circle faucet. Production funding should be treated as a separate approval step.

## Roadmap

1. Supabase campaign/lead/payment schema
2. Gemini research + scoring agent
3. Opportunity discovery tools
4. Circle CLI worker and wallet policy synchronization
5. x402/marketplace service discovery and payment receipts
6. Email verification and outreach providers
7. Approval center
8. Outcome ingestion and self-optimization
9. Vercel production deployment + worker deployment

## Security principle

The web application must never receive or expose wallet seed phrases, private keys or raw Circle authentication material. Payment execution is a separate trust boundary.
