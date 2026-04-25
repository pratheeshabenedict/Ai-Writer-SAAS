import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Spinner shown while session is being restored
const Loader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#0a0a0f', color: '#7c6af7',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
    gap: 12,
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#7c6af7" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
      </circle>
    </svg>
    Loading…
  </div>
);

/**
 * PrivateRoute — wraps routes that require authentication.
 * Usage:
 *   <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
 *   <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />
 */
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) {
    // Redirect to login, remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;