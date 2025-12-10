const express = require('express');
const cors = require('cors');
// const socket = require('socket.io');
// const http = require('http');
const authRoutes = require('./routes/authRoutes');
const izinRoutes = require('./routes/izin');
const peminjamanKendaraanRoutes = require('./routes/peminjamanKendaraan');
const peminjamanRoutes = require('./routes/peminjaman');
const routesUk = require('./routes/routesUk');
const routesLog = require('./routes/serviceRoute');
const analitycsRoutes = require('./routes/anallitycs');
const path = require('path');

const app = express();


// const server = http.createServer(app);
// const io = socket(server, {
//     path: '/socket.io',
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//     },
// });

const corsOptions = {
    origin: '*',  // Mengizinkan semua origin (untuk pengembangan)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/izin', izinRoutes);
app.use('/api/mobilitas', peminjamanKendaraanRoutes);
app.use('/api/peminjaman', peminjamanRoutes);
app.use('/api/uk', routesUk);
app.use('/api/service', routesLog);
app.use('/api/analitycs', analitycsRoutes);

app.get('/', (req, res) => {
    res.send(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});