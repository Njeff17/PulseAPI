# PulseAPI

A small API built with Node.js, Express and Sequelize, using a SQLite database.

## Tech stack

| Package     | What it's for                                        |
| ----------- | ---------------------------------------------------- |
| `express`   | Runs the API server and routes                       |
| `sequelize` | ORM — talks to the database with JavaScript, not SQL |
| `sqlite3`   | The SQLite driver Sequelize uses                     |

## Setup on a fresh machine

Requires Node.js 18 or newer.

**1. Install the packages** (Express, Sequelize and the SQLite driver)

```bash
npm install
```

To install them by hand in a new project instead:

```bash
npm install express sequelize sqlite3
```

**2. Create the database**

No separate database server is needed. Sequelize connects to SQLite using the settings in `index.js`:

```js
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "pulse.db",
  logging: false,
});
```

The database file `pulse.db` is created automatically the first time the server starts.

**3. Migrations**

There are no tables yet, so there are no migrations to run.

**4. Start the server**

```bash
npm run dev
```

You should see:

```
Connected to the database.
PulseAPI is running at http://localhost:3000
```

Open <http://localhost:3000/health>. You should see:

```json
{ "status": "ok", "message": "PulseAPI is running" }
```

## Commands

| Command       | What it does                                  |
| ------------- | --------------------------------------------- |
| `npm install` | Installs Express, Sequelize and SQLite        |
| `npm start`   | Starts the server                             |
| `npm run dev` | Starts the server and restarts it on changes  |

## Sequelize commands

These use the Sequelize CLI to manage tables and migrations. `npx` downloads it automatically the first time.

| Command                                                  | What it does                                       |
| -------------------------------------------------------- | -------------------------------------------------- |
| `npx sequelize-cli init`                                 | Creates the `config`, `models` and `migrations` folders |
| `npx sequelize-cli model:generate --name Note --attributes title:string` | Creates a model and its migration file |
| `npx sequelize-cli db:migrate`                           | Runs all migrations (creates the tables)           |
| `npx sequelize-cli db:migrate:undo`                      | Undoes the last migration                          |
| `npx sequelize-cli db:migrate:undo:all`                  | Undoes all migrations                              |
| `npx sequelize-cli db:migrate:status`                    | Shows which migrations have run                    |

The project has no tables yet, so you don't need these yet. You'll use them when the first table is added.

## API

| Method | URL       | What it does              |
| ------ | --------- | ------------------------- |
| GET    | `/health` | Checks the API is running |

## Resetting the database

Stop the server, delete `pulse.db`, and start the server again.
