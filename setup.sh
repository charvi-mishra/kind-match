#!/bin/bash
echo ""
echo "💚 KindMatch Setup"
echo "=================="
echo ""

# Check node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js 16+ required. Current: $(node -v)"
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
    echo "✅ Created backend/.env — please edit with your MongoDB URI and JWT secret"
else
    echo "ℹ️  backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env — add Firebase credentials for Google sign-in"
else
    echo "ℹ️  frontend/.env already exists"
fi

echo ""
echo "🚀 Setup complete! To start the app:"
echo ""
echo "   Terminal 1 (backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (frontend):"
echo "   cd frontend && npm start"
echo ""
echo "   Then open: http://localhost:3000"
echo ""
echo "💚 Happy matching!"
