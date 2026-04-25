import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthForm, required, isEmail, minLength } from '../../hooks/useAuthForm';
import AuthLayout from '../../components/auth/AuthLayout';
import {
  Input, Button, Alert, Divider, GoogleButton,
  PasswordStrength, SuccessScreen,
} from '../../components/auth/AuthUI';

const RegisterPage = () => {
  const { register }  = useAuth();
  const [done, setDone] = useState(false);

  const { values, errors, loading, apiError, handleChange, validate, submit } =
    useAuthForm({ name: '', email: '', password: '' });

  const rules = {
    name:     [required('Name is required')],
    email:    [required('Email is required'), isEmail],
    password: [required('Password is required'), minLength(8)],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(rules)) return;

    await submit(async () => {
      await register(values);
      setDone(true);
    });
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  if (done) {
    return (
      <AuthLayout>
        <SuccessScreen
          icon="🎉"
          title="Account created!"
          message="We sent a verification link to your email. Click it to activate your account and log in."
          action={{ label: '← Go to login', onClick: () => window.location.href = '/login' }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* Tabs */}
      <div className="auth-tabs">
        <Link to="/login"    className="tab-btn">Log in</Link>
        <Link to="/register" className="tab-btn tab-btn--active">Sign up</Link>
      </div>

      <h1 className="auth-title">Create account</h1>
      <p className="auth-sub">Free plan — no credit card required.</p>

      <Alert type="error" message={apiError} />

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Full name"
          name="name"
          placeholder="Alex Johnson"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
        />

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
          placeholder="Min 8 characters"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordStrength password={values.password} />

        <Button type="submit" loading={loading ? 'Creating account…' : null}>
          Create account
        </Button>
      </form>

      <Divider />
      <GoogleButton onClick={handleGoogle} />

      <p className="auth-switch">
        Already have an account?{' '}
        <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;