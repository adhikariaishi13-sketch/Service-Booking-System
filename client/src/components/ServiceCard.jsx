
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { formatPrice } from '../utils';

const categoryImages = {
  'AC Repair':
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&auto=format&fit=crop',
  'Appliance Repair':
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=900&auto=format&fit=crop',
  'Beauty Services':
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&auto=format&fit=crop',
  'Carpentry':
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&auto=format&fit=crop',
  'Electrical Repair':
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&auto=format&fit=crop',
  'Home Cleaning':
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&auto=format&fit=crop',
  'Painting':
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900&auto=format&fit=crop',
  'Plumbing':
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&auto=format&fit=crop',
};

const ServiceCard = ({ service }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const icon = service.category?.icon || 'bi-tools';

  const imageUrl =
    service.image || categoryImages[service.category?.name];

  return (
    <div className="service-card">
      <div className="service-media">
        {imageUrl && !imgFailed ? (
          <img
            src={imageUrl}
            alt={service.name}
            onError={() => setImgFailed(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <i className={`bi ${icon}`}></i>
        )}

        {service.isPopular && (
          <span className="popular-flag">Popular</span>
        )}
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="small text-muted mb-1">
          {service.category?.name}
        </div>

        <h5 className="mb-1">{service.name}</h5>

        <p className="small text-muted clamp-2 mb-3">
          {service.description}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <div className="price">
              {formatPrice(service.price)}
            </div>

            <div className="small text-muted">
              <i className="bi bi-clock me-1"></i>
              {service.duration}
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/services/${service._id}`}
              className="btn btn-sm btn-outline-primary"
            >
              Details
            </Link>

            <Link
              to={`/book/${service._id}`}
              className="btn btn-sm btn-primary"
            >
              Book now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
