module.exports = (io, socket) => {
  socket.on('update_room_status', (data) => {
    // data: { roomId: 101, newStatus: 'DIRTY' }
    console.log(`Oda ${data.roomId} durumu güncellendi: ${data.newStatus}`);
    
    // Değişikliği tüm istemcilere yayınla
    io.emit('room_status_changed', {
      roomId: data.roomId,
      status: data.newStatus,
      updatedAt: new Date()
    });
  });
};
