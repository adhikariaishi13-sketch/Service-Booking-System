import { Link } from 'react-router-dom';
import { useState } from 'react';
import { formatPrice } from '../utils';

const ServiceCard = ({ service }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const icon = service.category?.icon || 'bi-tools';

  return (
    <div className="service-card">
      <div className="service-media">
        {service.image && !imgFailed ? (
          <img src={service.image} alt={service.name} onError={() => setImgFailed(true)} />
        ) : (
          <i className={`bi ${icon}`}></i>
        )}
        {service.isPopular && <span className="popular-flag">Popular</span>}
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="small text-muted mb-1">{service.category?.name}</div>
        <h5 className="mb-1">{service.name}</h5>
        <p className="small text-muted clamp-2 mb-3">{service.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <div className="price">{formatPrice(service.price)}</div>
            <div className="small text-muted"><i className="bi bi-clock me-1"></i>{service.duration}</div>
          </div>
          <div className="d-flex gap-2">
            <Link to={`/services/${service._id}`} className="btn btn-sm btn-outline-primary">Details</Link>
            <Link to={`/book/${service._id}`} className="btn btn-sm btn-primary">Book now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
