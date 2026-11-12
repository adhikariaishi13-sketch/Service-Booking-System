import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container section text-center">
    <h1 className="display-4 fw-bold">Page not found</h1>
    <p className="text-muted">The page you are looking for does not exist or has moved.</p>
    <Link to="/" className="btn btn-primary">Go to home</Link>
  </div>
);

export default NotFound;
