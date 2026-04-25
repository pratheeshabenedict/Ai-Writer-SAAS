import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import AuthLayout from '../../components/auth/AuthLayout';
import { SuccessScreen, Alert } from '../../components/auth/AuthUI';

const VerifyEmailPage = () => {
  const { token }           = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    authAPI.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'This link is invalid or has expired.');
      });
  }, [token]);

  if (status === 'loading') {
    return (
      <AuthLayout>
        <div className="verify-loading">
          <svg className="verify-spinner" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2"
              strokeDasharray="31.4" strokeDashoffset="10">
              <animateTransform attributeName="transform" type="rotate"
                from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <p>Verifying your email…</p>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'success') {
    return (
      <AuthLayout>
        <SuccessScreen
          icon="✅"
          title="Email verified!"
          message="Your account is now active. Log in to start writing."
          action={{ label: 'Go to login →', onClick: () => window.location.href = '/login' }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div className="success-icon" style={{ background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)' }}>
          ❌
        </div>
        <h2 className="success-title">Verification failed</h2>
        <p className="success-msg">{message}</p>
        <Link to="/register" className="link-btn" style={{ marginTop: 20, display: 'inline-block' }}>
          Register again
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;