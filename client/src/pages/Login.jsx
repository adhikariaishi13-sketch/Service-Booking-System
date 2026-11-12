import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getError } from '../api/axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Enter your password';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : location.state?.from || '/services', { replace: true });
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <h2>Welcome back.</h2>
        <p className="mb-4" style={{ color: '#c3d1dc' }}>Log in to book services and track your bookings.</p>
        <ul className="list-unstyled">
          <li><i className="bi bi-check-circle-fill"></i>Verified professionals</li>
          <li><i className="bi bi-check-circle-fill"></i>Fixed, upfront prices</li>
          <li><i className="bi bi-check-circle-fill"></i>Live booking status</li>
        </ul>
      </div>
      <div className="auth-form">
        <form className="auth-box" onSubmit={handleSubmit} noValidate>
          <h3 className="mb-1">Log in</h3>
          <p className="text-muted mb-4">New here? <Link to="/register">Create an account</Link></p>
          {serverError && <div className="alert alert-danger py-2">{serverError}</div>}
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={handleChange} autoComplete="email" />
            <div className="invalid-feedback">{errors.email}</div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={handleChange} autoComplete="current-password" />
            <div className="invalid-feedback">{errors.password}</div>
          </div>
          <button className="btn btn-primary w-100" disabled={submitting}>{submitting ? 'Logging in...' : 'Log in'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
