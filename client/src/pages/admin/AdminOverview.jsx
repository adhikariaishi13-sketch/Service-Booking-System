import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatPrice } from '../../utils';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/users/stats').then((res) => setStats(res.data));
    api.get('/bookings').then((res) => setRecent(res.data.slice(0, 5)));
  }, []);

  if (!stats) return <Spinner />;

  const cards = [
    { label: 'Customers', value: stats.users, icon: 'bi-people' },
    { label: 'Services', value: stats.services, icon: 'bi-wrench-adjustable' },
    { label: 'Total bookings', value: stats.bookings, icon: 'bi-calendar-check' },
    { label: 'Pending bookings', value: stats.pending, icon: 'bi-hourglass-split' },
    { label: 'Completed', value: stats.completed, icon: 'bi-check2-circle' },
    { label: 'Revenue (completed)', value: formatPrice(stats.revenue), icon: 'bi-currency-rupee' },
  ];

  return (
    <>
      <h2 className="mb-4">Admin overview</h2>
      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-sm-6 col-xl-4" key={c.label}>
            <div className="stat-card d-flex justify-content-between align-items-start">
              <div><div className="text-muted small">{c.label}</div><div className="num">{c.value}</div></div>
              <i className={`bi ${c.icon} fs-3 text-primary`}></i>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="m-0">Latest bookings</h5>
        <Link to="/admin/bookings">View all</Link>
      </div>
      <div className="panel table-responsive">
        <table className="table mb-0">
          <thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {recent.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No bookings yet</td></tr>}
            {recent.map((b) => (
              <tr key={b._id}>
                <td>{b.user?.name || 'Deleted user'}</td>
                <td>{b.service?.name || 'Service removed'}</td>
                <td>{formatDate(b.bookingDate)}</td>
                <td><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminOverview;
