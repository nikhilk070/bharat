import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

import authRoutes from './routes/authRoutes';
import startupRoutes from './routes/startupRoutes';
import acceleratorRoutes from './routes/acceleratorRoutes';
import investorRoutes from './routes/investorRoutes';
import vivachanaRoutes from './routes/vivachanaRoutes';
import auditRoutes from './routes/auditRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/accelerator', acceleratorRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/vivachana', vivachanaRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chanakya', aiRoutes);

// Basic Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Bharat Ventures API is running.' });
});

import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Export io so it can be used in controllers
export { io };

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Clients can join a room based on their user ID or startup ID
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
