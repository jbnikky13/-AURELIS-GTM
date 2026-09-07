'use client'

import { useState } from 'react'
import { ArrowUpRight, Bot, ChevronRight, CircleDollarSign, Gauge, Radar, ShieldCheck, Sparkles, Target, WalletCards, X, Play, Loader2 } from 'lucide-react'

const signals = [
  { company: 'Northstar AI', signal: 'Recent GTM hiring suggests a growing outbound motion', score: 92, intent: 'High' },
  { company: 'Orbit Labs', signal: 'Enterprise expansion creates a likely need for pipeline automation', score: 87, intent: 'High' },
  { company: 'Meridian Cloud', signal: 'Growth team is evaluating outbound tooling', score: 81, intent: 'Medium' }
]

export default function Home() {
  const [running, setRunning] = useState(false)
  const [showMission, setShowMission] = useState(false)
  const [budget, setBudget] = useState('25')
  const [product, setProduct] = useState('AI-powered GTM intelligence and outreach automation for startups')
  const [market, setMarket] = useState('US B2B startups with 10-200 employees')
  const [targetUrl, setTargetUrl] = useState('')
  const [goal, setGoal] = useState('Find high-intent companies, identify likely buyers and prepare personalized outreach opportunities.')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function runAgent() {
    setRunning(true); setError(''); setResult(null)
    try {
      const response = await fetch('/api/mission', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ product, market, targetUrl, goal, budget }) })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Mission failed')
      setResult(data)
      setShowMission(false)
    } catch (e) { setError(e.message) } finally { setRunning(false) }
  }

  const displayedSignals = result?.opportunities || signals
  const spent = result?.mission?.spent ?? 7.42
  const remaining = Math.max(0, Number(budget || 0) - spent)

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandMark">A</div><div><strong>AURELIS</strong><span>GTM AGENT</span></div></div>
        <nav>{['Overview','Campaigns','Opportunity Radar','Leads','Outreach','Agent Wallet','Approvals'].map((item, i) => <div className={`navItem ${i===0?'active':''}`} key={item}>{item}</div>)}</nav>
        <div className="sidebarBottom"><div className="live"><span/> Agent online</div><small>Autonomous growth infrastructure</small></div>
      </aside>

      <section className="content">
        <header className="topbar"><div><p className="eyebrow">AUTONOMOUS GTM OPERATIONS</p><h1>Growth command center</h1></div><button className="wallet"><CircleDollarSign size={17}/> {budget}.00 USDC <ChevronRight size={15}/></button></header>

        <section className="hero">
          <div><div className="pill"><Sparkles size={14}/> Self-improving GTM agent</div><h2>Find the right customers.<br/><em>Spend only when it matters.</em></h2><p>AURELIS discovers opportunities, researches public evidence, scores buying intent and asks for paid intelligence only when the expected value justifies the spend.</p><button className="primary" onClick={() => setShowMission(true)}><Play size={16}/> {running ? 'Agent is working…' : 'Launch GTM mission'}</button></div>
          <div className="orb"><div className="orbInner"><Bot size={38}/><span>AGENT<br/>READY</span></div></div>
        </section>

        {error && <div className="errorBox">{error}</div>}
        {result && <section className="missionResult"><div><span className="resultBadge">{result.mode === 'gemini' ? 'GEMINI INTELLIGENCE' : 'FALLBACK INTELLIGENCE'}</span><h3>Mission complete</h3><p>{result.recommendedAction}</p></div><div className="resultPolicy"><strong>{result.mission.status.replace('_',' ')}</strong><span>Proposed spend: ${Number(result.spendPlan.amount_usdc || 0).toFixed(2)} USDC</span></div></section>}

        <div className="stats">
          <Stat icon={<Radar/>} label="Opportunities" value={result?.opportunities?.length || '143'} delta={result ? 'mission results' : '+28 today'}/>
          <Stat icon={<Target/>} label="High intent" value={result ? result.opportunities.filter(x=>x.intent==='High').length : '12'} delta={result ? 'identified in mission' : '8.4% of leads'}/>
          <Stat icon={<WalletCards/>} label="Spent" value={`$${Number(spent).toFixed(2)}`} delta={`$${Number(remaining).toFixed(2)} remaining`}/>
          <Stat icon={<Gauge/>} label="GTM score" value={result ? Math.round(result.opportunities.reduce((a,x)=>a+Number(x.score||0),0)/Math.max(result.opportunities.length,1)) : '82'} delta={result ? 'mission quality' : '+11 this week'}/>
        </div>

        <div className="grid2">
          <section className="panel"><div className="panelHead"><div><p className="eyebrow">OPPORTUNITY RADAR</p><h3>{result ? 'Mission opportunities' : 'Why these accounts matter'}</h3></div><button className="ghost">View all <ArrowUpRight size={14}/></button></div>{displayedSignals.map((s, i) => <div className="signal" key={`${s.company}-${i}`}><div className="companyIcon">{s.company?.[0] || 'A'}</div><div className="signalBody"><strong>{s.company}</strong><span>{s.signal}</span></div><div className="signalScore"><b>{s.score}</b><small>{s.intent}</small></div></div>)}</section>
          <section className="panel budget"><div className="panelHead"><div><p className="eyebrow">AGENT WALLET</p><h3>Spend controls</h3></div><ShieldCheck size={20}/></div><div className="budgetValue"><span>Campaign budget</span><strong>${budget} <small>USDC</small></strong></div><input aria-label="Campaign budget" value={budget} onChange={e=>setBudget(e.target.value.replace(/[^0-9.]/g,''))}/><div className="bar"><i style={{width:`${Math.min(100, Number(spent)/Math.max(Number(budget),1)*100)}%`}}/></div><div className="budgetRows"><span>Spent <b>${Number(spent).toFixed(2)}</b></span><span>Remaining <b>${Number(remaining).toFixed(2)}</b></span></div><div className="guard"><ShieldCheck size={16}/><span>Payments are policy-controlled. Large or untrusted spend can require human approval.</span></div></section>
        </div>

        <section className="workflow"><div className="panelHead"><div><p className="eyebrow">MISSION PIPELINE</p><h3>From market signal to revenue</h3></div><span className="status">● {running ? 'RUNNING' : 'READY'}</span></div><div className="steps">{[['01','Discover','Find ICP + market signals'],['02','Investigate','Research companies + people'],['03','Score','Rank fit, intent + evidence'],['04','Engage','Generate personalized outreach'],['05','Learn','Measure replies + improve']].map((x,i)=><div className="step" key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span>{i<4&&<ChevronRight className="stepArrow"/>}</div>)}</div></section>
      </section>

      {showMission && <div className="modalBackdrop"><section className="missionModal"><button className="close" onClick={()=>setShowMission(false)}><X size={18}/></button><p className="eyebrow">NEW AUTONOMOUS MISSION</p><h2>Tell AURELIS what to find.</h2><p className="modalIntro">The agent will start with free research, score opportunities, then propose paid intelligence inside your budget.</p><label>Product / offer<textarea value={product} onChange={e=>setProduct(e.target.value)} /></label><label>Target market<input value={market} onChange={e=>setMarket(e.target.value)} /></label><label>Target URL <span className="optional">optional</span><input placeholder="https://..." value={targetUrl} onChange={e=>setTargetUrl(e.target.value)} /></label><label>Goal<textarea value={goal} onChange={e=>setGoal(e.target.value)} /></label><div className="budgetInput"><label>USDC budget<input type="number" min="1" max="25" value={budget} onChange={e=>setBudget(e.target.value)} /></label><div className="policyMini"><ShieldCheck size={15}/> Max campaign budget: {process.env.NEXT_PUBLIC_MAX_BUDGET || 25} USDC</div></div><button className="primary launch" onClick={runAgent} disabled={running}>{running ? <><Loader2 className="spin" size={16}/> Agent is researching…</> : <><Play size={16}/> Start mission</>}</button></section></div>}
    </main>
  )
}

function Stat({icon,label,value,delta}) { return <div className="stat"><div className="statIcon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div></div> }