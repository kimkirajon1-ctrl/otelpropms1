import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import authService from '../services/auth.service';
import { Lock, User, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const data = await authService.login(credentials);
      dispatch(loginSuccess(data));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Giriş başarısız'));
    }
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      backgroundColor: '#f1f5f9', padding: '1rem'
    }}>
      <div style={{
        maxWidth: '400px', width: '100%', backgroundColor: 'white', 
        padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: 'bold' }}>HOS <span style={{ color: 'var(--secondary-color)' }}>PMS</span></h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Lütfen hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><User size={16} style={{ marginRight: '8px' }} /> Kullanıcı Adı</label>
            <input type="text" name="username" required onChange={handleChange} />
          </div>

          <div className="input-group" style={{ marginTop: '1.5rem' }}>
            <label><Lock size={16} style={{ marginRight: '8px' }} /> Şifre</label>
            <input type="password" name="password" required onChange={handleChange} />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '2rem', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
