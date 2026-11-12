import { useState } from 'react';
import api, { getError } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils';

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || '', password: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (form.name.trim().length < 2) return setMsg({ type: 'danger', text: 'Name must be at least 2 characters' });
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) return setMsg({ type: 'danger', text: 'Enter a valid 10-digit mobile number' });
    if (form.password && form.password.length < 6) return setMsg({ type: 'danger', text: 'New password must be at least 6 characters' });
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      const res = await api.put('/users/profile', payload);
      setUser(res.data.user);
      setForm({ ...form, password: '' });
      setMsg({ type: 'success', text: 'Profile updated' });
    } catch (err) {
      setMsg({ type: 'danger', text: getError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="mb-1">My profile</h2>
      <p className="text-muted mb-4">Member since {formatDate(user.createdAt)}</p>
      <form className="panel p-4" style={{ maxWidth: 560 }} onSubmit={handleSubmit} noValidate>
        {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input className="form-control" value={user.email} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="name">Full name</label>
          <input id="name" name="name" className="form-control" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="phone">Mobile number</label>
          <input id="phone" name="phone" maxLength={10} className="form-control" value={form.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="address">Default address</label>
          <textarea id="address" name="address" rows="3" className="form-control" value={form.address} onChange={handleChange}></textarea>
        </div>
        <div className="mb-4">
          <label className="form-label fw-semibold" htmlFor="password">New password (leave blank to keep current)</label>
          <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={handleChange} autoComplete="new-password" />
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
      </form>
    </>
  );
};

export default UserProfile;
