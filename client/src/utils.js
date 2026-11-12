export const formatPrice = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};
