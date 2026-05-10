import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route handlers
import geminiRoutes from './routes/gemini.js';
import knotApiRoutes from './routes/knotApi.js';
import dashboardRoutes from './routes/dashboard.js';
import openaiRoutes from './routes/openai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5174", 
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177"
    ],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177"
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/knot', knotApiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', openaiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-analysis', (userId) => {
    socket.join(`analysis-${userId}`);
    console.log(`User ${userId} joined analysis room`);
  });

  socket.on('audio-stream', (audioData) => {
    // Handle real-time audio streaming for sentiment analysis
    socket.emit('audio-received', { success: true });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../dist')));

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 SentiMind Backend Server running on port ${PORT}`);
  console.log(`📊 Dashboard available at: http://localhost:${PORT}`);
  console.log(`🔗 API endpoints available at: http://localhost:${PORT}/api`);
});