# Finuance troubleshooting

## API health check fails

Start the backend from `backend/` with `npm run dev`, then open
`http://localhost:5000/api/health`. Check the backend terminal for errors.

## PostgreSQL connection fails

- Confirm PostgreSQL is running and reachable.
- Check `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in
  `backend/.env`.
- Confirm the database and required tables exist. This repository does not
  currently provide migrations or a database seed script.

## Frontend cannot load finance data

- Start the backend and verify `/api/health`.
- Check that `VITE_API_BASE_URL` in `frontend/.env` points to the backend API;
  its default is `http://localhost:5000/api`.
- Inspect the browser console and backend terminal for request errors.

## Missing npm dependencies

Install dependencies from the relevant project directory:

```bash
cd backend
npm ci
```

```bash
cd frontend
npm ci
```

There is no root-level npm package. Frontend and backend dependencies are
installed independently.
