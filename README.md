# 📚 E-Commerce Bookstore Online Platform

## 1. Project Title & Description
**Title :** E-Commerce Bookstore  
**Short Description :**  
An online platform for purchasing books with user authentication, order management, and payment processing. Users can browse books, add them to a cart, place orders, and track their order history. Admins can manage books and orders efficiently.

---

## 2. Features
🔐  **User Authentication & Authorization** ( Register , Login , Logout , Update Profile )  
📖 **Book Management & Pagination** ( Add , Update by ID , Delete books for admins only )  
🔍 **Book Browsing & Search** ( View books for users by id )  
🛒 **Shopping Cart Management**  ( Add , View , Delete )  
📦 **Order Placement**   ( Automatically a transaction from cart through user's session upon register/log in )  
💳 **Payment Integration** ( Stripe )  
📊 **Stock Management & Order Processing** ( Order status changes , Cancel order )  
📜 **Order History & Tracking**  ( all orders or specifci one by id )  
🛠 **Admin Dashboard for Book & Order Management**  ( Admin is being Notified Upon Changes )  
⭐ **Reviews & Ratings System**  ( Add , View , Update , Delete)

---

## 3. Tech Stack
- **Backend :** Node
- **RESTful API with Secure Endpoints :** Express  
- **Database :** Mongo Atlas    
- **Authentication :** JWT ( JSON Web Tokens )  
- **Validation :** Express Validator  
- **Payment Gateway :** Stripe  
- **Deployment :** Docker, AWS   
- **Logging :** Winston , Morgan  
- **Books Cover Images :** Multer , Cloudinary  
- **Cookies :** Cookie Parser  
- **WebSockets For Real-Time Updates :** Socket.io  
- **Jobs/Tasks Scheduler :** Cron Job ( For deleting the canceled orders a day ago )
- **Email Notifications for Orders & Updates**  : nodemailer
- **Caching :** nodescache
- **User's session upon Register/Log in :** Express Session

---

## 4. Installation & Setup  ( write about docker )

### 🔹 Prerequisites
Ensure you have the following installed :
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- [Stripe](https://docs.stripe.com/api)

### 🔹 Clone the Repository
```sh
git clone https://github.com/your-repo/ecommerce-bookstore.git
cd ecommerce-bookstore
```

### 🔹 Install Dependencies
```sh
npm install
```

### 🔹 Set Up Environment Variables
Create a `.env` file and configure:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
```

### 🔹 Start the Server
```sh
npm start
```

The server will run on **http://localhost:5000**.

---

## 5. Database Schema

### 🧑 **User Schema**
```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "hashed string",
  "role": "user | admin",
  "createdAt": "date"
}
```

### 📖 **Book Schema**
```json
{
  "title": "string",
  "author": "string",
  "price": "number",
  "description": "string",
  "stock": "number",
  "image": "string (URL)",
  "reviews": [
    { "user": "ObjectId", "rating": "number", "review": "string" }
  ]
}
```

### 🛒 **Order Schema**
```json
{
  "userId": "ObjectId",
  "books": [ { "bookId": "ObjectId", "quantity": "number" } ],
  "totalPrice": "number",
  "status": "pending | completed | cancelled",
  "createdAt": "date"
}
```

### ⭐ **Reviews Schema**
```json
{
  "user": "ObjectId (ref: User)",
  "book": "ObjectId (ref: Book)",
  "rating": "number (min: 1, max: 5)",
  "review": "string",
  "createdAt": "date (default: now)"
}
```

---

## 6. Deployment Instructions ( write about AWS )
- Deploy the backend using **AWS**.
- Use **MongoDB Atlas** for cloud database storage.
- Set up **Docker** for containerization (if needed).

---

## 7. RESTful APIs Documentation
### 🔹 User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/register` | Register a new user |
| POST | `/api/user/login` | User login & receive JWT token |
| GET  | `/api/user/logout` | User logout |
| PATCH  | `/api/user/:email` | Update profile |

### 🔹 Book Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/book` | Get all books with pagination ( Authenticated Users )
| GET | `/api/book/:id` | Get book details by ID	( Authenticated Users )
| POST | `/api/book` | Add a new book	( Admin Only )
| PATCH | `/api/book/:id` | Update book details ( Admin Only )
| DELETE | `/api/book/:id` | Delete a book ( Admin Only )

### 🔹 Order Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/order` | Place an order ( Authenticated Users )
| GET | `/api/order` | Get all user order history ( Authenticated Users )
| GET | `/api/order."id` | Get user's specific order by ID ( Authenticated Users )
| POST | `/api/order/payment/:id` | Pay for specific order by ID ( Authenticated Users )
| GET | `/api/cancel/:id` | Cancel an order by ID ( Authenticated Users )

### 🔹 Reviews Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/review` | Create a review for a book	Authenticated Users
| GET | `/api/review/book/:id` | Get all reviews for a book
| PATCH | `/api/review/:id`	| Update a review ( Owner of the Review )
| DELETE | `/api/review/:id`| Delete a review ( Owner of the Review )

### 🔹 Cart Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart/:id` | Add a book to the cart ( Authenticated Users )
| GET | `/api/cart` | View user’s cart ( Authenticated Users )
| DELETE | `/api/cart/:id` | Remove a book from the cart ( Authenticated Users )
---

## 8. How to Run This Project ( and how to try and use this project locally )
- Install dependencies using `npm install`
- Run the development server: `npm start`
- Access API endpoints via Postman or frontend integration.

---

## 9. Live Demo Link : 
