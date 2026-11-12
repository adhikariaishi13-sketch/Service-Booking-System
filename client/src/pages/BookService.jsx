import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { formatPrice, todayISO } from '../utils';

const BookService = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    bookingDate: '',
    timeSlot: '',
    address: user.address || '',
    contactNumber: user.phone || '',
    instructions: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/services/${id}`), api.get('/bookings/slots')])
      .then(([s, t]) => {
        setService(s.data);
        setSlots(t.data);
      })
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.bookingDate) e.bookingDate = 'Choose a date';
    else if (form.bookingDate < todayISO()) e.bookingDate = 'Date cannot be in the past';
    if (!form.timeSlot) e.timeSlot = 'Choose a time slot';
    if (form.address.trim().length < 10) e.address = 'Enter your full address (at least 10 characters)';
    if (!/^[6-9]\d{9}$/.test(form.contactNumber)) e.contactNumber = 'Enter a valid 10-digit mobile number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/bookings', { serviceId: id, ...form });
      navigate(`/booking-confirmation/${res.data._id}`, { replace: true });
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!service) return <div className="container section empty"><p>Service not found.</p><Link to="/services" className="btn btn-primary">Back to services</Link></div>;

  return (
    <div className="container section">
      <h1 className="section-title mb-4">Book {service.name}</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <form className="panel p-4" onSubmit={handleSubmit} noValidate>
            {serverError && <div className="alert alert-danger py-2">{serverError}</div>}
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="bookingDate">Date</label>
              <input id="bookingDate" type="date" name="bookingDate" min={todayISO()} className={`form-control ${errors.bookingDate ? 'is-invalid' : ''}`} value={form.bookingDate} onChange={handleChange} style={{ maxWidth: 260 }} />
              <div className="invalid-feedback">{errors.bookingDate}</div>
            </div>
            <div className="mb-4">
              <div className="form-label fw-semibold">Time slot</div>
              <div className="d-flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button type="button" key={s} className={`slot-btn ${form.timeSlot === s ? 'active' : ''}`} onClick={() => setForm({ ...form, timeSlot: s })}>{s}</button>
                ))}
              </div>
              {errors.timeSlot && <div className="text-danger small mt-1">{errors.timeSlot}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="address">Service address</label>
              <textarea id="address" name="address" rows="3" className={`form-control ${errors.address ? 'is-invalid' : ''}`} placeholder="Flat / house no., street, landmark, area, pincode" value={form.address} onChange={handleChange}></textarea>
              <div className="invalid-feedback">{errors.address}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="contactNumber">Contact number</label>
              <input id="contactNumber" name="contactNumber" type="tel" maxLength={10} className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`} value={form.contactNumber} onChange={handleChange} style={{ maxWidth: 260 }} />
              <div className="invalid-feedback">{errors.contactNumber}</div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="instructions">Additional instructions (optional)</label>
              <textarea id="instructions" name="instructions" rows="2" className="form-control" placeholder="e.g. Please call before arriving" value={form.instructions} onChange={handleChange}></textarea>
            </div>
            <button className="btn btn-primary btn-lg" disabled={submitting}>{submitting ? 'Confirming...' : 'Confirm booking'}</button>
          </form>
        </div>
        <div className="col-lg-4">
          <div className="summary-card">
            <h5 className="mb-3">Booking summary</h5>
            <div className="fw-semibold">{service.name}</div>
            <div className="small text-muted mb-3">{service.category?.name} · {service.duration}</div>
            <div className="d-flex justify-content-between border-top pt-3">
              <span>Total to pay</span><span className="price">{formatPrice(service.price)}</span>
            </div>
            <div className="small text-muted mt-2">Pay after the service is completed.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
