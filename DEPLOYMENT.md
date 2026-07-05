# Deploying Gaia on Railway

Gaia is a single monorepo that deploys as **two Railway services** in one
project: the API and the web client. Both services share this repo and its
single lockfile; each is configured with its own build/start commands and
**watch paths**, so a change to the client never rebuilds the API and vice
versa.

Each service has a config-as-code file:

- API → [`apps/api/railway.json`](apps/api/railway.json)
- Web → [`apps/web/railway.json`](apps/web/railway.json)

Both files run their commands from the **repo root** (so npm workspaces resolve
correctly), which means each service's **Root Directory must stay at the repo
root** — the app is targeted with `--workspace`, not by changing the root.

## 1. Create the project + database

1. **New Project → Deploy from GitHub repo** → pick `dvd90/Gaia`.
2. Add a **MongoDB** database (Railway template) or use MongoDB Atlas.

## 2. API service

Railway will create one service from the repo. Configure it:

| Setting             | Value                                          |
| ------------------- | ---------------------------------------------- |
| Root Directory      | *(leave at repo root)*                          |
| Config-as-code path | `apps/api/railway.json`                          |

The config file already sets:
- Build: `npm ci`
- Start: `npm run start --workspace @gaia/api`
- Healthcheck: `/health`
- Watch: `apps/api/**`, `package.json`, `package-lock.json`

Variables:

| Variable        | Value                                             |
| --------------- | ------------------------------------------------- |
| `MONGO_URI`     | `${{ MongoDB.MONGO_URL }}` (or your Atlas URI)     |
| `JWT_SECRET`    | a long random string                              |
| `MAP_BOX_KEY`   | your Mapbox token (server-side geocoding)         |
| `CLIENT_ORIGIN` | the web service's public URL (for CORS)           |

`PORT` is injected by Railway automatically.

## 3. Web service

Add a **second service** to the same project, pointing at the same repo
(**New → GitHub Repo → same repo**). Configure it:

| Setting             | Value                                          |
| ------------------- | ---------------------------------------------- |
| Root Directory      | *(leave at repo root)*                          |
| Config-as-code path | `apps/web/railway.json`                          |

The config file already sets:
- Build: `npm ci && npm run build --workspace @gaia/web`
- Start: `npm run start --workspace @gaia/web` (serves `apps/web/dist`)
- Watch: `apps/web/**`, `package.json`, `package-lock.json`

Variables:

| Variable            | Value                                     |
| ------------------- | ----------------------------------------- |
| `VITE_API_URL`      | the API service's public URL              |
| `VITE_MAPBOX_TOKEN` | your Mapbox token (client map)            |

> **Vite inlines `VITE_*` variables at build time.** If you change them,
> redeploy the web service so it rebuilds.

## 4. Wire the two together

1. Generate a public domain for each service (Settings → Networking).
2. Set the API's `CLIENT_ORIGIN` to the web domain (CORS).
3. Set the web's `VITE_API_URL` to the API domain, then redeploy the web
   service.

That's it — pushes to `master` redeploy only the service whose watch paths
changed.
