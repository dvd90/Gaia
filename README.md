# Gaia 🌍

## Save our planet — reduce your footprint

> “The question that will decide our destiny is not whether we shall expand into space. It is: shall we be one species or a million? A million species will not exhaust the ecological niches that are awaiting the arrival of intelligence.”
> — Freeman Dyson

Gaia is a community app for reducing your ecological footprint, one challenge at a time. Users can:

- **Take a footprint quiz** — find out how many Earths we'd need if everyone lived like your country does.
- **Join challenges** — complete eco-challenges (Waste, Energy, Transport) and earn Gaia points.
- **Attend events** — create and join local eco-events, geocoded and displayed on a Mapbox map.

This repository is the REST API. The React client lives in [Gaia_client](https://github.com/dvd90/Gaia_client).

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (bcrypt password hashing)
- Mapbox Geocoding API for event locations

## Getting started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Configure the environment:

   ```bash
   cp .env.example .env
   # then edit .env with your MongoDB URI, JWT secret and Mapbox key
   ```

3. Run the server:

   ```bash
   yarn server   # development, with reload (nodemon)
   npm start     # production
   ```

The API starts on `http://localhost:4000` by default.

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
