#!/bin/bash

echo "🎮 Starting WURDSMYTH Game Locally..."
echo ""
echo "========================================="
echo "  WURDSMYTH - Local Development"
echo "========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start backend server
echo "🚀 Starting backend server on port 3000..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Start frontend server
echo "🌐 Starting frontend server on port 8000..."
cd frontend
python3 -m http.server 8000 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ WURDSMYTH is running!"
echo ""
echo "========================================="
echo "  Access your game at:"
echo "========================================="
echo "🎮 Main Game:     http://localhost:8000"
echo "🔐 Login/Register: http://localhost:8000/auth.html"
echo "💚 API Health:     http://localhost:3000/api/health"
echo "📚 API Docs:       http://localhost:3000/api"
echo ""
echo "========================================="
echo "  New Features Available:"
echo "========================================="
echo "✨ User registration & login"
echo "✨ 12 unlockable badges"
echo "✨ XP and leveling system"
echo "✨ Progress tracking"
echo "✨ Leaderboard"
echo "✨ Guest mode (no login required)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
