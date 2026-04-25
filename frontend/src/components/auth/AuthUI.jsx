import { useState } from 'react';

// ─── Input ────────────────────────────────────────────────
export const Input = ({ label, error, type = 'text', icon, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <div className="field-wrap">
        {icon && <span className="field-icon">{icon}</span>}
        <input
          className={`field-input ${error ? 'field-input--error' : ''} ${icon ? 'field-input--icon' : ''}`}
          type={isPassword ? (show ? 'text' : 'password') : type}
          {...props}
        />
        {isPassword && (
          <button type="button" className="field-toggle" onClick={() => setShow(!show)} tabIndex={-1}>
            {show ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

// ─── Button ───────────────────────────────────────────────
export const Button = ({ children, loading, variant = 'primary', fullWidth = true, ...props }) => (
  <button
    className={`btn btn--${variant} ${fullWidth ? 'btn--full' : ''}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <>
        <svg className="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"
            strokeDasharray="31.4" strokeDashoffset="10" opacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
          </path>
        </svg>
        {loading}
      </>
    ) : children}
  </button>
);

// ─── Alert ────────────────────────────────────────────────
export const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  return (
    <div className={`alert alert--${type}`}>
      <span className="alert-icon">
        {type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ'}
      </span>
      {message}
    </div>
  );
};

// ─── Divider ──────────────────────────────────────────────
export const Divider = ({ label = 'or' }) => (
  <div className="divider"><span>{label}</span></div>
);

// ─── GoogleButton ─────────────────────────────────────────
export const GoogleButton = ({ onClick }) => (
  <button type="button" className="btn btn--google btn--full" onClick={onClick}>
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
    Continue with Google
  </button>
);

// ─── PasswordStrength ─────────────────────────────────────
export const PasswordStrength = ({ password }) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Too weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#f87171', '#fbbf24', '#34d399', '#4ade80'];

  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className="pw-bar"
            style={{ background: i < score ? colors[score - 1] : 'var(--border)' }}
          />
        ))}
      </div>
      <span className="pw-label" style={{ color: score > 0 ? colors[score - 1] : 'var(--muted)' }}>
        {score > 0 ? labels[score - 1] : 'Enter a password'}
      </span>
    </div>
  );
};

// ─── SuccessScreen ────────────────────────────────────────
export const SuccessScreen = ({ icon, title, message, action }) => (
  <div className="success-screen">
    <div className="success-icon">{icon}</div>
    <h2 className="success-title">{title}</h2>
    <p className="success-msg">{message}</p>
    {action && (
      <button type="button" className="link-btn" onClick={action.onClick}>
        {action.label}
      </button>
    )}
  </div>
);