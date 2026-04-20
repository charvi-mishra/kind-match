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

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Visit: **http://localhost:3000**

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
| Storage | 20 GB gp3 (default 8 GB is fine too) |

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

## STEP 4 — Install Node.js via NVM

NVM lets you manage multiple Node versions and avoids permission issues with global npm packages.

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into current shell session (also added to ~/.bashrc automatically)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verify NVM is working
nvm --version

# Install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

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

---

## STEP 6 — MongoDB Atlas Setup

> We use MongoDB Atlas (cloud) instead of installing MongoDB on EC2. It's free, managed, and more reliable.

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Create a free account** (or sign in)
2. Click **Build a Database** → choose **M0 Free Tier** → select a region close to your EC2 region (e.g. `ap-south-1` for Mumbai)
3. **Database Access** tab → **Add New Database User**:
   - Username: `kindmatch`
   - Password: generate a strong one, save it
   - Role: **Read and write to any database**
4. **Network Access** tab → **Add IP Address**:
   - For now: click **Allow Access from Anywhere** (`0.0.0.0/0`) to get started
   - For production hardening: replace with your EC2 **Elastic IP** once you have one
5. **Database** tab → click **Connect** → **Drivers** → copy the connection string:

```
mongodb+srv://kindmatch:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kindmatch?retryWrites=true&w=majority
```

> Save this string — you'll need it in Step 9.

---

## STEP 7 — Clone Your Repository

```bash
# Clone into home directory
git clone https://github.com/YOUR_USERNAME/kindmatch.git /home/ubuntu/kindmatch

cd /home/ubuntu/kindmatch
ls   # should show backend/ frontend/ README.md etc.
```

If your repo is private, use a **Personal Access Token**:
```bash
git clone https://YOUR_GITHUB_TOKEN@github.com/YOUR_USERNAME/kindmatch.git /home/ubuntu/kindmatch
```

---

## STEP 8 — Install Dependencies & Build Frontend

```bash
# Backend dependencies
cd /home/ubuntu/kindmatch/backend
npm install --omit=dev

# Frontend — install and build static files
cd /home/ubuntu/kindmatch/frontend
npm install
npm run build
```

The build output lands in `frontend/dist/` — Nginx will serve this folder as static files.

Verify the build succeeded:
```bash
ls /home/ubuntu/kindmatch/frontend/dist
# should show: index.html  assets/
```

---

## STEP 9 — Configure Environment Variables

### Backend `.env`

```bash
nano /home/ubuntu/kindmatch/backend/.env
```

Paste and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://kindmatch:YOUR_ATLAS_PASSWORD@cluster0.xxxxx.mongodb.net/kindmatch?retryWrites=true&w=majority
JWT_SECRET=generate_a_long_random_string_minimum_64_characters_here
NODE_ENV=production
```

> Generate a strong JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```
> Copy the output and paste it as your `JWT_SECRET`.

Save and exit: `Ctrl+X` → `Y` → `Enter`

### Frontend `.env`

```bash
nano /home/ubuntu/kindmatch/frontend/.env
```

```env
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP/api
```

> If you have a domain name: `VITE_API_URL=https://yourdomain.com/api`

Save and exit. Then **rebuild the frontend** so it picks up the new env var:

```bash
cd /home/ubuntu/kindmatch/frontend
npm run build
```

---

## STEP 10 — Update CORS for Production

```bash
nano /home/ubuntu/kindmatch/backend/server.js
```

Find the `cors` block and update the `origin` array:

```js
app.use(cors({
  origin: [
    'http://YOUR_EC2_PUBLIC_IP',
    'https://yourdomain.com'    // add if you have a domain
  ],
  credentials: true
}));
```

Save and exit.

---

## STEP 11 — Start Backend with PM2

```bash
cd /home/ubuntu/kindmatch/backend

# Start the backend process
pm2 start server.js --name kindmatch-backend

# Check it's running
pm2 status
```

You should see `kindmatch-backend` with status `online`.

```bash
# View live logs (Ctrl+C to exit)
pm2 logs kindmatch-backend

# Quick health check
curl http://localhost:5000/
# should return: {"message":"KindMatch API running 💚"}
```

### Make PM2 survive server reboots

```bash
pm2 save

pm2 startup
```

PM2 will print a command like:
```
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

**Copy that exact command** and run it. This registers PM2 as a systemd service.

---

## STEP 12 — Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/kindmatch
```

Paste this full config (replace `YOUR_EC2_PUBLIC_IP` with your actual IP or domain):

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    # Serve built React frontend from dist/
    root /home/ubuntu/kindmatch/frontend/dist;
    index index.html;

    # React Router support — unknown paths fall back to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy all /api/* requests to Node.js backend on port 5000
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

Save and exit, then enable the site:

```bash
# Enable kindmatch site
sudo ln -s /etc/nginx/sites-available/kindmatch /etc/nginx/sites-enabled/

# Remove the default Nginx placeholder site
sudo rm -f /etc/nginx/sites-enabled/default

# Test the config for syntax errors
sudo nginx -t
# Expected: "syntax is ok" and "test is successful"

# Reload Nginx to apply changes
sudo systemctl reload nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

---

## STEP 13 — Verify Everything is Working

```bash
# 1. PM2 process is online
pm2 status

# 2. Backend responds directly
curl http://localhost:5000/
# → {"message":"KindMatch API running 💚"}

# 3. Backend responds through Nginx proxy
curl http://YOUR_EC2_PUBLIC_IP/api
# → {"message":"KindMatch API running 💚"}

# 4. Nginx is running
sudo systemctl status nginx

# 5. Check backend logs for any errors
pm2 logs kindmatch-backend --lines 50
```

Now open **`http://YOUR_EC2_PUBLIC_IP`** in your browser — KindMatch should be live. 💚

---

## STEP 14 — (Optional) HTTPS with a Domain + Certbot

> You need a domain name pointed to your EC2 IP for this step. Set an A record in your DNS provider pointing to your EC2 Public IP.

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your actual domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will:
- Verify domain ownership
- Issue a free Let's Encrypt certificate
- Automatically update your Nginx config to redirect HTTP → HTTPS

```bash
# Test auto-renewal (runs every 90 days automatically)
sudo certbot renew --dry-run
```

After this, update your frontend env and rebuild:
```bash
nano /home/ubuntu/kindmatch/frontend/.env
# Change to: VITE_API_URL=https://yourdomain.com/api

cd /home/ubuntu/kindmatch/frontend
npm run build

pm2 restart kindmatch-backend
sudo systemctl reload nginx
```

---

## STEP 15 — Redeploy Script (for future updates)

Save this as `/home/ubuntu/kindmatch/deploy.sh`:

```bash
nano /home/ubuntu/kindmatch/deploy.sh
```

```bash
#!/bin/bash
set -e

echo "🚀 Starting KindMatch deployment..."
cd /home/ubuntu/kindmatch

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing backend dependencies..."
cd backend && npm install --omit=dev && cd ..

echo "🔨 Building frontend..."
cd frontend && npm install && npm run build && cd ..

echo "♻️  Restarting backend..."
pm2 restart kindmatch-backend

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ KindMatch deployed successfully!"
pm2 status
```

```bash
chmod +x /home/ubuntu/kindmatch/deploy.sh
```

Deploy any future update with one command:
```bash
cd /home/ubuntu/kindmatch && ./deploy.sh
```

---

## Troubleshooting

### Backend won't start
```bash
pm2 logs kindmatch-backend --lines 100
# Look for: missing .env, wrong MONGO_URI, port already in use
```

### Nginx 502 Bad Gateway
```bash
# Backend is probably not running
pm2 status
pm2 restart kindmatch-backend
```

### Nginx 404 on page refresh
```bash
# Make sure try_files $uri $uri/ /index.html; is in your Nginx config
sudo nginx -t && sudo systemctl reload nginx
```

### Can't connect to MongoDB Atlas
```bash
# Test the connection string directly
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('Connected!'); process.exit(0); })
  .catch(e => { console.error(e.message); process.exit(1); });
" 
# Also check: Atlas Network Access has your EC2 IP whitelisted
```

### NVM not found after reconnecting SSH
```bash
# Reload NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
```

### PM2 process not found after reboot
```bash
# Re-run startup command
pm2 startup
# Copy and run the printed command, then:
pm2 start /home/ubuntu/kindmatch/backend/server.js --name kindmatch-backend
pm2 save
```

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

## 🎨 Design System

- **Primary:** `#00ff87` (electric green)
- **Background:** `#0a0a0a` (near-black)
- **Display font:** Syne 800
- **Body font:** DM Sans
- **Aesthetic:** Dark, Gen Z, raw honesty

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

*Built with 💚 for the emotionally self-aware generation*
