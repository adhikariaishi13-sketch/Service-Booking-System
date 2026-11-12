import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { formatDate, formatPrice } from '../utils';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`).then((res) => setBooking(res.data)).catch(() => setBooking(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!booking) return <div className="container section empty"><p>Booking not found.</p><Link to="/dashboard/bookings" className="btn btn-primary">My bookings</Link></div>;

  const row = (label, value) => (
    <div className="d-flex justify-content-between py-2 border-bottom gap-3">
      <span className="text-muted">{label}</span><span className="fw-semibold text-end">{value}</span>
    </div>
  );

  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <div className="text-center mb-4">
        <div className="confirm-tick"><i className="bi bi-check-lg"></i></div>
        <h1 className="section-title">Booking placed</h1>
        <p className="text-muted">We have received your request. You can track it from your dashboard.</p>
      </div>
      <div className="panel p-4">
        {row('Booking ID', `#${booking._id.slice(-8).toUpperCase()}`)}
        {row('Service', booking.service?.name)}
        {row('Date', formatDate(booking.bookingDate))}
        {row('Time slot', booking.timeSlot)}
        {row('Address', booking.address)}
        {row('Contact', booking.contactNumber)}
        {booking.instructions && row('Instructions', booking.instructions)}
        {row('Amount', formatPrice(booking.price))}
        {row('Status', <StatusBadge status={booking.status} />)}
      </div>
      <div className="d-flex gap-2 justify-content-center mt-4">
        <Link to="/dashboard/bookings" className="btn btn-primary">View my bookings</Link>
        <Link to="/services" className="btn btn-outline-primary">Book another service</Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
