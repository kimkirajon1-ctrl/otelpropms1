module.exports = (io, socket) => {
  // Kullanıcıyı kendi departman odasına al (örn: 'HOUSEKEEPING')
  socket.on('join_department', (department) => {
    socket.join(department);
    console.log(`Soket ${socket.id} departman odasına katıldı: ${department}`);
  });

  // Yeni bildirim gönderme
  socket.on('send_notification', (data) => {
    // data: { targetDepartment: 'ADMIN', message: '...', type: 'INFO' }
    if (data.targetDepartment) {
      io.to(data.targetDepartment).emit('new_notification', data);
    } else {
      io.emit('new_notification', data); // Herkese gönder
    }
  });
};
