# Deploying TaskFlow Frontend to Vercel

This frontend is a Vite + React app.

## Recommended path

1. Connect the repo to Vercel.
2. Set the project root to `apps/client`.
3. Configure environment variables:
   - `VITE_API_URL` → backend API URL
   - `VITE_SOCKET_URL` → backend Socket.IO URL
4. Vercel will run `npm install` and `npm run build`.

## Build output

- Production files are served from `dist`.
- Use the `vercel.json` file to route all requests to `index.html`.
