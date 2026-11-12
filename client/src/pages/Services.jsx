import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../components/Spinner';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const [searchText, setSearchText] = useState(search);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/services', { params: { search, category } })
      .then((res) => setServices(res.data))
      .catch(() => setError('Could not load services. Is the server running?'))
      .finally(() => setLoading(false));
  }, [search, category]);

  const updateParams = (changes) => {
    const next = { search, category, ...changes };
    const clean = {};
    Object.keys(next).forEach((k) => next[k] && (clean[k] = next[k]));
    setSearchParams(clean);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchText.trim() });
  };

  const clearAll = () => {
    setSearchText('');
    setSearchParams({});
  };

  return (
    <div className="container section">
      <h1 className="section-title mb-1">All services</h1>
      <p className="text-muted mb-4">Search or filter to find the right professional.</p>

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-6">
          <input className="form-control" placeholder="Search services..." value={searchText} onChange={(e) => setSearchText(e.target.value)} aria-label="Search services" />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={category} onChange={(e) => updateParams({ category: e.target.value })} aria-label="Filter by category">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button className="btn btn-primary flex-grow-1" type="submit">Search</button>
          {(search || category) && <button type="button" className="btn btn-light border" onClick={clearAll}>Clear</button>}
        </div>
      </form>

      {loading ? <Spinner /> : error ? <div className="alert alert-danger">{error}</div> : services.length === 0 ? (
        <div className="empty"><i className="bi bi-search"></i><p className="mt-2">No services match your search. Try a different word or category.</p></div>
      ) : (
        <>
          <p className="text-muted small">{services.length} service{services.length > 1 ? 's' : ''} found</p>
          <div className="row g-4">
            {services.map((s) => <div className="col-md-6 col-lg-4" key={s._id}><ServiceCard service={s} /></div>)}
          </div>
        </>
      )}
    </div>
  );
};

export default Services;
