import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glow-emerald" />
      <div className="glow-blue" />

      <div className="auth-card animate-scale-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '4rem', height: '4rem',
            background: 'linear-gradient(135deg, #34d399, #059669)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Zap style={{ width: '2rem', height: '2rem', color: 'var(--color-bg-primary)', fill: 'currentColor' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>
            Live<span style={{ color: 'var(--color-emerald)' }}>Bid</span>.Pro
          </h1>
          <p className="text-overline" style={{ marginTop: '0.5rem' }}>Authenticate to Access Terminal</p>
        </div>

        {/* Error */}
        {error && (
          <div className="animate-slide-up" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem', marginBottom: '1.5rem',
            background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.3)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-rose)',
          }}>
            <AlertTriangle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="operator@livebid.pro"
              required
              id="input-login-email"
            />
          </div>
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              id="input-login-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-full btn-xl"
            style={{ marginTop: '0.5rem' }}
            id="btn-login"
          >
            {isLoading ? 'Authenticating...' : 'Access Terminal'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--color-emerald)', textDecoration: 'none', fontWeight: 700 }}>
            Register here
          </Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/" style={{ color: 'var(--color-text-faint)', textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Continue as Guest →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
