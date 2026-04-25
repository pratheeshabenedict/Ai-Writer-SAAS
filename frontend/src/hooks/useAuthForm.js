import { useState } from 'react';

export const useAuthForm = (initialValues) => {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess]   = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
    setApiError('');
  };

  const validate = (rules) => {
    const newErrors = {};
    Object.entries(rules).forEach(([field, checks]) => {
      for (const check of checks) {
        const msg = check(values[field], values);
        if (msg) { newErrors[field] = msg; break; }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (fn) => {
    setLoading(true);
    setApiError('');
    setSuccess('');
    try {
      await fn();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, loading, apiError, success, setSuccess, setApiError, handleChange, validate, submit };
};

// ── Validators ────────────────────────────────────────────
export const required = (msg = 'This field is required') =>
  (val) => (!val || !val.trim() ? msg : null);

export const isEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Enter a valid email address';

export const minLength = (n) => (val) =>
  val && val.length >= n ? null : `Must be at least ${n} characters`;

export const matchField = (field, label) => (val, all) =>
  val === all[field] ? null : `Passwords do not match`;