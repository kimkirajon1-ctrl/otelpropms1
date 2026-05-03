import React, { useState } from 'react';
import reservationService from '../../services/reservation.service';
import { Save, X, User, Calendar, CreditCard } from 'lucide-react';

const ReservationForm = ({ rooms, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    guest_id: 1, // Örnek olarak ilk misafir, gerçekte misafir seçimi eklenmeli
    room_id: '',
    check_in_date: '',
    check_out_date: '',
    total_price: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reservationService.create(formData);
      onSave();
    } catch (err) {
      alert("Rezervasyon kaydedilirken hata oluştu.");
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: '700' }}>Yeni Rezervasyon Kaydı</h3>
        <button onClick={onCancel} style={{ background: 'none' }}><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label><Bed size={16} /> Oda Seçimi</label>
            <select 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              onChange={(e) => setFormData({...formData, room_id: e.target.value})}
            >
              <option value="">Oda Seçiniz...</option>
              {rooms.filter(r => r.status === 'AVAILABLE').map(room => (
                <option key={room.id} value={room.id}>Oda {room.room_number} ({room.room_type})</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label><CreditCard size={16} /> Toplam Tutar (₺)</label>
            <input 
              type="number" 
              required 
              onChange={(e) => setFormData({...formData, total_price: e.target.value})} 
            />
          </div>

          <div className="input-group">
            <label><Calendar size={16} /> Giriş Tarihi</label>
            <input 
              type="date" 
              required 
              onChange={(e) => setFormData({...formData, check_in_date: e.target.value})} 
            />
          </div>

          <div className="input-group">
            <label><Calendar size={16} /> Çıkış Tarihi</label>
            <input 
              type="date" 
              required 
              onChange={(e) => setFormData({...formData, check_out_date: e.target.value})} 
            />
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label>Notlar</label>
          <textarea 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '80px' }}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Save size={18} /> Kaydet
          </button>
          <button type="button" onClick={onCancel} className="btn" style={{ flex: 1, border: '1px solid #e2e8f0' }}>İptal</button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
