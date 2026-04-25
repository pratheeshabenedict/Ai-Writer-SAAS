import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthForm, required, isEmail } from '../../hooks/useAuthForm';
import AuthLayout from '../../components/auth/AuthLayout';
import { Input, Button, Alert, Divider, GoogleButton } from '../../components/auth/AuthUI';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/dashboard';

  const { values, errors, loading, apiError, handleChange, validate, submit } =
    useAuthForm({ email: '', password: '' });

  const rules = {
    email:    [required('Email is required'), isEmail],
    password: [required('Password is required')],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(rules)) return;

    await submit(async () => {
      await login(values);
      navigate(from, { replace: true });
    });
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <AuthLayout>
      {/* Tabs */}
      <div className="auth-tabs">
        <Link to="/login"    className="tab-btn tab-btn--active">Log in</Link>
        <Link to="/register" className="tab-btn">Sign up</Link>
      </div>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-sub">Continue writing where you left off.</p>

      <Alert type="error" message={apiError} />

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="forgot-row">
          <Link to="/forgot-password" className="link-sm">Forgot password?</Link>
        </div>

        <Button type="submit" loading={loading ? 'Logging in…' : null}>
          Log in
        </Button>
      </form>

      <Divider />
      <GoogleButton onClick={handleGoogle} />

      <p className="auth-switch">
        Don't have an account?{' '}
        <Link to="/register">Sign up free</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;