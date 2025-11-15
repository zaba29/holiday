# Holiday Management Platform

A full-stack holiday and absence management portal for small UK companies. It provides employee self-service for registration, leave booking, and calendars, plus administrative controls for HR.

## Features
- Secure authentication with role-based dashboards (Admin & Employee).
- Employee self-registration with admin approval workflow and email notifications.
- Personal dashboards showing allocation, taken days, remaining balance, and upcoming leave.
- Admin dashboards with pending registration counts, leave approvals, employee management, and company-wide calendar context.
- Leave booking flow with validation against UK bank holidays and available allowance.
- Admin tools to approve, reject, or request more information for leave and registration requests.
- Configurable SMTP email notifications and UK bank holiday list.
- Prisma/PostgreSQL data layer with seed script for the initial admin user (`admin@work.flow` / `admin` — development only, change immediately in production).
- React + Material UI frontend with responsive layout and calendar widget.
- Jest unit tests for core service flows (registration, login, leave lifecycle).

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Nodemailer
- **Frontend:** React (Vite, TypeScript), Material UI
- **Auth:** JWT bearer tokens with rate-limited login endpoint
- **Emails:** SMTP via Nodemailer (configurable via environment variables)

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 14+

### Backend setup
```bash
cd backend
cp .env.example .env
# edit .env with DATABASE_URL, SMTP, admin email, etc.
npx prisma migrate dev
npm run prisma:generate
npm run build
npm start
```

To seed the default admin user (credentials meant for development only):
```bash
npx prisma db seed --preview-feature
```

### Default development login

After seeding, sign in with the following credentials (development convenience only—change or delete immediately in any real deployment):

- **Email:** `admin@work.flow`
- **Password:** `admin`

The login screen will redirect to the setup wizard if no users exist. Seeding ensures you can reach the admin dashboard without running the wizard manually during local development.

### Frontend setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
The Vite dev server runs on port 5173 by default.

### Tests
Run backend unit tests (mocks for Prisma & email layer):
```bash
cd backend
npm test
```

## Environment Variables
Key backend variables (see `.env.example` for full list):
- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – secret used to sign tokens
- `ADMIN_EMAIL` – recipient for system notifications
- `SMTP_*` – SMTP host credentials for Nodemailer
- `DEFAULT_ANNUAL_ALLOCATION` – default holiday allowance in days
- `APP_URL` / `BACKEND_URL` – used when building email links

Frontend expects `VITE_API_URL` to point at the backend `/api` base.

## Project Structure
```
backend/
  src/
    controllers/ routes/ services/ middleware/ config/
    tests/ (Jest unit tests)
  prisma/
    schema.prisma
    seed.ts
frontend/
  src/
    pages/ components/ context/
```

## Security Notes
- Passwords are hashed with bcrypt before storage.
- Login endpoint is rate limited.
- CSRF protection enabled for browser clients (disabled only in automated tests).
- Emails and admin credentials should be rotated before production use.

## Development Workflow
1. Start PostgreSQL and run Prisma migrations.
2. Launch backend via `npm run dev` (with Nodemon) and frontend via `npm run dev`.
3. Access http://localhost:5173 for the UI; backend defaults to http://localhost:4000.

## Bank Holidays
UK (England & Wales) bank holidays for 2024-2025 are bundled in both backend and frontend so they can be surfaced in calendars and validation rules. Update `backend/src/config/bankHolidays.ts` and `frontend/src/data/bankHolidays.ts` annually.

## CSV Export & Extensions
The admin API includes skeletons for user management. Extend `userRoutes` and related services to add CSV export, password resets, department filtering, and calendar enhancements as needed.
