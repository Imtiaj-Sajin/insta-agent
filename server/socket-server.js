//server/socket-server.js
const http = require('http');
const { Server } = require('socket.io');

const PORT = 4000;

// Create an HTTP server with a health check route
const server = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'WebSocket server is running' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
  }
});

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://nkf448kn-3000.asse.devtunnels.ms'], // Update for production
    methods: ["GET", "POST"],
  },
});

// Helper function to log with timestamps
const logWithTimestamp = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Handle WebSocket connections
io.on('connection', (socket) => {
  logWithTimestamp(`Client connected: ${socket.id}`);

  socket.on('webhook-event', (data) => {
    try {
      logWithTimestamp(`Received message: ${JSON.stringify(data)}`);
      io.emit('webhook-event', data); // Broadcast to all clients
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  socket.on('disconnect', () => {
    logWithTimestamp(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`WebSocket server is running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});