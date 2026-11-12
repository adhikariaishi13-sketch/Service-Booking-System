import { useEffect, useState } from 'react';
import api, { getError } from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatDate } from '../../utils';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => api.get('/users').then((res) => setUsers(res.data)).catch((e) => setError(getError(e))).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name} and all their bookings?`)) return;
    setError('');
    try {
      await api.delete(`/users/${u._id}`);
      load();
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <>
      <h2 className="mb-3">Registered users</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading ? <Spinner /> : (
        <div className="panel table-responsive">
          <table className="table mb-0">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'text-bg-warning' : 'text-bg-light border'}`}>{u.role}</span></td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td className="text-end">{u.role !== 'admin' && <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u)}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
