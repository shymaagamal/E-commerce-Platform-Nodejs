# USER
* login --> session managment
```
1️⃣ User Logs In

A session is created when the user logs in.
Example: Store user authentication info or cart data in the session.

2️⃣ Guest User Adds to Cart

If a guest (not logged in) adds items to the cart, a session is created.
The cart data is stored temporarily until they check out or the session expires.

```

# Online Bookstore (E-commerce Platform) - Backend API

## Project Overview
This project is the backend for an online bookstore, providing RESTful APIs for user authentication, book management, cart handling, order processing, and reviews. It is built using **Node.js, Express.js, and MongoDB**.

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT Authentication**
- **bcrypt.js for password hashing**
- **Multer for file uploads**
- **Winston for logging**
- **Nodemailer for email notifications**
- **Stripe/PayPal for payment integration (optional)**
- **Redis for caching (optional)**

## API Endpoints

### 1. User Authentication
1️⃣ User Management (Authentication & Authorization)

🔹 Features:

✅ User registration & login

✅ Role-based access control (Admin/User)

✅ JWT authentication

✅ Profile management

✅ Social login (Google, Facebook) (Bonus)

✅ Session management (Single active session)
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login  | User login (returns JWT) |
| GET    | /api/auth/logout | Logout and destroy session |
| GET    | /api/users/me    | Get current user profile |
| PUT    | /api/users/me    | Update user profile |
| GET    | /api/users       | Get all users (admin only) |
| DELETE | /api/users/:id   | Delete a user (admin only) |

### 2. Books Management

🔹 Features:

✅ CRUD operations for books

✅ Pagination & filtering (category, author, price range)

✅ Upload book images (Multer/CDN)

✅ Full-text search

🔹 Filtering Example:

👉 /api/books?author=J.K.Rowling&price[lte]=500&category=Fiction&page=2&limit=10

👉 /api/books/search?q=harry potter (Full-text search)

| Method | Endpoint          | Description |
|--------|------------------|-------------|
| GET    | /api/books       | Get all books (with pagination & filtering) |
| GET    | /api/books/:id   | Get details of a book |
| POST   | /api/books       | Add a new book (admin only) |
| PUT    | /api/books/:id   | Update a book (admin only) |
| DELETE | /api/books/:id   | Delete a book (admin only) |
| POST   | /api/books/upload | Upload book image (admin only) |

### 3. Cart Management

🔹 Features:

✅ Add/remove books from cart

✅ Store cart in sessions (express-session + connect-mongo)

✅ Cart persists even after page refresh

| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| GET    | /api/cart         | Get user cart |
| POST   | /api/cart/add     | Add a book to cart |
| DELETE | /api/cart/remove  | Remove a book from cart |
| DELETE | /api/cart/clear   | Clear user cart |

### 4. Order Management

✅ Users place orders from cart

✅ Order transactions (Reduce stock, create order atomically)

✅ Order history & tracking

✅ Admin updates order status

✅ Payment gateway (Stripe/PayPal)

| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| POST   | /api/orders       | Place an order |
| GET    | /api/orders       | Get all user orders | (User/Admin)
| GET    | /api/orders/:id   | Get details of a specific order |
| GET    | /api/orders/admin | Get all orders (admin only) |
| PUT    | /api/orders/:id   | Update order status (admin only) |
 Order Status Examples: "Pending" → "Cancelled"  → "Completed"
### 5. Reviews Management

🔹 Features:

✅ Users can review books

✅ Update & delete only own reviews

✅ Average rating for books

| Method | Endpoint            | Description |
|--------|--------------------|-------------|
| GET    | /api/reviews/:bookId | Get all reviews for a book |
| POST   | /api/reviews       | Add a review |
| PUT    | /api/reviews/:id   | Update a review |
| DELETE | /api/reviews/:id   | Delete a review |

### 6. Payment Integration

🔹 Features:

✅ Process payments securely using Stripe/PayPal

✅ Save order after successful payment

| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| POST   | /api/payments/checkout | Create payment session (Stripe/PayPal) |
| GET   | /api/payments/status | Check payment status |

### 7. Notifications

🔹 Features:

✅ Notify users about order updates

✅ In-app notifications using WebSockets

✅ Email notifications (Nodemailer)

| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| POST   | /api/notifications | Get all notifications (User/Admin) |
| GET   | /api/notifications/send | Send notification (Admin) |

## 🔹 Important Considerations
✅ Security:

Use JWT for authentication.
Encrypt passwords with bcrypt.js.
Use Helmet & CORS to protect APIs.
Rate limiting (express-rate-limit) to prevent abuse.
✅ Database Indexing:

Index email in Users (for faster lookups).
Index title & author in Books (for full-text search).
Index createdAt in Orders (for recent orders retrieval).
✅ Error Handling & Logging:

Centralized error handler (app.use(errorHandler)).
Log requests using Winston or Morgan.
✅ Deployment Considerations:

Store secrets in .env file (DB URL, JWT Secret).
Deploy on Heroku, AWS, or Vercel.
Use MongoDB Atlas for production.

## Middleware Implemented
- **JWT Authentication Middleware** (Protects routes from unauthorized access)
- **Role-based Access Control (RBAC)**
- **Error Handling Middleware** (Centralized error handling)
- **Logging Middleware** (Winston/Morgan for request logging)

## How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file and add the following:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### 3. Start the Server
```bash
npm start
```

### 4. Run in Development Mode (with Nodemon)
```bash
npm run dev
```

## Future Enhancements
- Implement caching using Redis for book listings
- WebSocket notifications for real-time updates
- Social login with Google/Facebook
- Deploy to cloud platforms (Heroku, AWS, Vercel)

---
This backend is designed to work efficiently and securely. Feel free to contribute and improve!
