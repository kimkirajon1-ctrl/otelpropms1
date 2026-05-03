const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// Veritabanı Bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Bağlandı"))
  .catch(err => console.log(err));

// Socket.io Mantığı
io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);
  socket.on('update_room', (data) => {
    io.emit('room_status_changed', data);
  });
});

// Temel Route'lar
app.use('/api/rooms', require('./routes/rooms.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
