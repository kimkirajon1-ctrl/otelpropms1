import React, { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';

const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`} style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderLeft: `4px solid ${type === 'info' ? 'var(--secondary-color)' : 'var(--danger)'}`,
      zIndex: 1000
    }}>
      <Info size={20} color="var(--secondary-color)" />
      <span style={{ fontSize: '0.9rem' }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none' }}><X size={16} /></button>
    </div>
  );
};

export default Notification;
