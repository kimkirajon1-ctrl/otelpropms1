import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import RoomCard from '../components/frontoffice/RoomCard';
import roomService from '../services/room.service';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomService.getRooms();
      setRooms(response.data);
    } catch (err) {
      console.error("Odalar yüklenemedi", err);
    }
  };

  const filteredRooms = filter === 'ALL' 
    ? rooms 
    : rooms.filter(r => r.status === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: '700' }}>Oda Durum Çizelgesi</h2>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {['ALL', 'AVAILABLE', 'OCCUPIED', 'DIRTY', 'MAINTENANCE'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                    backgroundColor: filter === f ? 'var(--primary-color)' : 'white',
                    color: filter === f ? 'white' : 'var(--text-main)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {f === 'ALL' ? 'Tümü' : f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={(r) => alert(`Oda ${r.room_number} detayı açılıyor...`)} 
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomsPage;
