# KindMatch — Debug & AWS Deployment Fix Log

## 🔴 Critical Bugs Fixed

### Bug #1 — Duplicate entry point (`src/index.js` vs `src/main.jsx`)
**File removed:** `frontend/src/index.js`  
**Why:** Both files exported identical React root renders. Vite reads `main.jsx` (referenced in `index.html`), making `index.js` dead code — but it caused confusion in bundling and broke some editor tooling. Removed the orphan.

### Bug #2 — Live credentials committed to Git
**Files changed:** `backend/.env`, `backend/.env.example`  
**Why:** `backend/.env` contained a real MongoDB Atlas password and a real JWT secret and was included in the zip (and likely committed to Git). Both have been scrubbed.  
**Action required:** 
1. **Rotate your MongoDB Atlas password immediately** — go to Atlas → Database Access → Edit user → change password
2. **Generate a new JWT secret:** `openssl rand -hex 64`
3. Fill both into `backend/.env` before deploying

### Bug #3 — Backend had no static file serving (React 404 in production)
**File changed:** `backend/server.js`  
**Why:** Express had no `express.static()` call and no SPA catch-all route. In production on AWS, hitting `/discover` or `/matches` directly returned a 404 because Node didn't know to serve `index.html` for client-side routes. Fixed with:
```js
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
```

### Bug #4 — Frontend API URL hardcoded to `localhost:5000` (broken in production)
**File changed:** `frontend/.env`, `frontend/.env.example`  
**Why:** `VITE_API_URL=http://localhost:5000/api` gets baked into the Vite build bundle at compile time. On AWS, that resolves to nothing. Changed to `VITE_API_URL=/api` — a relative path that works in both dev (Vite proxy forwards it) and production (Nginx routes `/api/` to Node).

### Bug #5 — Vite dev proxy only, no production build config
**File changed:** `frontend/vite.config.js`  
**Why:** No `build` config at all — no source maps setting, no chunk splitting, no size warning tuning. Added `manualChunks` to split `react`/`react-dom`/`react-router-dom` into a separate `vendor` chunk for better browser caching. The `/api` proxy still works in dev.

---

## 🟡 Medium Bugs Fixed

### Bug #6 — `server.js` missing `path` module, no `0.0.0.0` bind
**File changed:** `backend/server.js`  
**Why:** `path` was never required (needed for `express.static`). Also, `app.listen(PORT)` without a host defaults to `127.0.0.1` on some Node versions — AWS needs `0.0.0.0` to accept external traffic.

### Bug #7 — No `engines` field → wrong Node version on AWS
**Files changed:** `backend/package.json`, `frontend/package.json`  
**Why:** Without `"engines": {"node": ">=18"}`, AWS Elastic Beanstalk and some EC2 setups boot with the system default Node (often v12 or v14), which fails on optional chaining, `??` operator, and other ES2020+ syntax used throughout the codebase.

### Bug #8 — No health check endpoint for AWS Load Balancer
**File changed:** `backend/server.js`  
**Why:** AWS ALB/ELB marks instances as unhealthy and terminates them if they don't return HTTP 200 on the health check path. Added `GET /health` that checks MongoDB connection state and returns `200 ok` or `503 error`.

### Bug #9 — CORS breaks if `FRONTEND_URL` env var not set
**File changed:** `backend/server.js` (no code change — documented)  
**Why:** The `allowedOrigins` array filters `null`/`undefined` with `.filter(Boolean)`, so a missing `FRONTEND_URL` won't crash — but the production domain won't be whitelisted. Ensure `FRONTEND_URL=https://yourdomain.com` is in `backend/.env` on the server.

### Bug #10 — No graceful shutdown or error safety net
**File changed:** `backend/server.js`  
**Why:** PM2 sends `SIGTERM` before killing a process for a reload/restart. Without a handler, Node exits mid-request and in-flight MongoDB writes can be lost. Added `SIGTERM`/`SIGINT` handlers that close the HTTP server first, then close the DB connection cleanly. Also added `uncaughtException` and `unhandledRejection` handlers.

### Bug #14 — `setup.sh` referenced `npm start` for frontend (wrong for Vite)
**File changed:** `setup.sh`  
**Why:** CRA projects use `npm start`; Vite projects use `npm run dev`. The old script would error. Fixed to `npm run dev`. Also bumped the minimum Node check from 16 → 18.

---

## 🟢 New Files Added for AWS Deployment

### `ecosystem.config.js` — PM2 process manager config
- Cluster mode (one worker per CPU core)
- `env_production` block sets `NODE_ENV=production`
- 512MB memory limit with auto-restart
- Log files at `/var/log/kindmatch/`
- 10s graceful kill timeout

### `nginx/kindmatch.conf` — Nginx reverse proxy config
- Routes `/api/*` → Node/Express on port 5000
- Routes `/assets/*` → static files with 1-year immutable cache
- SPA catch-all: `try_files $uri $uri/ /index.html` for React Router
- Gzip compression for JS/CSS/JSON
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- HTTPS/Certbot block (commented out — uncomment after `certbot --nginx`)

### `deploy.sh` — One-command AWS deployment
- Installs Node 20, Nginx, PM2 on fresh Ubuntu EC2
- Clones repo, installs deps, builds frontend, configures Nginx, starts PM2
- `--update` flag for subsequent deploys (zero-downtime PM2 reload)
- Prints public IP + health check URL on completion

---

## ⚡ Action Checklist Before Going Live

```
[ ] Rotate MongoDB Atlas password (old one was exposed)
[ ] Generate new JWT_SECRET: openssl rand -hex 64
[ ] Fill in backend/.env on your server with real values
[ ] Set NODE_ENV=production in backend/.env on server
[ ] Set FRONTEND_URL=https://yourdomain.com in backend/.env
[ ] Edit nginx/kindmatch.conf — replace 'yourdomain.com' with real domain
[ ] Edit deploy.sh — replace REPO_URL with your GitHub repo URL
[ ] Point domain A record to EC2 Elastic IP
[ ] Run: sudo certbot --nginx  (for HTTPS)
[ ] Open EC2 Security Group ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
[ ] Close port 5000 in Security Group (Nginx proxies it — no public exposure needed)
```
