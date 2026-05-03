import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { LogOut, Bell, User } from 'lucide-react';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="header" style={{
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="header-left">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Otel Yönetim Paneli</h2>
      </div>
      
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'none', color: 'var(--text-muted)' }}><Bell size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.full_name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</div>
          </div>
          <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '50%' }}>
            <User size={20} color="#64748b" />
          </div>
        </div>

        <button 
          onClick={() => dispatch(logout())}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontWeight: '500', background: 'none' }}
        >
          <LogOut size={18} />
          Çıkış
        </button>
      </div>
    </header>
  );
};

export default Header;
