# Gaia 🌍

## Save our planet — reduce your footprint

> “The question that will decide our destiny is not whether we shall expand into space. It is: shall we be one species or a million? A million species will not exhaust the ecological niches that are awaiting the arrival of intelligence.”
> — Freeman Dyson

Gaia is a community app for reducing your ecological footprint, one challenge at a time:

- **Take a footprint quiz** — find out how many Earths we'd need if everyone lived like your country does.
- **Join challenges** — complete eco-challenges (Waste, Energy, Transport) and earn Gaia points.
- **Attend events** — create and join local eco-events, geocoded and shown on a Mapbox map.

This is a **monorepo** containing both the API and the web client, managed with
npm workspaces.

## Structure

```
gaia/
├── apps/
│   ├── api/    → Express 5 + Mongoose 8 REST API   (@gaia/api)
│   └── web/    → Vite + React 18 client            (@gaia/web)
├── package.json          # workspace root
└── DEPLOYMENT.md         # Railway two-service guide
```

Each app has its own README with detailed docs:
[`apps/api`](apps/api/README.md) · [`apps/web`](apps/web/README.md).

## Getting started

Requires **Node 20+**. Install everything once from the root:

```bash
npm install
```

Configure the two apps' environments:

```bash
cp apps/api/.env.example apps/api/.env   # Mongo URI, JWT secret, Mapbox key, CORS origin
cp apps/web/.env.example apps/web/.env   # API URL, Mapbox token
```

Run them (two terminals):

```bash
npm run dev:api    # API on http://localhost:4000  (nodemon)
npm run dev        # web on http://localhost:3000  (Vite)
```

## Scripts (run from the root)

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the web client (Vite dev server)         |
| `npm run dev:api`   | Start the API with reload (nodemon)            |
| `npm run build`     | Build the web client to `apps/web/dist`        |
| `npm test`          | Run **both** test suites with coverage         |
| `npm run test:api`  | API tests only (Jest)                          |
| `npm run test:web`  | Web tests only (Vitest)                         |
| `npm run start:api` | Run the API in production (`node server.js`)   |
| `npm run start:web` | Serve the built web client (`serve -s dist`)   |

## Tests

Both apps enforce a **minimum 80% coverage threshold** (currently ~98% API,
~99% web). `npm test` runs both:

- API: **114** Jest + Supertest tests
- Web: **96** Vitest + Testing Library tests

## Deployment

Deployed on Railway as **two services** (API + web) from this one repo — see
[DEPLOYMENT.md](DEPLOYMENT.md).

## Authors

Sellam David & Liad Gez
