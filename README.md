# PulseAPI

A small REST API for technicians to register monitoring devices and log voltage readings. A reading outside the safe range (0 V to 60 V) creates an alert.

## Tech stack

| Tool               | Why I chose it                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Node.js + Express  | Simple and widely used for REST APIs, with very little setup                                        |
| Sequelize (ORM)    | Talks to the database with JavaScript instead of raw SQL, and its CLI runs migrations and seeders   |
| SQLite             | No database server to install; the whole database is one file, so setup on a fresh machine is quick |
| bcryptjs           | Hashes passwords so they are never stored as plain text; pure JavaScript, so nothing to compile     |
| jsonwebtoken (JWT) | Creates the login token that protected endpoints check                                              |
| Jest + Supertest   | Jest runs the automated tests; Supertest sends requests to the API from inside the tests            |
| Prettier           | Keeps the code formatting consistent                                                                |

## Setup

Requires Node.js 20.6 or newer and Git.

```bash
git clone <repository-url>
cd PulseAPI
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm start
```

| Step                   | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `git clone ...`        | Downloads the code                                            |
| `cd PulseAPI`          | Opens the project folder                                      |
| `npm install`          | Installs the packages                                         |
| `cp .env.example .env` | Creates the settings file (Windows: `copy .env.example .env`) |
| `npm run db:migrate`   | Creates the database file `pulse.db` and its tables           |
| `npm run db:seed`      | Adds the test user                                            |
| `npm start`            | Starts the API at http://localhost:3000                       |

## Running tests

```bash
npm test
```

The tests use Jest and Supertest. They run against a temporary in-memory database, so `pulse.db` is not changed and the server does not need to be running.

The test plan is in [docs/test-plan.md](docs/test-plan.md).

## Project structure

```
PulseAPI/
├── config/       Database settings
├── docs/         Test plan
├── middleware/   Checks the login token on protected routes
├── migrations/   Creates the database tables
├── models/       Database models (Sequelize)
├── routes/       API endpoints
├── seeders/      Test data
├── tests/        Automated tests
├── app.js        Sets up the API (routes and error handling)
└── index.js      Starts the server
```

Format the code with `npm run format`.

## Test user

| Email                     | Password      |
| ------------------------- | ------------- |
| `technician@pulseapi.com` | `password123` |

## API endpoints

| Method   | Path                         | Description                          | Token needed |
| -------- | ---------------------------- | ------------------------------------ | ------------ |
| `POST`   | `/login`                     | Log in and get a token               | No           |
| `GET`    | `/api/devices`               | List all devices                     | Yes          |
| `POST`   | `/api/devices`               | Register a new device                | Yes          |
| `GET`    | `/api/devices/{id}`          | Get details of one device            | Yes          |
| `PATCH`  | `/api/devices/{id}`          | Update a device's name or location   | Yes          |
| `DELETE` | `/api/devices/{id}`          | Delete a device and all its readings | Yes          |
| `POST`   | `/api/devices/{id}/readings` | Submit a reading for a device        | Yes          |
| `GET`    | `/api/devices/{id}/readings` | List all readings for a device       | Yes          |
| `GET`    | `/api/alerts`                | List all alerts                      | Yes          |
| `DELETE` | `/api/alerts/{id}`           | Dismiss (delete) an alert            | Yes          |

Errors are returned as JSON, for example `{ "error": "Device not found" }`.

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

## Devices

All device endpoints require a token.

| Method   | Path                | Description                          |
| -------- | ------------------- | ------------------------------------ |
| `GET`    | `/api/devices`      | List all devices                     |
| `POST`   | `/api/devices`      | Register a new device                |
| `GET`    | `/api/devices/{id}` | Get details of one device            |
| `PATCH`  | `/api/devices/{id}` | Update a device's name or location   |
| `DELETE` | `/api/devices/{id}` | Delete a device and all its readings |

A device has a `name` (required), a `serialNumber` (required, unique) and a `location` (optional).

Register a device:

```http
POST /api/devices
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "Pump A", "serialNumber": "SN-001", "location": "Kigali" }
```

| Status | When                                   |
| ------ | -------------------------------------- |
| `201`  | Device created                         |
| `400`  | `name` or `serialNumber` is missing    |
| `404`  | Device not found (get, update, delete) |
| `409`  | `serialNumber` is already used         |

## Readings

All reading endpoints require a token.

| Method | Path                         | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| `POST` | `/api/devices/{id}/readings` | Submit a reading for a device  |
| `GET`  | `/api/devices/{id}/readings` | List all readings for a device |

A reading has a `voltage` (required, must be a number). The `timestamp` is set by the server.

Submit a reading:

```http
POST /api/devices/1/readings
Authorization: Bearer <token>
Content-Type: application/json

{ "voltage": 12.5 }
```

| Status | When                      |
| ------ | ------------------------- |
| `201`  | Reading saved             |
| `400`  | `voltage` is not a number |
| `404`  | Device does not exist     |

## Alerts

When a reading is below 0 V or above 60 V, an alert is created automatically. An alert stores the `deviceId`, the `voltage` and the `timestamp`.

All alert endpoints require a token.

| Method   | Path               | Description               |
| -------- | ------------------ | ------------------------- |
| `GET`    | `/api/alerts`      | List all alerts           |
| `DELETE` | `/api/alerts/{id}` | Dismiss (delete) an alert |

| Status | When                 |
| ------ | -------------------- |
| `204`  | Alert dismissed      |
| `404`  | Alert does not exist |

## Known limitations

- **SQLite** is fine for a small project but not for many users writing at the same time. With more time I would move to PostgreSQL; with Sequelize that is mostly a config change.
- **Tokens can't be cancelled.** A token stays valid for 1 hour, and there is no logout.
- **Dismissed alerts are deleted.** There is no history of past alerts once they are dismissed.
- **Simple input checks.** Fields are checked to make sure they are present and of the right type, but not for length or format (for example, a very long device name is accepted).
- **Tests build the test database with `sequelize.sync()`** instead of running the migrations, so a mistake in a migration would not be caught by the tests.

## AI Tools

I used Claude (Anthropic) through Claude Code in VS Code while building this project.

- **Learning:**  I used it to understand topics I was less familiar with, such as QA testing and good code formatting.

I have reviewed all the code and can explain and modify any part of it.
