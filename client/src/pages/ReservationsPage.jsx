import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ReservationForm from '../components/frontoffice/ReservationForm';
import reservationService from '../services/reservation.service';
import roomService from '../services/room.service';
import { Plus, Search, Calendar } from 'lucide-react';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resData, roomData] = await Promise.all([
        reservationService.getReservations(),
        roomService.getRooms()
      ]);
      setReservations(resData.data);
      setRooms(roomData.data);
    } catch (err) {
      console.error("Veriler yüklenemedi", err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: '700' }}>Rezervasyon Yönetimi</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> Yeni Rezervasyon
            </button>
          </div>

          {showForm && (
            <div style={{ marginBottom: '2rem' }}>
              <ReservationForm 
                rooms={rooms} 
                onSave={() => { setShowForm(false); fetchData(); }} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          )}

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Misafir</th>
                  <th style={{ padding: '1rem' }}>Oda</th>
                  <th style={{ padding: '1rem' }}>Giriş</th>
                  <th style={{ padding: '1rem' }}>Çıkış</th>
                  <th style={{ padding: '1rem' }}>Durum</th>
                  <th style={{ padding: '1rem' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{res.first_name} {res.last_name}</td>
                    <td style={{ padding: '1rem' }}>Oda {res.room_number}</td>
                    <td style={{ padding: '1rem' }}>{new Date(res.check_in_date).toLocaleDateString('tr-TR')}</td>
                    <td style={{ padding: '1rem' }}>{new Date(res.check_out_date).toLocaleDateString('tr-TR')}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600',
                        backgroundColor: res.status === 'CONFIRMED' ? '#d1fae5' : '#fee2e2',
                        color: res.status === 'CONFIRMED' ? '#065f46' : '#991b1b'
                      }}>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button style={{ color: 'var(--secondary-color)', fontSize: '0.85rem', fontWeight: '600', background: 'none' }}>Detay</button>
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

export default ReservationsPage;
