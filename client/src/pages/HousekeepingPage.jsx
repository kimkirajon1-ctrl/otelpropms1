import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import housekeepingService from '../services/housekeeping.service';
import roomService from '../services/room.service';
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const HousekeepingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await roomService.getRooms();
      // Özellikle temizlik gerektiren (DIRTY) ve bakımda olanları öne çıkaralım
      const sortedRooms = response.data.sort((a, b) => (a.status === 'DIRTY' ? -1 : 1));
      setRooms(sortedRooms);
    } catch (err) {
      console.error("Odalar yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await roomService.updateStatus(roomId, newStatus);
      fetchRooms(); // Listeyi güncelle
      alert(`Oda durumu ${newStatus === 'AVAILABLE' ? 'TEMİZ' : newStatus} olarak güncellendi.`);
    } catch (err) {
      alert("Durum güncellenirken bir hata oluştu.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontWeight: '700' }}>Kat Hizmetleri Paneli</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Odaların temizlik ve bakım süreçlerini buradan yönetin.</p>
            </div>
            <button onClick={fetchRooms} className="btn" style={{ border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Yenile
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '1.2rem' }}>Oda No</th>
                  <th style={{ padding: '1.2rem' }}>Tip / Kat</th>
                  <th style={{ padding: '1.2rem' }}>Mevcut Durum</th>
                  <th style={{ padding: '1.2rem' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.2rem', fontWeight: '700', fontSize: '1.1rem' }}>{room.room_number}</td>
                    <td style={{ padding: '1.2rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{room.room_type}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{room.floor}. Kat</div>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                        backgroundColor: room.status === 'DIRTY' ? '#fef3c7' : room.status === 'AVAILABLE' ? '#d1fae5' : '#f1f5f9',
                        color: room.status === 'DIRTY' ? '#92400e' : room.status === 'AVAILABLE' ? '#065f46' : '#64748b'
                      }}>
                        {room.status === 'DIRTY' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                        {room.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      {room.status === 'DIRTY' ? (
                        <button 
                          onClick={() => handleStatusChange(room.id, 'AVAILABLE')}
                          className="btn btn-primary" 
                          style={{ fontSize: '0.8rem', backgroundColor: '#10b981' }}
                        >
                          Temizlendi İşaretle
                        </button>
                      ) : room.status === 'AVAILABLE' ? (
                        <button 
                          onClick={() => handleStatusChange(room.id, 'DIRTY')}
                          className="btn" 
                          style={{ fontSize: '0.8rem', border: '1px solid #ef4444', color: '#ef4444' }}
                        >
                          Kirli İşaretle
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>İşlem Yapılamaz (Dolu)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HousekeepingPage;
