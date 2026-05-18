
### ⚡ Setup (5 minutes)

#### 1. Clone and Install
```bash
git clone https://github.com/phamduynguyenlam/CSC-main.git
cd CSC-main
npm install
cd backend && npm install
```

#### 2. Set Up API Keys (REQUIRED)
```bash
# Copy the environment template
cp backend/.env.example backend/.env
```

**Edit `backend/.env` with your API keys:**
```bash
# Get from https://platform.openai.com/account/api-keys
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here

# Get from https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/
API_KEY=AIza-your-actual-gemini-key-here

# Leave these unchanged
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

#### 3. Start the Application
```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start frontend  
npm run dev
```

### 🔑 API Key Setup Help

**OpenAI API Key (Required for AI Chat):**
- Sign up at [OpenAI Platform](https://platform.openai.com/account/api-keys)
- Create new API key (starts with `sk-proj-`)
- Add billing method (pay-per-use, very affordable)

**Google Gemini API Key (Optional):**
- Visit [Google AI Studio](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/)
- Enable Generative Language API
- Create API key (starts with `AIza`)

### 🆘 Troubleshooting

**"OpenAI not working":** Check your API key format and billing setup
**"Port already in use":** Kill existing processes: `pkill -f node`
**"Module not found":** Run `npm install` in both main and backend folders

### 1. Set up environment variables
Create a `.env` file in the `backend` folder with your Google Gemini API key:
```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit backend/.env and add your API key (optional - app works without it):
API_KEY=your_google_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

### 2. Install dependencies and start the application
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd .. && npm install

# Start backend server
cd backend && npm start

# In another terminal, start frontend
cd .. && npm run dev
```

### 3. Access the application
- **Frontend Dashboard**: http://localhost:5176 (or next available port)
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health


## API Endpoints

- `GET /api/health` - Health check
- `POST /api/gemini/analyze-transcript` - Analyze customer transcript
- `POST /api/gemini/assistant` - AI assistant responses
- `GET /api/dashboard/overview` - Dashboard data
- `GET /api/dashboard/live-updates` - Real-time updates

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Recharts for data visualization
- Socket.IO client for real-time features

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- Google Generative AI for sentiment analysis
- CORS and security middleware

