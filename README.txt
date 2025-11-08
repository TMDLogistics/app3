Movello — Full Default Build (Mock-capable)
-------------------------------------------
This project deploys to Vercel immediately, even with NO keys.
When you add keys to .env, features switch from mock to live.

Quick start
1) Upload this folder as a new Vercel project
2) Build runs with mock data; open /app for the console
3) Add your .env vars in Vercel → Settings → Environment Variables
4) Redeploy to activate live services

Where to connect services later
- Auth: (add Clerk or Supabase SDK under src/lib/auth/* and wrap pages)
- DB: Supabase (create tables; swap mock store for server actions)
- Payments: add /api/checkout and /api/stripe/webhook
- Realtime: Ably/Pusher client in /app, server webhook /api/realtime
- Maps: Mapbox token -> show map on Live Map view
