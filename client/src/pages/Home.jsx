import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../components/Spinner';

const steps = [
  { title: 'Choose a service', text: 'Search or browse categories and pick what you need.' },
  { title: 'Pick date and time', text: 'Select a day and a two-hour slot that suits you.' },
  { title: 'Confirm your booking', text: 'Add your address and phone number, then confirm.' },
  { title: 'Get it done', text: 'A verified professional arrives. Track status in your dashboard.' },
];

const testimonials = [
  { name: 'Riya Banerjee', place: 'Salt Lake', text: 'My AC was serviced the next morning. The technician was on time and left the room clean.' },
  { name: 'Arjun Mukherjee', place: 'New Town', text: 'Booked a deep clean before Durga Puja. Easy to book and I could see the status the whole time.' },
  { name: 'Sneha Das', place: 'Behala', text: 'The salon-at-home visit was comfortable and the price was exactly what was shown online.' },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/services?popular=true')])
      .then(([c, s]) => {
        setCategories(c.data);
        setPopular(s.data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1>Trusted help for your home, booked in a minute.</h1>
              <p className="lead my-4">Cleaning, repairs, painting and beauty care from verified professionals. Fixed prices, your time slot.</p>
              <form className="hero-search" onSubmit={handleSearch}>
                <input className="form-control" placeholder="Try “AC service” or “plumber”" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search services" />
                <button className="btn btn-accent" type="submit"><i className="bi bi-search me-1"></i>Search</button>
              </form>
            </div>
            <div className="col-lg-6">
              <div className="hero-tiles">
                {categories.slice(0, 8).map((c) => (
                  <Link key={c._id} to={`/services?category=${c._id}`} className="hero-tile">
                    <i className={`bi ${c.icon}`}></i>{c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <h2 className="section-title">Popular services</h2>
              <p className="section-sub m-0">The jobs people in Kolkata book most often.</p>
            </div>
            <Link to="/services" className="btn btn-outline-primary">View all services</Link>
          </div>
          {loading ? <Spinner /> : (
            <div className="row g-4">
              {popular.map((s) => (
                <div className="col-md-6 col-lg-4" key={s._id}><ServiceCard service={s} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-mist">
        <div className="container">
          <h2 className="section-title mb-4">Browse by category</h2>
          <div className="row g-3">
            {categories.map((c) => (
              <div className="col-6 col-md-4 col-lg-3" key={c._id}>
                <Link to={`/services?category=${c._id}`} className="cat-card">
                  <div className="cat-icon"><i className={`bi ${c.icon}`}></i></div>
                  <h6 className="mb-1">{c.name}</h6>
                  <div className="small text-muted">{c.serviceCount} services</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title mb-4">How it works</h2>
          <div className="row g-4">
            {steps.map((s, i) => (
              <div className="col-sm-6 col-lg-3" key={s.title}>
                <div className="step-circle mb-3">{i + 1}</div>
                <h5>{s.title}</h5>
                <p className="text-muted small">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-mist">
        <div className="container">
          <h2 className="section-title mb-4">What customers say</h2>
          <div className="row g-4">
            {testimonials.map((t) => (
              <div className="col-md-4" key={t.name}>
                <div className="quote-card">
                  <div className="stars mb-2">{[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill me-1"></i>)}</div>
                  <p>“{t.text}”</p>
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <div className="avatar">{t.name[0]}</div>
                    <div><div className="fw-semibold">{t.name}</div><div className="small text-muted">{t.place}, Kolkata</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
