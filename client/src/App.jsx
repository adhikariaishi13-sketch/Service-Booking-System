import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import BookService from './pages/BookService';
import BookingConfirmation from './pages/BookingConfirmation';
import NotFound from './pages/NotFound';
import UserProfile from './pages/user/UserProfile';
import MyBookings from './pages/user/MyBookings';
import AdminOverview from './pages/admin/AdminOverview';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/book/:id" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
      <Route path="/booking-confirmation/:id" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<UserProfile />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="bookings" element={<MyBookings />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute adminOnly><DashboardLayout admin /></ProtectedRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </>
);

export default App;
