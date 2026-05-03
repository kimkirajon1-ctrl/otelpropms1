import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { fetchRooms } from '../services/api';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const DashboardPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
    socket.on('room_status_changed', () => loadRooms());
    return () => socket.off('room_status_changed');
  }, []);

  const loadRooms = async () => {
    const { data } = await fetchRooms();
    setRooms(data);
  };

  return (
    <div className="p-4 grid grid-cols-4 gap-4">
      {rooms.map(room => (
        <div key={room._id} className={`p-4 rounded shadow ${room.status === 'AVAILABLE' ? 'bg-green-200' : 'bg-red-200'}`}>
          <h3>Oda: {room.roomNumber}</h3>
          <p>Durum: {room.status}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
