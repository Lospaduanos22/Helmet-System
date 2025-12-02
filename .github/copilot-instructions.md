# Copilot instructions for Helmet-System

This project is a two-tier web app (React + Vite frontend, Express + MySQL backend). Use these notes to make focused, safe changes.

1) Big-picture architecture
- **Frontend:** `frontend/` — React + Vite app. Main service helper: `src/services/ApiService.js` (baseUrl set to `http://127.0.0.1:5001/api`). UI components live in `src/components/`.
- **Backend:** `backend/` — Express (ES modules). Entry: `backend/server.js`. DB connection: `backend/config/db.js` (MySQL via `mysql2/promise` pool). Controllers are in `backend/controllers/`; routes in `backend/routes/` and are mounted under `/api/*` in `server.js`.

2) Run & debug (developer workflows)
- Start backend: `cd backend && npm install` then `npm start` (runs `node server.js`). For live reload use `npx nodemon server.js` (nodemon is a devDependency).
- Start frontend: `cd frontend && npm install` then `npm run dev` (Vite dev server).
- CORS: server allows requests from Vite dev URLs. Backend listens on `0.0.0.0:5001` (see `server.js`) — the frontend `ApiService` points to `http://127.0.0.1:5001/api`.

3) Key API patterns & endpoints (use these examples when editing or adding endpoints)
- Login: `POST /api/users/login` — handled by `backend/controllers/userController.js`. Body: `{ username, password, role }`.
- Students: mounted at `/api/students` (`backend/routes/studentRoutes.js`):
  - `POST /api/students/create` — create student
  - `GET /api/students/:student_id` — get student
  - `PUT /api/students/change-password/:student_id` — change password
  - `PUT /api/students/update/:student_id` — update profile
- Admin: mounted at `/api/admin` (`backend/routes/adminRoutes.js`):
  - `PUT /api/admin/change-student-password` — admin reset
  - `GET /api/admin/lockers` and `PUT /api/admin/rename-locker` — locker management

4) Response & error conventions to follow
- Controllers typically return JSON shaped like `{ success: boolean, data?: any, message?: string }` (see `userController.loginUser`). Follow that shape when adding endpoints so the frontend's `ApiService` checks `res.ok` and expects minimal `message`/`data` fields.
- Database queries use `pool.query` and parameterized placeholders (`?`) for values. Keep parameterization for values to avoid SQL injection. Note: `userController` interpolates `${role}s` to choose a table — be careful if you change table-selection logic.

5) Project-specific conventions & patterns
- Code uses ES modules (`import` / `export`) across frontend and backend.
- Async controllers: use `async/await` and `try/catch`. On exceptions, controllers usually `console.error(err)` and `res.status(500).json({ success: false, message: 'Server error' })`.
- The frontend centralizes HTTP calls in `src/services/ApiService.js`. When you add an API route, update `ApiService` and components that call it (search for `ApiService` in `src/components`).

6) DB & environment notes
- `backend/config/db.js` loads `.env` via `dotenv`. Required env vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Use the connection pool (`pool`) from `config/db.js` when writing new DB access code.

7) Dependencies and potential gotchas
- Backend includes `jsonwebtoken` and `bcrypt`, but current login flow returns minimal user data and uses bcrypt for password checks. If you add JWT-based auth, follow the existing login patterns but ensure tokens are returned and validated in middleware.
- Server port explicitly set to `5001` (to avoid AirPlay port collision). Frontend expects the backend at `127.0.0.1:5001` — update both places if changing the port.

8) When making changes, follow this checklist
- Add/modify route: update `backend/routes/*` and corresponding controller in `backend/controllers/*`.
- If route is public to frontend, update `ApiService` base path (`frontend/src/services/ApiService.js`) and relevant UI components.
- Use parameterized SQL queries. Confirm table names/columns by reading existing controllers (e.g., `userController`, `studentController`).
- Preserve JSON response shape `{ success, data?, message? }` for compatibility.

9) Examples (copy/paste friendly)
- Start backend (dev nodemon):
```
cd backend
npx nodemon server.js
```
- Call the login endpoint (JS fetch example similar to `ApiService`):
```
fetch('http://127.0.0.1:5001/api/users/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ username: 'alice', password: 'secret', role: 'student' })
})
```

10) Useful files to inspect when working here
- `backend/server.js` — CORS, route mounting, port
- `backend/config/db.js` — DB pool and `.env` usage
- `backend/controllers/*.js` — business logic and SQL queries
- `backend/routes/*.js` — route paths
- `frontend/src/services/ApiService.js` — canonical client API calls and baseUrl
- `frontend/src/components/*` — where UI integrates with `ApiService`

If anything here is unclear or you'd like more detail (sample DB schema, env example, or a quick run script that starts both frontend and backend), tell me which part to expand and I will iterate.
