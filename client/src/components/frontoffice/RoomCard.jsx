import React from 'react';
import { Bed, CheckCircle, AlertTriangle, Hammer, User } from 'lucide-react';

const RoomCard = ({ room, onClick }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'AVAILABLE': return { color: '#10b981', label: 'Boş / Temiz', icon: <CheckCircle size={16} /> };
      case 'OCCUPIed': return { color: '#3b82f6', label: 'Dolu', icon: <User size={16} /> };
      case 'DIRTY': return { color: '#f59e0b', label: 'Kirli', icon: <AlertTriangle size={16} /> };
      case 'MAINTENANCE': return { color: '#ef4444', label: 'Bakımda', icon: <Hammer size={16} /> };
      default: return { color: '#64748b', label: 'Bilinmiyor', icon: <Bed size={16} /> };
    }
  };

  const config = getStatusConfig(room.status);

  return (
    <div 
      onClick={() => onClick(room)}
      style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '1.2rem',
        boxShadow: 'var(--shadow-sm)', cursor: 'pointer', borderTop: `5px solid ${config.color}`,
        transition: 'transform 0.2s', position: 'relative'
      }}
      className="room-card-hover"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>KAT {room.floor}</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '2px' }}>{room.room_number}</h3>
        </div>
        <div style={{ color: config.color, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
          {config.icon}
          {config.label}
        </div>
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {room.room_type} - {room.price_per_night} ₺
      </div>
    </div>
  );
};

export default RoomCard;
