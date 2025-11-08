import Link from 'next/link'
export default function Home(){
  return (
    <div className="container">
      <header className="top">
        <div className="brand"><span className="logo"></span><b>Movello</b><span style={{color:'#0EA596',marginLeft:8}}>• Default Build</span></div>
        <div><Link className="btn primary" href="/app">Open App</Link></div>
      </header>
      <main style={{padding:'20px 0'}}>
        <div className="grid cols-2">
          <div className="card">
            <h2>What you have right now</h2>
            <ul>
              <li>Deployable Next.js app</li>
              <li>Mock mode (no keys needed)</li>
              <li>Jobs, Dispatch, Drivers, Settings</li>
              <li>PWA ready, role tabs</li>
            </ul>
          </div>
          <div className="card">
            <h2>Connect real services</h2>
            <ul>
              <li>Auth (Clerk/Supabase)</li>
              <li>Stripe Payments + Connect</li>
              <li>Supabase Postgres + Storage</li>
              <li>Mapbox + Ably + Twilio</li>
            </ul>
          </div>
        </div>
      </main>
      <footer>© {new Date().getFullYear()} Movello • Defaults</footer>
    </div>
  )
}
