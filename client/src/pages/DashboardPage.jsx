import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { Bed, Users, Calendar, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { title: 'Doluluk Oranı', value: '%78', icon: <TrendingUp color="#3b82f6" />, color: '#dbeafe' },
    { title: 'Aktif Odalar', value: '42', icon: <Bed color="#10b981" />, color: '#d1fae5' },
    { title: 'Beklenen Girişler', value: '12', icon: <Calendar color="#f59e0b" />, color: '#fef3c7' },
    { title: 'Anlık Misafir', value: '86', icon: <Users color="#6366f1" />, color: '#e0e7ff' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Genel Bakış</h2>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.title}</p>
                  <h3 style={{ fontSize: '1.5rem', marginTop: '0.4rem' }}>{stat.value}</h3>
                </div>
                <div style={{ 
                  backgroundColor: stat.color, padding: '12px', borderRadius: '12px' 
                }}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '2rem', backgroundColor: 'white', padding: '2rem', 
            borderRadius: '12px', boxShadow: 'var(--shadow-sm)', height: '400px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
          }}>
            Doluluk Grafiği ve Anlık Hareketler Buraya Gelecek...
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
