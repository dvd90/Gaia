# Gaia Web 🌍 (`@gaia/web`)

The React client for [Gaia](../../README.md). It talks to the API in
[`apps/api`](../api/README.md).

- **Footprint quiz** — find out how many Earths we'd need if everyone lived like your country does.
- **Challenges** — complete eco-challenges (Waste, Energy, Transport) and earn Gaia points.
- **Events** — create and join local eco-events on a Mapbox map.

Fully responsive — works on mobile, tablet and desktop.

## Tech stack

- Vite + React 18
- React Router 7
- Context-based state (auth, toasts, confirm dialogs)
- Mapbox GL for the events map (lazy-loaded)
- Vitest + Testing Library test suite (80% coverage enforced)

## Getting started

Dependencies are installed once from the monorepo root (`npm install`). Then:

1. Start the API first: `npm run dev:api` (from the repo root) — it runs on
   `http://localhost:4000` by default.

2. Configure the environment:

   ```bash
   cp apps/web/.env.example apps/web/.env
   # set VITE_API_URL (your Gaia API) and VITE_MAPBOX_TOKEN
   ```

3. Run the app (from the repo root):

   ```bash
   npm run dev
   ```

## Tests

Vitest + Testing Library, with a **minimum 80% coverage threshold** enforced
(currently ~99% statements). From the repo root:

```bash
npm run test:web
```

## Deployment

Deployed on Railway as a static site served by
[`serve`](https://www.npmjs.com/package/serve) (SPA fallback included) — see
[DEPLOYMENT.md](../../DEPLOYMENT.md) at the repo root.

## Authors

Sellam David & Liad Gez
