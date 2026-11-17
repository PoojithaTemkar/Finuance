# Finuance

Finuance is a personal finance app with a React frontend built with Vite and an
Express API backed by PostgreSQL. The frontend reads and writes transactions,
categories, and budgets through the API.

## Project structure

- `frontend/` - React application and Vite scripts
- `backend/` - Express API, PostgreSQL connection, and route handlers

The old standalone HTML app and SQLite backend have been removed. Install and
run each application from its own directory; there is no root-level npm
package or start command.

## Requirements

- Node.js and npm
- A PostgreSQL server with the schema expected by the backend routes

The repository does not currently include database migrations or a seed
command. Create/configure the database schema before starting the API.

## Configure the backend

Create `backend/.env` with the connection settings used by
`backend/config/db.js`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finuance
DB_USER=postgres
DB_PASSWORD=your-local-password
```

Keep real credentials in `.env`; do not commit them.

Install and start the API from the `backend/` directory:

```bash
npm ci
npm run dev
```

Use `npm start` instead of `npm run dev` to start without Node's watch mode.
The API listens on `http://localhost:5000` by default. Check its health at
`http://localhost:5000/api/health`.

## Run the frontend

In a second terminal, from the `frontend/` directory:

```bash
npm ci
npm run dev
```

Open the Vite URL printed in the terminal (normally
`http://localhost:5173`). The frontend defaults to
`http://localhost:5000/api`; set `VITE_API_BASE_URL` in `frontend/.env` to
override that API base URL.

For a production frontend build, run `npm run build` in `frontend/`. Run
`npm run lint` there to check the frontend.

## API overview

- `GET /api/health` - Check API and PostgreSQL connectivity
- `/api/transactions` - Create, list, read, update, and delete transactions
- `/api/categories` - Create, list, read, update, and delete categories
- `/api/budgets` - Create, list, read, update, and delete budgets
- `/api/analytics/summary` - Income, expenses, and savings summary
- `/api/analytics/category-spending` - Spending grouped by category
- `/api/analytics/monthly` - Monthly income and expenses
- `/api/analytics/budget-performance` - Budget versus actual spending
- `/api/analytics/recent-transactions` - Most recent transactions

The API route files in `backend/routes/` define the request and response
fields. The API currently has no authentication; do not expose it publicly
with real financial data.
