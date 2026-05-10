# 🚀 HackPrinceton - SentiMind Setup Guide

## Quick Start for Collaborators

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Google Gemini API Key** (optional but recommended)

---

## ⚡ Quick Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/quack3rs/HackPrinceton.git
cd HackPrinceton
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Set Up Environment Variables
```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit the .env file (optional - app works without API key)
# Add your Google Gemini API key if you have one:
# API_KEY=your_google_gemini_api_key_here
```

### 4. Start the Application
```bash
# Terminal 1 - Start Backend (keep this running)
cd backend
npm start

# Terminal 2 - Start Frontend (in a new terminal)
cd ..
npm run dev
```

### 5. Open the Application
- **Frontend**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:3001

---

## 🔧 Detailed Setup

### Backend Setup
The backend includes:
- ✅ **VADER Sentiment Analysis** (works without API key)
- ✅ **Google Gemini AI** (optional enhancement)
- ✅ **Real-time API endpoints**
- ✅ **CORS configured for development**

### Frontend Setup
The frontend includes:
- ✅ **React 18 + TypeScript**
- ✅ **Tailwind CSS with custom animations**
- ✅ **Real-time dashboard with marquee tickers**
- ✅ **Dark/light theme toggle**

---

## 🎯 Key Features

### 1. **Word-Focused Sentiment Analysis**
- Test: "I am angry" → Correctly detects "Angry" emotion
- Test: "This is awesome" → Correctly detects "Excited" emotion
- Uses VADER lexicon for consistent word analysis

### 2. **Marquee Tickers**
- Live updates scroll horizontally
- Seamless looping animation
- Real-time CX insights

### 3. **Dual Analysis System**
- **Primary**: VADER-based analysis (always works)
- **Fallback**: Google Gemini AI (if API key provided)

---

## 🚨 Troubleshooting

### Port Issues
If ports are in use:
```bash
# Kill processes on specific ports
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

### Dependencies Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Missing .env File
```bash
# Create the .env file manually
touch backend/.env
echo "API_KEY=your_api_key_here" >> backend/.env
echo "FRONTEND_URL=http://localhost:5173" >> backend/.env
echo "PORT=3001" >> backend/.env
```

---

## 📝 API Testing

Test the sentiment analysis:
```bash
curl -X POST http://localhost:3001/api/gemini/analyze-transcript \
  -H "Content-Type: application/json" \
  -d '{"transcript":"I am excited about this project!"}'
```

Expected response:
```json
{
  "emotion": "Excited",
  "sentimentScore": 9,
  "intensity": "medium",
  "keyIndicators": ["excited"]
}
```

---

## 🎮 For HackPrinceton Demo

### Demo Scenarios
1. **Test Sentiment**: "I am angry" → Shows "Angry" emotion
2. **Test Marquee**: Watch live updates scroll horizontally  
3. **Test Themes**: Toggle between dark/light mode
4. **Test Audio**: Use live analysis features

### Quick Demo Commands
```bash
# Test API directly
curl -X POST http://localhost:3001/api/gemini/analyze-transcript \
  -H "Content-Type: application/json" \
  -d '{"transcript":"This is amazing!"}'

# Check health
curl http://localhost:3001/api/health
```

---

## 🤝 Contributing

1. **Make changes** to your local files
2. **Test locally** with `npm start` and `npm run dev`
3. **Commit changes** with `git add . && git commit -m "description"`
4. **Push to GitHub** with `git push origin main`

---

## 💡 Need Help?

- **Backend not starting**: Check if Node.js is installed and port 3001 is free
- **Frontend not loading**: Check if dependencies are installed (`npm install`)
- **API not working**: The app works without API key using VADER analysis
- **Marquee not moving**: Clear browser cache and refresh

**The application is designed to work without any API keys - sentiment analysis uses VADER lexicon by default!**