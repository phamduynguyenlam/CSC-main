#!/bin/bash

echo "🚀 Setting up SentiMind Full Stack Application"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "🔧 Creating production build..."
npm run build

echo "🌟 Setup complete! To start the application:"
echo ""
echo "For development:"
echo "  Frontend: npm run dev (runs on http://localhost:5173)"
echo "  Backend: cd backend && npm run dev (runs on http://localhost:3001)"
echo ""
echo "For production:"
echo "  cd backend && npm start (serves both frontend and backend on http://localhost:3001)"
echo ""
echo "📝 Don't forget to add your Google Gemini API key to .env.local:"
echo "  API_KEY=your_google_gemini_api_key_here"