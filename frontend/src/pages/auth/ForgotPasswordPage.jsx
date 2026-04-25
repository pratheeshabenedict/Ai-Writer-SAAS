import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthForm, required, isEmail } from '../../hooks/useAuthForm';
import AuthLayout from '../../components/auth/AuthLayout';
import { Input, Button, Alert, SuccessScreen } from '../../components/auth/AuthUI';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [done, setDone]    = useState(false);

  const { values, errors, loading, apiError, handleChange, validate, submit } =
    useAuthForm({ email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate({ email: [required('Email is required'), isEmail] })) return;

    await submit(async () => {
      await forgotPassword(values.email);
      setDone(true);
    });
  };

  if (done) {
    return (
      <AuthLayout>
        <SuccessScreen
          icon="✉️"
          title="Check your inbox"
          message={`We sent a reset link to ${values.email}. It expires in 1 hour.`}
          action={{ label: '← Back to login', onClick: () => window.location.href = '/login' }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Link to="/login" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to login
      </Link>

      <h1 className="auth-title">Reset password</h1>
      <p className="auth-sub">Enter your email and we'll send a reset link.</p>

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

        <Button type="submit" loading={loading ? 'Sending…' : null}>
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;