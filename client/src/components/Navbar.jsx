import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg site-nav py-2">
      <div className="container">
        <Link to="/" className="brand navbar-brand m-0">
          <span className="brand-mark"><i className="bi bi-house-heart-fill"></i></span>
          HomeEase
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink end to="/" className="nav-link">Home</NavLink></li>
            <li className="nav-item"><NavLink to="/services" className="nav-link">Services</NavLink></li>
            {user && user.role === 'user' && <li className="nav-item"><NavLink to="/dashboard/bookings" className="nav-link">My bookings</NavLink></li>}
            {user && user.role === 'admin' && <li className="nav-item"><NavLink to="/admin" className="nav-link">Admin</NavLink></li>}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard/profile'} className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-person-circle me-1"></i>{user.name.split(' ')[0]}
                </Link>
                <button className="btn btn-sm btn-light border" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-primary">Log in</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
