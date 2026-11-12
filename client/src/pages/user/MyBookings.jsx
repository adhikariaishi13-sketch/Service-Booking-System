import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getError } from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatPrice } from '../../utils';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const [error, setError] = useState('');

  const load = () =>
    api.get('/bookings/my').then((res) => setBookings(res.data)).catch((e) => setError(getError(e))).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setError('');
    try {
      await api.put(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      setError(getError(err));
    }
  };

  const isActive = (b) => ['Pending', 'Confirmed', 'In Progress'].includes(b.status);
  const shown = bookings.filter((b) => (tab === 'active' ? isActive(b) : !isActive(b)));

  return (
    <>
      <h2 className="mb-3">My bookings</h2>
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item"><button className={`btn ${tab === 'active' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setTab('active')}>Upcoming ({bookings.filter(isActive).length})</button></li>
        <li className="nav-item"><button className={`btn ${tab === 'history' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setTab('history')}>History ({bookings.filter((b) => !isActive(b)).length})</button></li>
      </ul>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading ? <Spinner /> : shown.length === 0 ? (
        <div className="empty panel">
          <i className="bi bi-calendar-x"></i>
          <p className="mt-2">{tab === 'active' ? 'No upcoming bookings yet.' : 'No past bookings yet.'}</p>
          <Link to="/services" className="btn btn-primary">Browse services</Link>
        </div>
      ) : (
        <div className="panel table-responsive">
          <table className="table mb-0">
            <thead><tr><th>Service</th><th>Date and time</th><th>Address</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {shown.map((b) => (
                <tr key={b._id}>
                  <td><div className="fw-semibold">{b.service?.name || 'Service removed'}</div><div className="small text-muted">#{b._id.slice(-8).toUpperCase()}</div></td>
                  <td>{formatDate(b.bookingDate)}<div className="small text-muted">{b.timeSlot}</div></td>
                  <td style={{ maxWidth: 220 }} className="small">{b.address}</td>
                  <td>{formatPrice(b.price)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>{['Pending', 'Confirmed'].includes(b.status) && <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(b._id)}>Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MyBookings;
