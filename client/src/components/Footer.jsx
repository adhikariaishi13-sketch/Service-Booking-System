import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="brand text-white mb-2">
            <span className="brand-mark"><i className="bi bi-house-heart-fill"></i></span> HomeEase
          </div>
          <p className="small">Verified professionals for cleaning, repairs, painting and beauty care, booked online in a few clicks.</p>
        </div>
        <div className="col-6 col-lg-2">
          <h6>Explore</h6>
          <ul className="list-unstyled small">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">All services</Link></li>
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/register">Create account</Link></li>
          </ul>
        </div>
        <div className="col-6 col-lg-3">
          <h6>Popular</h6>
          <ul className="list-unstyled small">
            <li>AC Repair</li><li>Home Cleaning</li><li>Plumbing</li><li>Salon at Home</li>
          </ul>
        </div>
        <div className="col-lg-3">
          <h6>Contact us</h6>
          <ul className="list-unstyled small">
            <li><i className="bi bi-geo-alt me-2"></i>Salt Lake, Kolkata 700091</li>
            <li><i className="bi bi-telephone me-2"></i>+91 98765 43210</li>
            <li><i className="bi bi-envelope me-2"></i>support@homeease.in</li>
          </ul>
        </div>
      </div>
      <hr className="border-secondary mt-4" />
      <div className="small text-center">© {new Date().getFullYear()} HomeEase. College project, built with the MERN stack.</div>
    </div>
  </footer>
);

export default Footer;
