# Gaia API 🌍 (`@gaia/api`)

The REST API for [Gaia](../../README.md). The web client lives alongside it in
[`apps/web`](../web/README.md).

## Tech stack

- Node.js 20+ / Express 5
- MongoDB + Mongoose 8
- JWT authentication (bcrypt password hashing), helmet security headers
- Mapbox Geocoding API for event locations
- Jest + Supertest test suite (80% coverage enforced)

## Getting started

Dependencies are installed once from the monorepo root (`npm install`). Then:

1. Configure the environment:

   ```bash
   cp apps/api/.env.example apps/api/.env
   # then edit .env with your MongoDB URI, JWT secret and Mapbox key
   ```

2. Run the server (from the repo root):

   ```bash
   npm run dev:api     # development, with reload (nodemon)
   npm run start:api   # production
   ```

The API starts on `http://localhost:4000` by default.

## Tests

The API is covered by a Jest + Supertest suite with a **minimum 80% coverage
threshold** enforced (currently ~98%). From the repo root:

```bash
npm run test:api
```

## Deployment

Deployed on Railway as its own service — see
[DEPLOYMENT.md](../../DEPLOYMENT.md) at the repo root.

## API overview

| Method | Route                          | Access  | Description                          |
| ------ | ------------------------------ | ------- | ------------------------------------ |
| POST   | `/api/users`                   | Public  | Register, returns a JWT              |
| PUT    | `/api/users`                   | Private | Update my profile                    |
| POST   | `/api/auth`                    | Public  | Login, returns a JWT                 |
| GET    | `/api/auth`                    | Private | Get the logged-in user               |
| GET    | `/api/challenges`              | Public  | List challenges                      |
| POST   | `/api/challenges`              | Private | Create a challenge                   |
| GET    | `/api/challenges/:id`          | Public  | Get a challenge                      |
| PUT    | `/api/challenges/:id`          | Private | Edit my challenge                    |
| PUT    | `/api/challenges/:id/join`     | Private | Join a challenge                     |
| PUT    | `/api/challenges/:id/completed`| Private | Complete a challenge, earn points    |
| DELETE | `/api/challenges/:id`          | Private | Delete my challenge                  |
| GET    | `/api/events`                  | Public  | List events                          |
| POST   | `/api/events`                  | Private | Create an event (geocodes location)  |
| GET    | `/api/events/:id`              | Public  | Get an event                         |
| PUT    | `/api/events/:id`              | Private | Edit my event                        |
| PUT    | `/api/events/:id/join`         | Private | Join an event                        |
| DELETE | `/api/events/:id`              | Private | Delete my event                      |
| GET    | `/api/footprint/:country_id`   | Public  | Country footprint (Earths consumed)  |

Private routes expect the JWT in an `x-auth-token` header (an `Authorization: Bearer <token>` header also works).

## Authors

Sellam David & Liad Gez
