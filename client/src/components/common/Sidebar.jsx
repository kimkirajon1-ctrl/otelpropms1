import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  UserRound, 
  Wrench, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'FRONT_OFFICE', 'HOUSEKEEPING', 'FINANCE'] },
    { path: '/rooms', label: 'Odalar', icon: <BedDouble size={20} />, roles: ['ADMIN', 'FRONT_OFFICE', 'HOUSEKEEPING'] },
    { path: '/reservations', label: 'Rezervasyonlar', icon: <CalendarCheck size={20} />, roles: ['ADMIN', 'FRONT_OFFICE'] },
    { path: '/guests', label: 'Misafirler', icon: <UserRound size={20} />, roles: ['ADMIN', 'FRONT_OFFICE'] },
    { path: '/housekeeping', label: 'Temizlik', icon: <Wrench size={20} />, roles: ['ADMIN', 'HOUSEKEEPING'] },
    { path: '/finance', label: 'Finans', icon: <BarChart3 size={20} />, roles: ['ADMIN', 'FINANCE'] },
    { path: '/admin', label: 'Ayarlar', icon: <Settings size={20} />, roles: ['ADMIN'] },
  ];

  return (
    <aside className="sidebar" style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-sidebar)',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '1.5rem'
    }}>
      <div className="logo" style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        HOTEL <span style={{ color: 'var(--secondary-color)' }}>PMS</span>
      </div>
      <nav>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            item.roles.includes(user?.role) && (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    color: isActive ? 'white' : '#94a3b8',
                    backgroundColor: isActive ? 'var(--secondary-color)' : 'transparent',
                    textDecoration: 'none',
                    transition: '0.3s'
                  })}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
