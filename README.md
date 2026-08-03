# TaskFlow — Project Management SaaS Application

A full-stack, multi-tenant project management application scaffold for building a portfolio-grade SaaS product with authentication, RBAC, real-time collaboration, file uploads, search, notifications, and Docker deployment.

## Project structure

- `apps/client` — React + Vite frontend
- `apps/server` — Node.js + Express backend
- `packages/shared-types` — shared DTO types for client/server
- `.github/workflows/ci.yml` — CI pipeline
- `docker-compose.yml` — local development stack

## Getting started

1. Install dependencies in frontend and backend.
2. Configure `.env` files for server and client.
3. Run `docker compose up --build`.

## Core features

- Multi-tenant workspaces
- Boards, lists, cards, comments, attachments
- Real-time board updates via Socket.IO
- JWT auth with access/refresh tokens
- PostgreSQL + Prisma ORM
- Redis and MinIO local stack
- API docs with Swagger

## Deployment readiness

- Backend is prepared to use Supabase Postgres via `DATABASE_URL`.
- Frontend is Vercel-ready with `apps/client/vercel.json` and `VITE_API_URL` support.
- Backend uses `apps/server/.env.example` for production environment variable setup.
- Frontend uses `apps/client/.env.example` for Vercel environment variables.

## Deploying frontend

1. Create a Vercel project with root `apps/client`.
2. Set `VITE_API_URL` to your deployed backend URL.
3. Set `VITE_SOCKET_URL` to your backend Socket.IO URL.
4. Vercel will run `npm install` and `npm run build`.

## Deploying backend

1. Use Supabase Postgres as the database.
2. Deploy the backend as a separate Node.js service (Vercel, Render, Fly, Railway, or container host).
3. Configure environment variables from `apps/server/.env.example`.
4. If using Vercel, point the project to `apps/server`.

## Backend environment variables

Set these in your deployment provider:

- `DATABASE_URL` — Supabase Postgres direct connection string
- `JWT_ACCESS_SECRET` — secret for access tokens
- `JWT_REFRESH_SECRET` — secret for refresh tokens
- `JWT_ACCESS_EXPIRES` — e.g. `15m`
- `JWT_REFRESH_EXPIRES` — e.g. `7d`
- `CLIENT_URL` — frontend origin URL

## Frontend environment variables

Set these in your deployment provider or `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`
- `VITE_API_URL`
- `VITE_SOCKET_URL`
