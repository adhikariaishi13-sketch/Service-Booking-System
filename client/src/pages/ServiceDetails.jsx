import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { formatPrice } from '../utils';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    api.get(`/services/${id}`).then((res) => setService(res.data)).catch(() => setService(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!service) {
    return (
      <div className="container section empty">
        <i className="bi bi-emoji-frown"></i>
        <p className="mt-2">This service could not be found.</p>
        <Link to="/services" className="btn btn-primary">Back to services</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <nav className="small mb-3"><Link to="/services">Services</Link> / {service.category?.name} / {service.name}</nav>
      <div className="row g-5">
        <div className="col-lg-7">
          <div className="service-media rounded-4 overflow-hidden" style={{ height: 340, fontSize: '5rem' }}>
            {service.image && !imgFailed ? <img src={service.image} alt={service.name} onError={() => setImgFailed(true)} /> : <i className={`bi ${service.category?.icon || 'bi-tools'}`}></i>}
          </div>
        </div>
        <div className="col-lg-5">
          <span className="badge text-bg-light border mb-2">{service.category?.name}</span>
          <h1 className="mb-2">{service.name}</h1>
          <div className="price fs-2 mb-3">{formatPrice(service.price)}</div>
          <p>{service.description}</p>
          <ul className="list-unstyled text-muted">
            <li className="mb-1"><i className="bi bi-clock me-2"></i>Takes about {service.duration}</li>
            <li className="mb-1"><i className="bi bi-shield-check me-2"></i>Verified professional</li>
            <li className="mb-1"><i className="bi bi-arrow-repeat me-2"></i>Free cancellation before work starts</li>
          </ul>
          <Link to={`/book/${service._id}`} className="btn btn-primary btn-lg w-100 mt-3">Book now</Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
