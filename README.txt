Movello — Full Default Build (App Router) • v0.3
------------------------------------------------
This app compiles on Vercel immediately (no keys required).
Folders are at the ROOT (no /src), so Vercel finds /app.

Key routes:
/          – Landing
/console   – Owner/Staff console (Dashboard, Approvals, Jobs, Dispatch, Map, Billing, Reports, Settings)
/driver    – Driver area (My Jobs, Availability)
/customer  – Customer area (Book, My Jobs)

Convert to live:
- Add your env vars in Vercel from .env.example
- Replace the mock store with DB (Supabase) & Stripe endpoints
- Add Mapbox token to show the live map
