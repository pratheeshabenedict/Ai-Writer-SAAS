import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// Auth pages
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage  from './pages/auth/ResetPasswordPage';
import VerifyEmailPage    from './pages/auth/VerifyEmailPage';
import OAuthSuccessPage   from './pages/auth/OAuthSuccessPage';

// App pages (placeholders — replace with real ones)
const Dashboard = () => (
  <div style={{ padding: 40, fontFamily: 'DM Sans, sans-serif', color: '#e8e6f0', background: '#0a0a0f', minHeight: '100vh' }}>
    <h1 style={{ fontFamily: 'Syne, sans-serif' }}>Dashboard 🎉</h1>
    <p style={{ color: '#6b6880', marginTop: 8 }}>You're logged in. Build your AI writer here.</p>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login"            element={<LoginPage />} />
        <Route path="/register"         element={<RegisterPage />} />
        <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token"   element={<VerifyEmailPage />} />
        <Route path="/oauth-success"    element={<OAuthSuccessPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Admin-only example */}
        {/* <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;