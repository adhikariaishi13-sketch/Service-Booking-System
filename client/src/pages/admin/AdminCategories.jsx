import { useEffect, useState } from 'react';
import api, { getError } from '../../api/axios';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const emptyForm = { name: '', description: '', icon: 'bi-tools' };
const ICONS = ['bi-stars', 'bi-droplet-half', 'bi-lightning-charge', 'bi-snow2', 'bi-palette', 'bi-tv', 'bi-scissors', 'bi-hammer', 'bi-tools', 'bi-house-gear', 'bi-bug', 'bi-truck'];

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/categories').then((res) => setCategories(res.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setFormError(''); setModal('add'); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '', icon: c.icon }); setFormError(''); setModal(c); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) return setFormError('Category name is required');
    setSaving(true);
    try {
      if (modal === 'add') await api.post('/categories', form);
      else await api.put(`/categories/${modal._id}`, form);
      setModal(null);
      load();
    } catch (err) {
      setFormError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    setPageError('');
    try {
      await api.delete(`/categories/${c._id}`);
      load();
    } catch (err) {
      setPageError(getError(err));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Categories</h2>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg me-1"></i>Add category</button>
      </div>
      {pageError && <div className="alert alert-danger py-2">{pageError}</div>}
      {loading ? <Spinner /> : (
        <div className="panel table-responsive">
          <table className="table mb-0">
            <thead><tr><th>Icon</th><th>Name</th><th>Description</th><th>Services</th><th></th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td><i className={`bi ${c.icon} fs-4 text-primary`}></i></td>
                  <td className="fw-semibold">{c.name}</td>
                  <td className="small text-muted">{c.description}</td>
                  <td>{c.serviceCount}</td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add category' : 'Edit category'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} noValidate>
            {formError && <div className="alert alert-danger py-2">{formError}</div>}
            <div className="mb-3"><label className="form-label fw-semibold">Name</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="mb-3"><label className="form-label fw-semibold">Description</label><input className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="mb-4">
              <div className="form-label fw-semibold">Icon</div>
              <div className="d-flex flex-wrap gap-2">
                {ICONS.map((i) => (
                  <button type="button" key={i} aria-label={i} className={`btn ${form.icon === i ? 'btn-primary' : 'btn-light border'}`} onClick={() => setForm({ ...form, icon: i })}><i className={`bi ${i}`}></i></button>
                ))}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-light border" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save category'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default AdminCategories;
