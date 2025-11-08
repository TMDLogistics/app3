import {useState} from 'react'
import {mockGet, mockAddJob, mockAssign, mockComplete, mockToggleDriver} from '@/lib/mock'
import dayjs from 'dayjs'
const TABS={owner:['Dashboard','Approvals','Jobs','Dispatch','Live Map','Billing','Reports','Settings'],
  ops:['Dashboard','Jobs','Dispatch','Live Map','Disputes','Messaging','Settings'],
  driver:['My Jobs','Availability','Earnings','Documents','Settings'],
  helper:['My Jobs','Availability','Documents'],
  customer:['Book','My Jobs','Invoices','Support'],
  supplier:['Network','Settings']}
export default function AppConsole(){
  const [role,setRole]=useState('owner'); const [tab,setTab]=useState('Dashboard'); const [s,setS]=useState(mockGet());
  const tabs=TABS[role]||[];
  const TabBtn=({t})=>(<button className={'tab '+(tab===t?'active':'')} onClick={()=>setTab(t)}>{t}</button>);
  return (<div className="container">
    <header className="top">
      <div className="brand"><span className="logo"></span><b>Movello</b><span style={{marginLeft:8,color:'#0EA596'}}>• App</span></div>
      <div className="tabs">{tabs.map(t=><TabBtn key={t} t={t}/>)}</div>
      <div><select value={role} onChange={e=>{setRole(e.target.value);setTab(TABS[e.target.value][0])}}>
        {Object.keys(TABS).map(r=><option key={r} value={r}>{r}</option>)}
      </select></div>
    </header>
    <main style={{display:'grid',gap:12,margin:'14px 0'}}>
      {role==='owner'&&tab==='Dashboard'&&<Dashboard s={s}/>}
      {role==='owner'&&tab==='Approvals'&&<Approvals s={s} setS={setS}/>}
      {(role==='owner'||role==='ops')&&tab==='Jobs'&&<Jobs s={s} setS={setS}/>}
      {(role==='owner'||role==='ops')&&tab==='Dispatch'&&<Dispatch s={s} setS={setS}/>}
      {tab==='Live Map'&&<Card title="Live Map"><p className="muted">Map placeholder. Connect Mapbox + Ably for realtime pins.</p></Card>}
      {tab==='Billing'&&<Card title="Billing"><p className="muted">Stripe Payments + Connect. Commission, instant payout, reserves.</p></Card>}
      {tab==='Reports'&&<Card title="Reports"><ul className="muted"><li>Revenue, utilisation, on‑time</li><li>Disputes & refunds</li><li>VAT export</li></ul></Card>}
      {tab==='Settings'&&<Settings/>}
      {role==='driver'&&tab==='My Jobs'&&<DriverJobs s={s} setS={setS}/>}
      {role==='customer'&&tab==='Book'&&<Book s={s} setS={setS}/>}
    </main>
    <footer>© {new Date().getFullYear()} Movello</footer>
  </div>)
}
function Card({title,children}){return <section className="card"><h1>{title}</h1>{children}</section>}
function Dashboard({s}){
  const assigned=s.jobs.filter(j=>['assigned','enroute','arrived'].includes(j.status)).length;
  const completed=s.jobs.filter(j=>j.status==='completed').length;
  return (<>
    <section className="kpi">
      <div className="card"><div className="muted">New / Quoted</div><div className="num">{s.jobs.filter(j=>j.status==='quoted').length}</div></div>
      <div className="card"><div className="muted">Assigned</div><div className="num">{assigned}</div></div>
      <div className="card"><div className="muted">Completed</div><div className="num">{completed}</div></div>
      <div className="card"><div className="muted">Drivers Online</div><div className="num">{s.drivers.filter(d=>d.online).length}</div></div>
    </section>
    <section className="grid cols-2">
      <div className="card">
        <h2>Today’s queue</h2>
        <table className="table"><thead><tr><th>ID</th><th>From</th><th>To</th><th>Status</th></tr></thead>
          <tbody>{s.jobs.slice(0,8).map(j=>(<tr key={j.id}><td>{j.id}</td><td>{j.from}</td><td>{j.to}</td><td>{j.status}</td></tr>))}</tbody></table>
      </div>
      <div className="card">
        <h2>Network snapshot</h2>
        <div>{s.drivers.map(d=>(<span key={d.id} className="tab" style={{borderStyle:'dashed'}}>{d.name} • {d.vehicle} • {d.online?'Online':'Offline'}</span>))}</div>
      </div>
    </section>
  </>)
}
function Approvals({s,setS}){
  return <Card title="Approvals">
    <table className="table"><thead><tr><th>Name</th><th>Vehicle</th><th>Verified</th><th>Action</th></tr></thead>
    <tbody>{s.drivers.map(d=>(<tr key={d.id}><td>{d.name}</td><td>{d.vehicle}</td><td>{d.verified?'Yes':'No'}</td>
    <td><button className="primary" onClick={()=>{mockToggleDriver(d.id);setS({...mockGet()})}}>Toggle Verify/Online</button></td></tr>))}</tbody></table>
  </Card>
}
function Jobs({s,setS}){
  let from,to,date,size,price,details;
  return <>
    <Card title="Create job">
      <div className="grid cols-3">
        <div><label>From</label><input ref={r=>from=r}/></div>
        <div><label>To</label><input ref={r=>to=r}/></div>
        <div><label>Date</label><input type="date" ref={r=>date=r}/></div>
      </div>
      <div className="grid cols-3">
        <div><label>Size</label><select ref={r=>size=r}><option value="1">Bike/Small</option><option value="2">Car/Small Van</option><option value="3" defaultValue>Van L2H2</option><option value="4">Luton/Truck</option></select></div>
        <div><label>Price (est.)</label><input ref={r=>price=r} placeholder="e.g. 60"/></div>
        <div><label>Details</label><input ref={r=>details=r} placeholder="Stairs / access etc."/></div>
      </div>
      <div style={{marginTop:10}}><button className="btn primary" onClick={()=>{
        const j={id:'J'+Math.random().toString(36).slice(2,7), from:from.value, to:to.value, date:date.value, size:size.value, price:Number(price.value||0), details:details.value, status:'quoted'};
        mockAddJob(j); setS({...mockGet()});
      }}>Add Job</button></div>
    </Card>
    <Card title="All jobs">
      <table className="table"><thead><tr><th>ID</th><th>Route</th><th>Size</th><th>Price</th><th>Status</th></tr></thead>
      <tbody>{s.jobs.map(j=>(<tr key={j.id}><td>{j.id}</td><td>{j.from} → {j.to}</td><td>{j.size}</td><td>€{j.price||'-'}</td><td>{j.status}</td></tr>))}</tbody></table>
    </Card>
  </>
}
function Dispatch({s,setS}){
  const un = s.jobs.filter(j=>j.status==='quoted'||(j.status==='assigned'&&!j.driver));
  let selects = {};
  return <Card title="Dispatch">
    <div className="grid cols-2">
      <div>
        <h3>Unassigned</h3>
        <table className="table"><thead><tr><th>ID</th><th>Route</th><th>Assign</th></tr></thead>
        <tbody>{un.map(j=>(<tr key={j.id}><td>{j.id}</td><td>{j.from} → {j.to}</td>
          <td><select ref={r=>selects[j.id]=r}>{s.drivers.map(d=>(<option key={d.id} value={d.id}>{d.name}</option>))}</select> <button className="primary" onClick={()=>{mockAssign(j.id, selects[j.id].value);setS({...mockGet()})}}>Assign</button></td></tr>))}</tbody></table>
      </div>
      <div>
        <h3>Drivers</h3>
        <table className="table"><thead><tr><th>Name</th><th>Vehicle</th><th>Online</th><th>Toggle</th></tr></thead>
        <tbody>{s.drivers.map(d=>(<tr key={d.id}><td>{d.name}</td><td>{d.vehicle}</td><td>{d.online?'Yes':'No'}</td><td><button onClick={()=>{mockToggleDriver(d.id);setS({...mockGet()})}}>Toggle</button></td></tr>))}</tbody></table>
      </div>
    </div>
  </Card>
}
function Settings(){
  return <Card title="Settings">
    <div className="grid cols-3">
      <div><label>Commission %</label><input defaultValue={20}/></div>
      <div><label>Instant Payout</label><select><option>No</option><option>Yes (fee)</option></select></div>
      <div><label>Smart Load</label><select><option>Off</option><option>On (beta)</option></select></div>
      <div><label>Mask numbers</label><select><option>On</option><option>Off</option></select></div>
      <div><label>Cities</label><input defaultValue={process.env.NEXT_PUBLIC_DEFAULT_CITIES||''}/></div>
      <div><label>Languages</label><select><option>EN</option><option>ES</option></select></div>
    </div>
  </Card>
}
function DriverJobs({s,setS}){
  const my=s.jobs.filter(j=>j.driver);
  return <Card title="My Jobs">
    <table className="table"><thead><tr><th>ID</th><th>Route</th><th>Status</th><th>Done</th></tr></thead>
    <tbody>{my.map(j=>(<tr key={j.id}><td>{j.id}</td><td>{j.from} → {j.to}</td><td>{j.status}</td><td><button className="primary" onClick={()=>{mockComplete(j.id);setS({...mockGet()})}}>Complete</button></td></tr>))}</tbody></table>
  </Card>
}
function Book({s,setS}){
  let frm,to,date;
  return <Card title="Book">
    <div className="grid cols-3"><div><label>From</label><input ref={r=>frm=r}/></div><div><label>To</label><input ref={r=>to=r}/></div><div><label>Date</label><input type="date" ref={r=>date=r}/></div></div>
    <div style={{marginTop:10}}><button className="btn primary" onClick={()=>{mockAddJob({id:'J'+Math.random().toString(36).slice(2,7),from:frm.value,to:to.value,date:date.value,status:'quoted'});setS({...mockGet()})}}>Send</button></div>
  </Card>
}
