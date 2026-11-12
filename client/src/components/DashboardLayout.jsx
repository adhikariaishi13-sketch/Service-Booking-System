import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userLinks = [
  { to: '/dashboard/profile', icon: 'bi-person', label: 'My profile' },
  { to: '/dashboard/bookings', icon: 'bi-calendar-check', label: 'My bookings' },
  { to: '/services', icon: 'bi-grid', label: 'Browse services' },
];

const adminLinks = [
  { to: '/admin', icon: 'bi-speedometer2', label: 'Overview', end: true },
  { to: '/admin/bookings', icon: 'bi-calendar-check', label: 'Bookings' },
  { to: '/admin/services', icon: 'bi-wrench-adjustable', label: 'Services' },
  { to: '/admin/categories', icon: 'bi-tags', label: 'Categories' },
  { to: '/admin/users', icon: 'bi-people', label: 'Users' },
];

const DashboardLayout = ({ admin = false }) => {
  const { user } = useAuth();
  const links = admin ? adminLinks : userLinks;

  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="side-head px-2 mb-3">
          <div className="fw-bold">{user.name}</div>
          <div className="small text-muted">{admin ? 'Administrator' : 'Customer'}</div>
        </div>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className="side-link">
            <i className={`bi ${l.icon}`}></i>{l.label}
          </NavLink>
        ))}
      </aside>
      <main className="dash-main"><Outlet /></main>
    </div>
  );
};

export default DashboardLayout;
