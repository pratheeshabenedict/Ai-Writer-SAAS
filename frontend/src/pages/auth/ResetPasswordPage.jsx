import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthForm, required, minLength, matchField } from '../../hooks/useAuthForm';
import AuthLayout from '../../components/auth/AuthLayout';
import { Input, Button, Alert, PasswordStrength, SuccessScreen } from '../../components/auth/AuthUI';

const ResetPasswordPage = () => {
  const { token }           = useParams();
  const { resetPassword }   = useAuth();
  const [done, setDone]     = useState(false);

  const { values, errors, loading, apiError, handleChange, validate, submit } =
    useAuthForm({ password: '', confirm: '' });

  const rules = {
    password: [required('Password is required'), minLength(8)],
    confirm:  [required('Please confirm your password'), matchField('password', 'Password')],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(rules)) return;

    await submit(async () => {
      await resetPassword(token, values.password);
      setDone(true);
    });
  };

  if (!token) {
    return (
      <AuthLayout>
        <Alert type="error" message="Invalid reset link. Please request a new one." />
        <Link to="/forgot-password" className="link-btn">Request new link</Link>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout>
        <SuccessScreen
          icon="🔐"
          title="Password updated!"
          message="Your password has been reset. You can now log in with your new password."
          action={{ label: 'Go to login →', onClick: () => window.location.href = '/login' }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">Set new password</h1>
      <p className="auth-sub">Choose a strong password for your account.</p>

      <Alert type="error" message={apiError} />

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="New password"
          name="password"
          type="password"
          placeholder="Min 8 characters"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordStrength password={values.password} />

        <Input
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={handleChange}
          error={errors.confirm}
        />

        <Button type="submit" loading={loading ? 'Updating…' : null}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;