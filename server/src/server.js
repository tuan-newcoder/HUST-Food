require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socketManager');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Create HTTP Server
  const server = http.createServer(app);

  // Initialize Socket.io
  const io = new Server(server, {
    cors: corsOptions,
  });
  initSocket(io);

  server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  HUST Food API Server running on port ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  API Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`=========================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...', err);
    server.close(() => {
      process.exit(1);
    });
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
