require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

// Soket İşleyicilerini (Handlers) İçe Aktarıyoruz
const roomSocket = require('./sockets/roomSocket');
const notificationSocket = require('./sockets/notificationSocket');
const reservationSocket = require('./sockets/reservationSocket');

const PORT = process.env.PORT || 10000;
const server = http.createServer(app);

// Socket.io Yapılandırması
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*", // Frontend'den gelen isteklere izin ver
    methods: ["GET", "POST"]
  }
});

// Soket Bağlantısı Kurulduğunda
io.on('connection', (socket) => {
  console.log('Yeni bir kullanıcı bağlandı (ID):', socket.id);

  // Az önce yazdığımız soket dosyalarını buraya "enjekte" ediyoruz
  // Böylece oda, rezervasyon ve bildirim işlemleri aktifleşiyor
  roomSocket(io, socket);
  notificationSocket(io, socket);
  reservationSocket(io, socket);

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı.');
  });
});

// Render ve Local ortam için başlatma
server.listen(PORT, () => {
  console.log(`>>> Server ${PORT} portunda başarıyla başlatıldı.`);
});
