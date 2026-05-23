
### ⚡ Setup (5 phút)

#### 1. Clone và cài đặt
```bash
git clone https://github.com/phamduynguyenlam/CSC-main.git
cd CSC-main
npm install
cd backend && npm install
```

#### 2. Setup API Keys 
```bash
# Copy the environment template
cp backend/.env.example backend/.env
```

**Chỉnh `backend/.env` với API keys của bạn:**
```bash
# Get from https://platform.openai.com/account/api-keys (Optional)
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here

# Get from https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/
API_KEY=AIza-your-actual-gemini-key-here

# Optional (RAG + vector store)
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CHROMA_URL=http://localhost:8000
CHROMA_COLLECTION=sentimind_call_memory

# Leave these unchanged
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

#### 2b. Database and Vector Store (cho RAG + sử dụng lịch sử cuộc gọi)
- Configure MySQL connection in `backend/.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- Run the schema in `backend/database/customer_care_schema.sql`.
- Start Chroma (example): `chroma run --path ./chroma` or a Docker container on port 8000.

#### 3. Khởi chạy ứng dụng
```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start frontend  
npm run dev
```
### 1. Cài đặt các biến môi trường
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

### 2. Cài đặt các dependencies và khởi động ứng dụng
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

### 3. Truy cập ứng dụng
- **Frontend Dashboard**: http://localhost:5173 
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

