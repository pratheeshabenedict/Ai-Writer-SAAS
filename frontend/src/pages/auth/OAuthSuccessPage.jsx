import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/auth';

/**
 * Google OAuth callback lands here:
 *   /oauth-success?token=<accessToken>
 * We store the token, fetch the user profile, then redirect.
 */
const OAuthSuccessPage = () => {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const { login: setUser } = useAuth(); // we just need to update state

  useEffect(() => {
    const token = params.get('token');
    if (!token) return navigate('/login');

    localStorage.setItem('accessToken', token);

    authAPI.getMe()
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => navigate('/login', { replace: true }));
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', color: '#7c6af7',
      fontFamily: 'DM Sans, sans-serif', gap: 12, fontSize: 15,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#7c6af7" strokeWidth="2"
          strokeDasharray="31.4" strokeDashoffset="10">
          <animateTransform attributeName="transform" type="rotate"
            from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
      Completing sign in…
    </div>
  );
};

export default OAuthSuccessPage;