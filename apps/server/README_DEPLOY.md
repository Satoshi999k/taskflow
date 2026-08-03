# Deploying TaskFlow Backend to Supabase

This backend is a Node.js/Express app with Prisma. For Supabase, deploy using Supabase Edge Functions or a separate containerized backend.

## Recommended path

1. Use Supabase Postgres for the database.
2. Deploy a standalone Node.js app on Vercel or another host.
3. Point the frontend to your backend URL.

## Required environment variables

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES`
- `JWT_REFRESH_EXPIRES`
- `CLIENT_URL`

## Vercel deployment

1. Connect your repo to Vercel.
2. Set the `apps/server` project root in Vercel.
3. Configure environment variables in Vercel.
4. Use Vercel builds to compile TypeScript and run `npm start`.

## Notes for Supabase

Supabase can host the database. The backend itself should remain a separate Node.js service for Express + Socket.IO.
