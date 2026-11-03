# PulseAPI

A small REST API for technicians to register monitoring devices and log voltage readings. A reading outside the safe range (0 V to 60 V) creates an alert.

Built with Node.js, Express, Sequelize (ORM) and SQLite.

## Setup

Requires Node.js 20.6 or newer.

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm start
```

| Step                   | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `npm install`          | Installs the packages                                         |
| `cp .env.example .env` | Creates the settings file (Windows: `copy .env.example .env`) |
| `npm run db:migrate`   | Creates the database file `pulse.db` and its tables           |
| `npm run db:seed`      | Adds the test user                                            |
| `npm start`            | Starts the API at http://localhost:3000                       |

## Project structure

```
PulseAPI/
├── config/       Database settings
├── middleware/   Checks the login token on protected routes
├── migrations/   Create the database tables
├── models/       Database models (Sequelize)
├── routes/       API endpoints
├── seeders/      Test data
└── index.js      Starts the server
```

Format the code with `npm run format`.

## Test user

| Email                     | Password      |
| ------------------------- | ------------- |
| `technician@pulseapi.com` | `password123` |

## Login

```http
POST /login
Content-Type: application/json

{ "email": "technician@pulseapi.com", "password": "password123" }
```

Returns a token:

```json
{ "token": "eyJhbGciOi..." }
```

Send it on protected endpoints:

```http
Authorization: Bearer eyJhbGciOi...
```

Requests without a valid token get `401 Unauthorized`.
