'use client'

import { useState } from 'react'
import { ArrowUpRight, Bot, BrainCircuit, ChevronRight, CircleDollarSign, Gauge, Radar, ShieldCheck, Sparkles, Target, WalletCards } from 'lucide-react'

const signals = [
  { company: 'Northstar AI', signal: 'Raised a new seed round and is hiring 4 GTM roles', score: 94, intent: 'High' },
  { company: 'Orbit Labs', signal: 'Launched enterprise pricing and expanded sales team', score: 89, intent: 'High' },
  { company: 'Meridian Cloud', signal: 'Replacing outbound tooling across growth team', score: 82, intent: 'Medium' }
]

export default function Home() {
  const [running, setRunning] = useState(false)
  const [budget, setBudget] = useState('25')

  function runAgent() {
    setRunning(true)
    setTimeout(() => setRunning(false), 1800)
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandMark">A</div><div><strong>AURELIS</strong><span>GTM AGENT</span></div></div>
        <nav>
          {['Overview','Campaigns','Opportunity Radar','Leads','Outreach','Agent Wallet','Approvals'].map((item, i) => <div className={`navItem ${i===0?'active':''}`} key={item}>{item}</div>)}
        </nav>
        <div className="sidebarBottom"><div className="live"><span/> Agent online</div><small>Autonomous growth infrastructure</small></div>
      </aside>

      <section className="content">
        <header className="topbar"><div><p className="eyebrow">AUTONOMOUS GTM OPERATIONS</p><h1>Growth command center</h1></div><button className="wallet"><CircleDollarSign size={17}/> {budget}.00 USDC <ChevronRight size={15}/></button></header>

        <section className="hero">
          <div><div className="pill"><Sparkles size={14}/> Self-improving GTM agent</div><h2>Find the right customers.<br/><em>Spend only when it matters.</em></h2><p>AURELIS researches markets, detects buying intent, scores opportunities and uses a controlled USDC budget to acquire better intelligence.</p><button className="primary" onClick={runAgent}>{running ? 'Agent is working…' : 'Run GTM mission'} <ArrowUpRight size={17}/></button></div>
          <div className="orb"><div className="orbInner"><Bot size={38}/><span>AGENT<br/>READY</span></div></div>
        </section>

        <div className="stats">
          <Stat icon={<Radar/>} label="Opportunities" value="143" delta="+28 today"/>
          <Stat icon={<Target/>} label="High intent" value="12" delta="8.4% of leads"/>
          <Stat icon={<WalletCards/>} label="Spent" value="$7.42" delta="$17.58 remaining"/>
          <Stat icon={<Gauge/>} label="GTM score" value="82" delta="+11 this week"/>
        </div>

        <div className="grid2">
          <section className="panel"><div className="panelHead"><div><p className="eyebrow">OPPORTUNITY RADAR</p><h3>Why these accounts matter</h3></div><button className="ghost">View all <ArrowUpRight size={14}/></button></div>{signals.map(s => <div className="signal" key={s.company}><div className="companyIcon">{s.company[0]}</div><div className="signalBody"><strong>{s.company}</strong><span>{s.signal}</span></div><div className="signalScore"><b>{s.score}</b><small>{s.intent}</small></div></div>)}</section>
          <section className="panel budget"><div className="panelHead"><div><p className="eyebrow">AGENT WALLET</p><h3>Spend controls</h3></div><ShieldCheck size={20}/></div><div className="budgetValue"><span>Campaign budget</span><strong>${budget}.00 <small>USDC</small></strong></div><input aria-label="Campaign budget" value={budget} onChange={e=>setBudget(e.target.value.replace(/[^0-9.]/g,''))}/><div className="bar"><i style={{width:'29.7%'}}/></div><div className="budgetRows"><span>Spent <b>$7.42</b></span><span>Remaining <b>${Math.max(0, Number(budget||0)-7.42).toFixed(2)}</b></span></div><div className="guard"><ShieldCheck size={16}/><span>Payments are policy-controlled. Large or untrusted spend can require human approval.</span></div></section>
        </div>

        <section className="workflow"><div className="panelHead"><div><p className="eyebrow">MISSION PIPELINE</p><h3>From market signal to revenue</h3></div><span className="status">● LIVE</span></div><div className="steps">{[['01','Discover','Find ICP + market signals'],['02','Investigate','Research companies + people'],['03','Score','Rank fit, intent + evidence'],['04','Engage','Generate personalized outreach'],['05','Learn','Measure replies + improve']].map((x,i)=><div className="step" key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span>{i<4&&<ChevronRight className="stepArrow"/>}</div>)}</div></section>
      </section>
    </main>
  )
}

function Stat({icon,label,value,delta}) { return <div className="stat"><div className="statIcon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div></div> }