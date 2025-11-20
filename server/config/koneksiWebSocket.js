// socket.js

const socket = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { all } = require('../routes/authRoutes');

// Initialize Express app
const app = express();

const corsOptions = {
     origin: 'http://127.0.0.1:5501',  // Mengizinkan semua origin (untuk pengembangan)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}

app.use(cors(corsOptions));

const server = http.createServer(app);  // Create the HTTP server using the express app

// Initialize Socket.IO with the server
const io = socket(server, {
    cors: {
        origin: 'http://127.0.0.1:5501',  // Mengizinkan semua origin (untuk pengembangan)
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    },
});

// This function can be used to get the io instance if needed elsewhere
function getIo() {
    return io;
}

// Example: Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server on port 3001
server.listen(3001, () => {
    console.log('Server is running on port 3001'); // Correct port in the log
});

// Export the io instance for use in other parts of the application
module.exports = { getIo };
