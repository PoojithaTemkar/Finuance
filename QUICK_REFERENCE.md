# Finuance quick reference

## Start the app

Configure `backend/.env` with PostgreSQL connection settings and ensure the
database schema expected by the API exists. Migrations and seed scripts are
not currently included.

In one terminal:

```bash
cd backend
npm ci
npm run dev
```

In another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open the Vite development URL shown in the frontend terminal. The backend
defaults to `http://localhost:5000`; its health endpoint is
`http://localhost:5000/api/health`.

## Frontend commands

Run these from `frontend/`:

```bash
npm run build
npm run lint
```

## API routes

| Area | Routes |
|---|---|
| Transactions | `/api/transactions` |
| Categories | `/api/categories` |
| Budgets | `/api/budgets` |
| Analytics | `/api/analytics/summary`, `/category-spending`, `/monthly`, `/budget-performance`, `/recent-transactions` |

See `backend/routes/` for methods, payloads, and response fields.
