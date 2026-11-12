import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getError } from '../api/axios';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/services', { replace: true });
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className={`form-control ${errors[name] ? 'is-invalid' : ''}`} value={form[name]} onChange={handleChange} {...extra} />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <h2>Home services, sorted.</h2>
        <p className="mb-4" style={{ color: '#c3d1dc' }}>Create a free account to start booking.</p>
        <ul className="list-unstyled">
          <li><i className="bi bi-check-circle-fill"></i>Book in under a minute</li>
          <li><i className="bi bi-check-circle-fill"></i>Cancel while a booking is pending or confirmed</li>
          <li><i className="bi bi-check-circle-fill"></i>Keep your full booking history</li>
        </ul>
      </div>
      <div className="auth-form">
        <form className="auth-box" onSubmit={handleSubmit} noValidate>
          <h3 className="mb-1">Create account</h3>
          <p className="text-muted mb-4">Already registered? <Link to="/login">Log in</Link></p>
          {serverError && <div className="alert alert-danger py-2">{serverError}</div>}
          {field('name', 'Full name', 'text', { autoComplete: 'name' })}
          {field('email', 'Email', 'email', { autoComplete: 'email' })}
          {field('phone', 'Mobile number (optional)', 'tel', { maxLength: 10 })}
          {field('password', 'Password', 'password', { autoComplete: 'new-password' })}
          {field('confirm', 'Confirm password', 'password', { autoComplete: 'new-password' })}
          <button className="btn btn-primary w-100" disabled={submitting}>{submitting ? 'Creating account...' : 'Sign up'}</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
