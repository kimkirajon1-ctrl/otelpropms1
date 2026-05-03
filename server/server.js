require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 10000;
const server = http.createServer(app);

// Socket.io Kurulumu
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Socket logic buraya gelecek (ileride socket klasörüne taşınacak)
io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı');
  });
});

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
