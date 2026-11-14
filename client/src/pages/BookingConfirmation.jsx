
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { formatDate, formatPrice } from '../utils';

const UPI_ID = '8777259880-2@ybl';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/bookings/${id}`)
      .then((res) => setBooking(res.data))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  if (!booking) {
    return (
      <div className="container section empty">
        <p>Booking not found.</p>
        <Link to="/dashboard/bookings" className="btn btn-primary">
          My bookings
        </Link>
      </div>
    );
  }

  const row = (label, value) => (
    <div className="d-flex justify-content-between py-2 border-bottom gap-3">
      <span className="text-muted">{label}</span>
      <span className="fw-semibold text-end">{value}</span>
    </div>
  );

  const paymentMethod = booking.paymentMethod || 'Pay After';
  const paymentStatus = booking.paymentStatus || 'Pending';
  const originalPrice = booking.originalPrice ?? booking.price;
  const discount = booking.discount ?? 0;

  const bookingReference = booking._id.slice(-8).toUpperCase();

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent('Service Booking')}` +
    `&am=${Number(booking.price).toFixed(2)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(`Booking ${bookingReference}`)}`;

  const showQRCode =
    paymentMethod === 'Pay Before' && paymentStatus !== 'Paid';

  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <div className="text-center mb-4">
        <div className="confirm-tick">
          <i className="bi bi-check-lg"></i>
        </div>

        <h1 className="section-title">Booking placed</h1>

        <p className="text-muted">
          We have received your request. You can track it from your dashboard.
        </p>
      </div>

      <div className="panel p-4">
        {row('Booking ID', `#${bookingReference}`)}
        {row('Service', booking.service?.name)}
        {row('Date', formatDate(booking.bookingDate))}
        {row('Time slot', booking.timeSlot)}
        {row('Address', booking.address)}
        {row('Contact', booking.contactNumber)}

        {booking.instructions &&
          row('Instructions', booking.instructions)}

        {row('Payment Method', paymentMethod)}

        {discount > 0 ? (
          <>
            {row('Original Price', formatPrice(originalPrice))}
            {row('Discount', `- ${formatPrice(discount)}`)}
          </>
        ) : null}

        {row('Final Amount', formatPrice(booking.price))}
        {row('Booking Status', <StatusBadge status={booking.status} />)}
        {row('Payment Status', paymentStatus)}
      </div>

      {showQRCode && (
        <div className="panel p-4 mt-4 text-center">
          <h3 className="mb-2">Pay Before - UPI Payment</h3>

          <p className="text-muted">
            Scan this QR code using any UPI payment app.
          </p>

          <div className="d-flex justify-content-center my-3">
            <QRCodeSVG
              value={upiLink}
              size={220}
              level="H"
              includeMargin
            />
          </div>

          <h4 className="fw-bold mb-2">
            {formatPrice(booking.price)}
          </h4>

          <p className="mb-1">
            <strong>UPI ID:</strong> {UPI_ID}
          </p>

          <p className="text-muted small mt-3">
            Before making payment, check that the UPI app shows the
            correct receiver and amount.
          </p>

          <div className="alert alert-warning text-start mt-3 mb-0">
            <strong>Important:</strong> Your payment status will remain
            Pending until the payment is manually verified. Keep your
            UPI transaction reference number for verification.
          </div>
        </div>
      )}

      {paymentMethod === 'Pay After' && (
        <div className="panel p-4 mt-4 text-center">
          <h4 className="mb-2">Pay After Service</h4>

          <p className="text-muted mb-2">
            You have selected Pay After. You will pay the full service
            amount after the service is completed.
          </p>

          <h4 className="fw-bold">
            {formatPrice(booking.price)}
          </h4>

          <span className="badge bg-warning text-dark mt-2">
            Payment Pending
          </span>
        </div>
      )}

      {paymentMethod === 'Pay Before' && paymentStatus === 'Paid' && (
        <div className="alert alert-success mt-4 text-center">
          <strong>Payment verified.</strong>
          <p className="mb-0">Your payment has been marked as Paid.</p>
        </div>
      )}

      <div className="d-flex gap-2 justify-content-center mt-4 flex-wrap">
        <Link to="/dashboard/bookings" className="btn btn-primary">
          View my bookings
        </Link>

        <Link to="/services" className="btn btn-outline-primary">
          Book another service
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
