module.exports = (io, socket) => {
  socket.on('new_reservation_made', (reservation) => {
    console.log('Yeni rezervasyon alındı, tablolar güncelleniyor...');
    
    // Özellikle Ön Büro (Front Office) çalışanlarına bildir
    io.to('FRONT_OFFICE').to('ADMIN').emit('refresh_reservations', reservation);
  });
};
