const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const teamTaskRoutes = require('./routes/teamTaskRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Enable CORS for all origins
app.use(cors());

// Middleware
app.use((req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  express.json()(req, res, next);
});


// Routes
app.use('/api/users', userRoutes); //userlist api here
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
// team routes
app.use('/api/team', teamRoutes);
app.use('/api/assign', teamTaskRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export io for use in controllers
module.exports = io;