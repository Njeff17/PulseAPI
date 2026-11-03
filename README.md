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
