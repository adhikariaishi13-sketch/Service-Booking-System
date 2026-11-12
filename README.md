# HomeEase – Service Booking System (MERN)

Customers browse home services, book a date and time slot, and track the booking. Admins manage services, categories, users and booking status.

## 1. Install
- Node.js 18+ (https://nodejs.org), MongoDB Community Server (https://www.mongodb.com/try/download/community) running locally (or a free MongoDB Atlas URL), VS Code, Postman.

## 2. Run the backend (Terminal 1)
```bash
cd server
npm install
# .env is already included; edit MONGO_URI / JWT_SECRET if needed
npm run seed     # creates categories, 17 services, admin and demo customer
npm run dev      # API on http://localhost:5000
```
Check: open http://localhost:5000/api/health -> {"status":"ok"}

## 3. Run the frontend (Terminal 2)
```bash
cd client
npm install
npm run dev      # website on http://localhost:5173
```

## 4. Demo logins (created by `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin@123 |
| Customer | user@example.com | User@123 |

## 5. Folder structure
```
server/  config/db.js  models/(User,Category,Service,Booking)  middleware/(auth,error,asyncHandler)
         controllers/  routes/  server.js  seed.js  .env
client/  src/ api/axios.js  context/AuthContext.jsx  components/  pages/(user, admin)  App.jsx  index.css
```

## 6. REST API
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | Create account (password hashed with bcrypt) |
| POST | /api/auth/login | public | Returns JWT + user |
| GET | /api/auth/me | user | Current user from token |
| PUT | /api/users/profile | user | Update own profile |
| GET | /api/users | admin | All users |
| DELETE | /api/users/:id | admin | Delete user (and their bookings) |
| GET | /api/users/stats | admin | Dashboard numbers |
| GET | /api/categories | public | List categories |
| POST/PUT/DELETE | /api/categories(/:id) | admin | Manage categories |
| GET | /api/services?search=&category=&popular= | public | List / search / filter |
| GET | /api/services/:id | public | One service |
| POST/PUT/DELETE | /api/services(/:id) | admin | Manage services |
| GET | /api/bookings/slots | public | Time slots |
| POST | /api/bookings | user | Create booking (status Pending) |
| GET | /api/bookings/my | user | My bookings |
| GET | /api/bookings/:id | owner/admin | One booking |
| PUT | /api/bookings/:id/cancel | owner | Cancel (only Pending/Confirmed) |
| GET | /api/bookings | admin | All bookings (?status=) |
| PUT | /api/bookings/:id/status | admin | Update status |

Protected requests send `Authorization: Bearer <token>`. In Postman: login first, copy the token, use it in the Authorization tab (Bearer Token).

## 7. Database (Mongoose)
- **User**: name, email (unique), password (hashed), phone, address, role (`user`/`admin`)
- **Category**: name (unique), description, icon
- **Service**: name, description, price, duration, image, isPopular, `category` -> Category
- **Booking**: `user` -> User, `service` -> Service, bookingDate, timeSlot, address, contactNumber, instructions, price (copied at booking time), status
- Relationships: Category 1—N Service, User 1—N Booking, Service 1—N Booking.

## 8. Viva questions you should be ready for
1. **What is MERN?** MongoDB (database), Express (backend framework), React (frontend), Node.js (runtime).
2. **How does login work?** Server checks the bcrypt hash, signs a JWT with `JWT_SECRET`; React stores it in localStorage; an Axios interceptor adds it to every request; the `protect` middleware verifies it.
3. **How is the admin protected?** `adminOnly` middleware checks `req.user.role` on the server; `ProtectedRoute adminOnly` hides pages on the client. Registration can never create an admin.
4. **Why store price in Booking?** So old bookings keep their price even if the service price changes later.
5. **What is middleware?** A function that runs between request and response (auth, error handling, JSON parsing).
6. **What is `populate`?** Mongoose replaces a stored ObjectId with the referenced document (e.g. booking.service -> service details).
7. **Why the Vite proxy?** Lets React call `/api/...` without CORS problems during development.
8. **Cancellation rule?** Allowed only while status is Pending or Confirmed (checked in `bookingController.cancelBooking`).

## 9. Deployment (short)
- Database: MongoDB Atlas (free) -> copy connection string into `MONGO_URI`.
- Backend: Render / Railway. Root `server`, start `npm start`, set env vars `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL).
- Frontend: Vercel / Netlify. Root `client`, build `npm run build`, output `dist`, env `VITE_API_URL=https://<your-backend>/api`. Add a rewrite of all paths to `/index.html` so React Router works on refresh.
- Run `npm run seed` once against the Atlas database to create the admin account.

## 10. Notes
- Service cards show an icon placeholder when no image URL is set; admins can paste image URLs in Admin -> Services.
- Payment is "pay after service" (no gateway), to keep the scope to the project brief.
