# 💚 KindMatch — Find Your Kind in GenZ Terms

A full-stack dating app built with the MERN stack that matches people based on psychological wound compatibility and shared mental health experiences.

---

## 🧠 How the Matching Works

### Parental Scale
Users rate themselves on a 0–100 scale between "Mom energy" and "Dad energy":
- **Tends to Mom (0–50):** `visible_wound = dad` · `hidden_wound = mom`
- **Tends to Dad (51–100):** `visible_wound = mom` · `hidden_wound = dad`

### Recommendation Algorithm (Priority Order)
1. **Opposite hidden wound** (40 pts) — highest priority
2. **Opposite visible wound** (30 pts)
3. **Similar mental disorders** (up to 20 pts)
4. **Similar age group** (up to 7 pts)
5. **Similar occupation** (3 pts)

### Swipe Mechanics
- **Swipe LEFT** = Match (like) 💚
- **Swipe RIGHT** = Pass ✗
- Mutual likes = KindMatch! 🎉

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (+ Firebase Google sign-in optional) |
| Styling | Custom CSS with CSS Variables |
| Fonts | Syne + DM Sans (Google Fonts) |
| Process Manager | PM2 |
| Web Server | Nginx |

---

## 📁 Project Structure

```
kindmatch/
├── backend/
│   ├── models/User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── matches.js
│   │   └── swipe.js
│   ├── middleware/auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── src/
    │   ├── config/firebase.js
    │   ├── context/AuthContext.js
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   ├── App.js
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── .env.example
```

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Firebase project (optional)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/kindmatch.git
cd kindmatch

cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Variables

**`backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kindmatch
JWT_SECRET=your_long_random_secret_here
NODE_ENV=development
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> Firebase is optional — email/password auth works fully without it.

### 3. Local Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Visit: **http://localhost:3000**

Visit: **http://localhost:8000**
---

---

# ☁️ AWS EC2 Deployment — Full Step-by-Step Guide

> Stack: Ubuntu 22.04 · NVM · Node.js 20 · PM2 · MongoDB Atlas · Nginx

---

## STEP 1 — Launch EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Set the following:

| Setting | Value |
|---------|-------|
| Name | `kindmatch-server` |
| AMI | **Ubuntu Server 22.04 LTS (HVM), SSD** |
| Architecture | 64-bit (x86) |
| Instance type | `t2.micro` (free tier) or `t2.small` for better performance |
| Key pair | Create new → name it `kindmatch-key` → download `.pem` file |
| Storage | 8 GB gp3 |

3. Under **Network Settings → Edit**, create a new Security Group named `kindmatch-sg` with these inbound rules:

| Type | Protocol | Port | Source | Why |
|------|----------|------|--------|-----|
| SSH | TCP | 22 | **My IP** | SSH access — your IP only, never 0.0.0.0/0 |
| HTTP | TCP | 80 | 0.0.0.0/0, ::/0 | Public web traffic via Nginx |
| HTTPS | TCP | 443 | 0.0.0.0/0, ::/0 | SSL (needed for Certbot later) |

> **Do NOT open port 5000 publicly.** Nginx proxies `/api` to it internally. MongoDB also stays private — accessed via Atlas over TLS.

4. Click **Launch Instance** and wait ~1 minute for it to start.

---

## STEP 2 — Connect to Your EC2 Instance

On your local machine:

```bash
# Fix key permissions (required on Mac/Linux)
chmod 400 ~/Downloads/kindmatch-key.pem

# SSH in (replace with your actual Public IPv4 DNS)
ssh -i ~/Downloads/kindmatch-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

> Find your Public IPv4 address in EC2 → Instances → click your instance.

On Windows, use **PuTTY** or **Windows Terminal** with the `.pem` file directly:
```bash
ssh -i C:\Users\YOU\Downloads\kindmatch-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## STEP 3 — Update System & Install Git

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential
```

---

## STEP 4 — Install Node.js 



```

# Install Node.js 20 LTS
sudo apt  install nodejs
sudo apt install -y npm

# Verify
node -v    # should print v20.x.x
npm -v     # should print 10.x.x
```

---

## STEP 5 — Install PM2 and Nginx

```bash
# PM2 — process manager (keeps Node running after SSH disconnect + auto-restarts on crash)
npm install -g pm2

# Nginx — web server / reverse proxy
sudo apt install -y nginx

# Verify
pm2 -v
nginx -v
```
# Building Backend...

# Setup 

## Step 1
```
nano /home/ubuntu/kindmatch/backend/.env
```
## Step 2

Contents backend:

```env
PORT=5000
MONGO_URI=mongodb+srv://charvi:vichar123@cluster0.8sftzpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=78f74d97a79dbf06354f49ac99f1575fb82bcb39ba58183b1a7e664f79d45f10673f0477895fb70810dc2d6a9256ebedc8881c633063e290a3e9b203a9abd862
NODE_ENV=production
FRONTEND_URL=https://kind-match.serveblog.net
```
## Step 3

### PM2 process 

```
# Copy and run the printed command, then:
pm2 start server.js 
pm2 status
pm2 save
```
## Step 4

# Building frontend...

```
cd frontend && npm install && npm run build && cd ..
```

## Step 5 Setup nginx 

```
sudo rm -f /etc/nginx/sites-enabled/default

sudo ln -sf /etc/nginx/sites-available/kindmatch /etc/nginx/sites-enabled/kindmatch

This removes the Nginx default placeholder page and replaces it with the KindMatch config.

```
### Note

```
Copy contents of kindmatch.conf manually 

sudo cp nginx/kindmatch.conf /etc/nginx/sites-available/kindmatch

sudo nginx -t

sudo systemctl reload nginx

```

## Step 4 Enable HTTPS with Certbot

```
Run this once after DNS is pointing to the server:

---

```
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```
sudo certbot --nginx -d kind-match.serveblog.net

```

Certbot will:
- Obtain a free Let's Encrypt SSL certificate
- Write the cert files to `/etc/letsencrypt/live/kind-match.serveblog.net/`
- Reload Nginx automatically

Verify auto-renewal is active:

```bash
sudo systemctl status certbot.timer
```

Test renewal without actually renewing:

```bash
sudo certbot renew --dry-run
```


## Verify Everything is Working

```bash
# 1. Check Nginx is running
sudo systemctl status nginx

# 2. Check PM2 process
pm2 status

# 3. Test the API health endpoint
curl https://kind-match.serveblog.net/health

# 4. Test the API directly on the server (bypassing Nginx)
curl http://localhost:5000/

# 5. Check backend logs for errors
pm2 logs kindmatch-api --lines 50
```
---
---
## Security Checklist Before Going Live

- [ ] SSH port 22 restricted to **your IP only** in Security Group (not 0.0.0.0/0)
- [ ] Port 5000 is **NOT** open in Security Group (Nginx proxies internally)
- [ ] `JWT_SECRET` is at least 64 random characters
- [ ] MongoDB Atlas Network Access is restricted to your **EC2 Elastic IP** (not 0.0.0.0/0)
- [ ] `NODE_ENV=production` is set in backend `.env`
- [ ] `.env` files are in `.gitignore` and never committed to git
- [ ] HTTPS enabled via Certbot (if you have a domain)

---
---

## 🔐 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/profile/getting-to-know` | JWT | Save parental scale + disorders |
| PUT | `/api/profile/update` | JWT | Update bio, age, photos |
| PUT | `/api/profile/social-links` | JWT | Update Instagram / WhatsApp |
| GET | `/api/profile/disorders-list` | — | Get all disorder options |

### Matches
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/matches/recommendations` | JWT | Get scored recommendations |
| GET | `/api/matches/my-matches` | JWT | Get mutual matches |

### Swipe
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/swipe/like` | JWT | Like a user |
| POST | `/api/swipe/dislike` | JWT | Pass on a user |

---


## 🧬 User Schema Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `email` | String | Required, unique |
| `country` | String | Required |
| `occupation` | String | Nullable if unemployed |
| `isUnemployed` | Boolean | Makes occupation null |
| `password` | String | Bcrypt hashed, never returned |
| `parentalScaleResult` | Number 0–100 | 0=mom, 100=dad |
| `identifiesMoreAs` | mom/dad | Derived from scale |
| `visibleWound` | mom/dad | Opposite of identity |
| `hiddenWound` | mom/dad | Same as identity |
| `mentalDisorders` | String[] | From 25-item checklist |
| `socialLinks.instagram` | String | Optional handle |
| `socialLinks.whatsapp` | String | Optional number |
| `liked` | ObjectId[] | Users swiped left on |
| `disliked` | ObjectId[] | Users swiped right on |
| `matches` | ObjectId[] | Mutual likes |

---

## 📱 Features

- ✅ Wound-based matching algorithm
- ✅ Responsive, mobile-first design
- ✅ Touch swipe gestures on mobile
- ✅ Mouse drag-to-swipe on desktop
- ✅ Animated card stack with compatibility score
- ✅ Match celebration popup
- ✅ Social links (Instagram + WhatsApp) on matches
- ✅ JWT authentication with 30-day expiry
- ✅ Protected routes
- ✅ Firebase Google sign-in (optional)

---

## 🔮 Future Ideas

- Real-time messaging (Socket.io)
- Photo upload (Cloudinary / S3)
- Push notifications
- Therapy resource recommendations
- Anonymous mood check-ins

---

**What it does:**

- Port 80 → redirects all traffic to HTTPS (301)
- Port 443 → serves the app over HTTPS
- `/api/*` → proxied to `http://127.0.0.1:5000` (Node/Express)
- `/health` → proxied to Node (for uptime checks)
- `/assets/*` → served from `frontend/dist/assets/` with 1-year cache
- `/*` → serves `frontend/dist/index.html` (React Router SPA catch-all)

---

## PM2 Process Management

The backend runs under PM2 using `ecosystem.config.js` in cluster mode (one worker per CPU core).

| Command | What it does |
|---------|-------------|
| `pm2 status` | Show all running processes |
| `pm2 logs kindmatch-api` | Tail live logs |
| `pm2 logs kindmatch-api --lines 100` | Last 100 log lines |
| `pm2 reload kindmatch-api` | Zero-downtime reload |
| `pm2 restart kindmatch-api` | Hard restart |
| `pm2 stop kindmatch-api` | Stop the process |
| `pm2 delete kindmatch-api` | Remove from PM2 |

Log files are written to:

```
/var/log/kindmatch/out.log      ← stdout
/var/log/kindmatch/error.log    ← stderr
```

---


## MongoDB Atlas — Allow EC2 IP

In Atlas → **Network Access** → **Add IP Address**, add your EC2 public IP.

To find your EC2 IP from the server:

```bash
curl -s http://169.254.169.254/latest/meta-data/public-ipv4
```

If the IP changes (e.g. after stopping/starting the instance), update both:
1. Atlas Network Access whitelist
2. No-IP A record

---

## Troubleshooting

**502 Bad Gateway**
- Backend is not running: `pm2 status` → `pm2 start ecosystem.config.js --env production`
- Check logs: `pm2 logs kindmatch-api`

**Nginx config test fails**
```bash
sudo nginx -t
# Fix any errors shown, then:
sudo systemctl reload nginx
```

**Certbot fails — DNS not resolving**
```bash
nslookup kind-match.serveblog.net
# Must return your EC2 IP before certbot will work
```

**MongoDB connection refused**
- Check Atlas Network Access — EC2 IP must be whitelisted
- Verify `MONGO_URI` in `backend/.env` is correct
- Check logs: `pm2 logs kindmatch-api`

**Frontend shows blank page / 404 on refresh**
- The SPA catch-all in Nginx (`try_files $uri $uri/ /index.html`) handles this
- If missing, React Router routes won't work on direct URL access


---
*Built with 💚 for the emotionally self-aware generation*
---






