import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, username, password);
      navigate('/');
    } catch {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

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
            Create <span style={{ color: 'var(--color-emerald)' }}>Account</span>
          </h1>
          <p className="text-overline" style={{ marginTop: '0.5rem' }}>Initialize New Operator Profile</p>
        </div>

        {/* Error */}
        {displayError && (
          <div className="animate-slide-up" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem', marginBottom: '1.5rem',
            background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.3)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-rose)',
          }}>
            <AlertTriangle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
            {displayError}
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
              id="input-register-email"
            />
          </div>
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
            <input
              type="text" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Callsign"
              required minLength={3}
              id="input-register-username"
            />
          </div>
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required minLength={6}
              id="input-register-password"
            />
          </div>
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
            <input
              type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              id="input-register-confirm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-full btn-xl"
            style={{ marginTop: '0.5rem' }}
            id="btn-register"
          >
            {isLoading ? 'Initializing...' : 'Deploy Operator'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Already have access?{' '}
          <Link to="/login" style={{ color: 'var(--color-emerald)', textDecoration: 'none', fontWeight: 700 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
