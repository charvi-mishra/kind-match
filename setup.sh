#!/bin/bash
echo ""
echo "💚 KindMatch — Local Dev Setup"
echo "==============================="
echo ""

# Check node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install backend deps
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then echo "❌ Backend install failed"; exit 1; fi
echo "✅ Backend ready"

# Install frontend deps
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
if [ $? -ne 0 ]; then echo "❌ Frontend install failed"; exit 1; fi
echo "✅ Frontend ready"

# Setup .env files
cd ..
echo ""
echo "⚙️  Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env — fill in your MONGO_URI and JWT_SECRET"
else
    echo "ℹ️  backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env — VITE_API_URL=/api is set (Vite proxy handles it locally)"
else
    echo "ℹ️  frontend/.env already exists"
fi

echo ""
echo "🚀 Setup complete! To start:"
echo ""
echo "   Terminal 1 — backend:"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 — frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "   Open: http://localhost:3000"
echo ""
echo "💚 Happy matching!"
