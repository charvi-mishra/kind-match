#!/bin/bash
# =============================================================================
# KindMatch — AWS EC2 Deployment Script (Ubuntu 22.04 / 24.04)
# =============================================================================
# Run this ONCE on a fresh EC2 instance to install everything.
# After first run, use: ./deploy.sh --update  to pull & redeploy.
# =============================================================================

set -e  # Exit immediately on any error

# ── Colours ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }

echo ""
echo "💚 KindMatch AWS Deployment"
echo "============================"
echo ""

UPDATE_MODE=false
if [[ "$1" == "--update" ]]; then
  UPDATE_MODE=true
  warn "Update mode — skipping system package install"
fi

APP_DIR="/home/ubuntu/kindmatch"
LOG_DIR="/var/log/kindmatch"

# =============================================================================
# FIRST-TIME SETUP
# =============================================================================
if [ "$UPDATE_MODE" = false ]; then

  # ── 1. System packages ──────────────────────────────────────────────────────
  echo "📦 Installing system packages..."
  sudo apt-get update -q
  sudo apt-get install -y curl git nginx
  ok "System packages installed"

  # ── 2. Node.js 20 via NodeSource ────────────────────────────────────────────
  echo "📦 Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  node_version=$(node -v)
  ok "Node.js $node_version installed"

  # ── 3. PM2 ──────────────────────────────────────────────────────────────────
  echo "📦 Installing PM2..."
  sudo npm install -g pm2
  ok "PM2 installed"

  # ── 4. Log directory ────────────────────────────────────────────────────────
  sudo mkdir -p "$LOG_DIR"
  sudo chown ubuntu:ubuntu "$LOG_DIR"
  ok "Log directory created at $LOG_DIR"

fi

# =============================================================================
# APP DEPLOYMENT (runs on both first-time and --update)
# =============================================================================

# ── 5. Clone / pull repo ────────────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  echo "🔄 Pulling latest code..."
  cd "$APP_DIR"
  git pull origin master
  ok "Code updated"
else
  echo "📂 Cloning repository..."
  warn "Update REPO_URL below with your actual GitHub repo URL"
  REPO_URL="https://github.com/YOUR_USERNAME/kindmatch.git"
  git clone "$REPO_URL" "$APP_DIR"
  ok "Repository cloned to $APP_DIR"
fi

cd "$APP_DIR"

# ── 6. Backend .env ─────────────────────────────────────────────────────────
if [ ! -f "$APP_DIR/backend/.env" ]; then
  err "backend/.env not found! Copy it to $APP_DIR/backend/.env and fill in your values. See backend/.env.example"
fi
ok "backend/.env found"

# ── 7. Install backend dependencies ─────────────────────────────────────────
echo "📦 Installing backend dependencies..."
cd "$APP_DIR/backend"
npm ci --omit=dev
ok "Backend dependencies installed"

# ── 8. Install & build frontend ─────────────────────────────────────────────
echo "📦 Installing frontend dependencies..."
cd "$APP_DIR/frontend"
npm ci

echo "🔨 Building frontend..."
# VITE_API_URL=/api works because Nginx routes /api → Node and / → dist/
VITE_API_URL=/api npm run build
ok "Frontend built → frontend/dist"

# ── 9. Nginx ────────────────────────────────────────────────────────────────
echo "🌐 Configuring Nginx..."
sudo cp "$APP_DIR/nginx/kindmatch.conf" /etc/nginx/sites-available/kindmatch
# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/kindmatch /etc/nginx/sites-enabled/kindmatch

sudo nginx -t || err "Nginx config test failed — check /etc/nginx/sites-available/kindmatch"
sudo systemctl enable nginx
sudo systemctl reload nginx
ok "Nginx configured and reloaded"

# ── 10. PM2 ─────────────────────────────────────────────────────────────────
echo "🚀 Starting app with PM2..."
cd "$APP_DIR"

if pm2 list | grep -q "kindmatch-api"; then
  echo "  Reloading existing PM2 process (zero-downtime)..."
  pm2 reload ecosystem.config.js --env production
else
  echo "  Starting new PM2 process..."
  pm2 start ecosystem.config.js --env production
fi

pm2 save
ok "PM2 process running"

# ── 11. PM2 startup (first-time only) ───────────────────────────────────────
if [ "$UPDATE_MODE" = false ]; then
  echo "🔧 Configuring PM2 to auto-start on reboot..."
  pm2_startup=$(pm2 startup | tail -1)
  # pm2 startup prints a sudo command — execute it
  if [[ "$pm2_startup" == sudo* ]]; then
    eval "$pm2_startup"
    ok "PM2 startup configured"
  else
    warn "Could not auto-configure PM2 startup. Run 'pm2 startup' manually and follow instructions."
  fi
fi

# =============================================================================
# DONE
# =============================================================================
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "   App:    http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')"
echo "   Health: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')/health"
echo "   Logs:   pm2 logs kindmatch-api"
echo "   Status: pm2 status"
echo ""
echo "Next steps:"
echo "  1. Point your domain's A record to this EC2 IP"
echo "  2. Update /etc/nginx/sites-available/kindmatch — replace 'yourdomain.com'"
echo "  3. Run: sudo certbot --nginx  (for HTTPS / SSL)"
echo "  4. Update backend/.env: NODE_ENV=production, FRONTEND_URL=https://yourdomain.com"
echo ""
