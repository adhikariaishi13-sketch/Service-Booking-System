import { useEffect, useState } from 'react';
import api, { getError } from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { STATUSES, formatDate, formatPrice } from '../../utils';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/bookings', { params: { status: filter } })
      .then((res) => setBookings(res.data))
      .catch((e) => setError(getError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]); // eslint-disable-line

  const changeStatus = async (id, status) => {
    setError('');
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      setBookings((list) => list.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h2 className="m-0">All bookings</h2>
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading ? <Spinner /> : (
        <div className="panel table-responsive">
          <table className="table mb-0">
            <thead><tr><th>Customer</th><th>Service</th><th>Date and time</th><th>Address and contact</th><th>Amount</th><th>Status</th><th>Update status</th></tr></thead>
            <tbody>
              {bookings.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No bookings found</td></tr>}
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td><div className="fw-semibold">{b.user?.name || 'Deleted user'}</div><div className="small text-muted">{b.user?.email}</div></td>
                  <td>{b.service?.name || 'Service removed'}</td>
                  <td>{formatDate(b.bookingDate)}<div className="small text-muted">{b.timeSlot}</div></td>
                  <td style={{ maxWidth: 220 }} className="small">{b.address}<div className="text-muted">{b.contactNumber}</div>{b.instructions && <div className="fst-italic">“{b.instructions}”</div>}</td>
                  <td>{formatPrice(b.price)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <select className="form-select form-select-sm" value={b.status} onChange={(e) => changeStatus(b._id, e.target.value)} aria-label="Update status">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminBookings;
