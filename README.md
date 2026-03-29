# DSA Logic Builder

DSA Logic Builder helps learners practice problem-solving by focusing on thinking patterns, not just final code.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (Auth + Database)

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create or update your `.env` with:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
```

### 3) Run the app

```bash
npm run dev
```

### 4) Production build

```bash
npm run build
```

## Database Setup

Run migrations in Supabase SQL Editor in this order:

1. `supabase/migrations/20251222190543_1224794a-4db5-481d-8bfd-592eaac00405.sql`
2. `supabase/migrations/20251222192059_053a494f-7c6a-4594-96fa-041848786e51.sql`
3. `supabase/migrations/20251222202322_7a45c13f-8d37-4187-9d04-a463a42f69e0.sql`

## Deployment

### Vercel (Recommended)

This repo includes `vercel.json` with:

- SPA rewrites for React Router routes
- Security headers
- Cache headers for static assets

Steps:

1. Import this repository into Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Supabase Auth URLs

After deploying, update Supabase Authentication URL settings:

- Site URL: `https://<your-vercel-domain>.vercel.app`
- Redirect URLs: `https://<your-vercel-domain>.vercel.app/**`
