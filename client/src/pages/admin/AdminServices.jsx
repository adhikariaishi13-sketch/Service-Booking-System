import { useEffect, useState } from 'react';
import api, { getError } from '../../api/axios';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import { formatPrice } from '../../utils';

const emptyForm = { name: '', description: '', price: '', duration: '1 hour', image: '', category: '', isPopular: false };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | service object being edited
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () =>
    Promise.all([api.get('/services'), api.get('/categories')])
      .then(([s, c]) => { setServices(s.data); setCategories(c.data); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ ...emptyForm, category: categories[0]?._id || '' }); setFormError(''); setModal('add'); };
  const openEdit = (s) => {
    setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, image: s.image || '', category: s.category?._id || '', isPopular: s.isPopular });
    setFormError('');
    setModal(s);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.description.trim() || !form.category) return setFormError('Name, description and category are required');
    if (form.price === '' || Number(form.price) < 0) return setFormError('Enter a valid price');
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (modal === 'add') await api.post('/services', payload);
      else await api.put(`/services/${modal._id}`, payload);
      setModal(null);
      load();
    } catch (err) {
      setFormError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete "${s.name}"?`)) return;
    setPageError('');
    try {
      await api.delete(`/services/${s._id}`);
      load();
    } catch (err) {
      setPageError(getError(err));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Services</h2>
        <button className="btn btn-primary" onClick={openAdd} disabled={categories.length === 0}><i className="bi bi-plus-lg me-1"></i>Add service</button>
      </div>
      {categories.length === 0 && !loading && <div className="alert alert-warning py-2">Create a category first, then add services.</div>}
      {pageError && <div className="alert alert-danger py-2">{pageError}</div>}
      {loading ? <Spinner /> : (
        <div className="panel table-responsive">
          <table className="table mb-0">
            <thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Popular</th><th></th></tr></thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td className="fw-semibold">{s.name}</td>
                  <td>{s.category?.name}</td>
                  <td>{formatPrice(s.price)}</td>
                  <td>{s.duration}</td>
                  <td>{s.isPopular ? <i className="bi bi-star-fill text-warning"></i> : '-'}</td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add service' : 'Edit service'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} noValidate>
            {formError && <div className="alert alert-danger py-2">{formError}</div>}
            <div className="mb-3"><label className="form-label fw-semibold">Name</label><input name="name" className="form-control" value={form.name} onChange={handleChange} /></div>
            <div className="mb-3"><label className="form-label fw-semibold">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="mb-3"><label className="form-label fw-semibold">Description</label><textarea name="description" rows="3" className="form-control" value={form.description} onChange={handleChange}></textarea></div>
            <div className="row g-3 mb-3">
              <div className="col-6"><label className="form-label fw-semibold">Price (₹)</label><input name="price" type="number" min="0" className="form-control" value={form.price} onChange={handleChange} /></div>
              <div className="col-6"><label className="form-label fw-semibold">Duration</label><input name="duration" className="form-control" value={form.duration} onChange={handleChange} /></div>
            </div>
            <div className="mb-3"><label className="form-label fw-semibold">Image URL (optional)</label><input name="image" className="form-control" placeholder="https://..." value={form.image} onChange={handleChange} /></div>
            <div className="form-check mb-4">
              <input id="isPopular" name="isPopular" type="checkbox" className="form-check-input" checked={form.isPopular} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isPopular">Show in Popular services</label>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-light border" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save service'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default AdminServices;
