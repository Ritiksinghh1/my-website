# 🛍️ ShopNow — Full-Stack E-Commerce

A complete MERN stack e-commerce app with product listings, cart, orders, reviews, and an admin panel.

**Stack:** React · Node.js · Express · MongoDB · React Query · React Router

---

## 📁 Folder Structure

```
ecommerce/
│
├── backend/                        ← Node.js + Express API
│   ├── server.js                   ← Entry point — sets up Express, middleware, routes
│   ├── .env.example                ← Copy to .env and fill in your values
│   │
│   ├── config/
│   │   └── db.js                   ← Mongoose connection setup
│   │
│   ├── models/                     ← MongoDB schemas (Mongoose)
│   │   ├── User.js                 ← User schema: name, email, hashed password, isAdmin
│   │   ├── Product.js              ← Product schema: name, price, category, reviews[]
│   │   └── Order.js                ← Order schema: orderItems[], shippingAddress, status
│   │
│   ├── controllers/                ← Business logic (called by routes)
│   │   ├── authController.js       ← register, login, getProfile, updateProfile
│   │   ├── productController.js    ← CRUD for products + review creation
│   │   ├── orderController.js      ← Create, list, pay, update status
│   │   └── userController.js       ← Admin: list all users, update, delete
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       ← JWT protect() guard + adminOnly() guard
│   │
│   └── routes/                     ← Express routers (map URLs → controllers)
│       ├── authRoutes.js           ← /api/auth/*
│       ├── productRoutes.js        ← /api/products/*
│       ├── orderRoutes.js          ← /api/orders/*
│       └── userRoutes.js           ← /api/users/* (admin)
│
└── frontend/                       ← React app (Create React App)
    └── src/
        ├── App.jsx                 ← Root component: QueryClient, Providers, Router, Routes
        ├── index.js                ← ReactDOM.createRoot entry
        │
        ├── context/                ← Global state (React Context)
        │   ├── AuthContext.jsx     ← user, login(), logout(), register(), updateUser()
        │   └── CartContext.jsx     ← items[], addItem(), removeItem(), totals (via useReducer)
        │
        ├── services/
        │   └── api.js              ← Axios instance + authAPI, productAPI, orderAPI, userAPI
        │
        ├── hooks/                  ← Data-fetching hooks (React Query wrappers)
        │   ├── useProducts.js      ← useProducts(), useProduct(), useFeaturedProducts(), useAddReview()
        │   └── useOrders.js        ← useMyOrders(), useOrder(), useCreateOrder()
        │
        ├── pages/                  ← One file per page/route
        │   ├── HomePage.jsx        ← Hero + categories + featured products
        │   ├── ProductsPage.jsx    ← Paginated grid + category filter + keyword search
        │   ├── ProductDetailPage.jsx ← Images, add to cart, star reviews
        │   ├── CartPage.jsx        ← Item list + CartSummary sidebar
        │   ├── CheckoutPage.jsx    ← Shipping form + payment method + order placement
        │   ├── AuthPages.jsx       ← LoginPage + RegisterPage
        │   ├── OrderPages.jsx      ← OrdersPage (list) + OrderDetailPage
        │   ├── ProfilePage.jsx     ← Edit name, email, password
        │   └── AdminPage.jsx       ← Admin: Products / Orders / Users tabs
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx      ← Sticky nav: logo, search, cart badge, user dropdown
        │   │   ├── Footer.jsx      ← Site footer with links
        │   │   └── PrivateRoute.jsx ← <PrivateRoute> and <AdminRoute> wrappers
        │   │
        │   ├── product/
        │   │   └── ProductCard.jsx ← Card with image, rating, price, quick-add button
        │   │
        │   ├── cart/
        │   │   ├── CartItem.jsx    ← Single cart row: image, qty controls, remove
        │   │   └── CartSummary.jsx ← Totals + checkout button sidebar
        │   │
        │   └── ui/
        │       ├── StarRating.jsx  ← Interactive/display star component
        │       └── Feedback.jsx    ← <Spinner>, <ErrorMessage>, <EmptyState>
        │
        ├── utils/
        │   └── helpers.js          ← formatPrice(), formatDate(), truncate(), getStatusColor()
        │
        └── styles/
            └── global.css          ← CSS variables + all component styles
```

---

## 🚀 Quick Start

### 1. Clone & install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env: add your MONGO_URI and a JWT_SECRET
```

### 3. Run both servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm start
```

Open **http://localhost:3000**

---

## 🔌 API Reference

| Method | Endpoint                    | Auth     | Description                                 |
| ------ | --------------------------- | -------- | ------------------------------------------- |
| POST   | `/api/auth/register`        | —        | Register new user                           |
| POST   | `/api/auth/login`           | —        | Login, returns JWT                          |
| GET    | `/api/auth/profile`         | 🔒       | Get current user                            |
| PUT    | `/api/auth/profile`         | 🔒       | Update profile                              |
| GET    | `/api/products`             | —        | List products (`?keyword=&category=&page=`) |
| GET    | `/api/products/featured`    | —        | Featured products                           |
| GET    | `/api/products/:id`         | —        | Single product                              |
| POST   | `/api/products`             | 🔒 Admin | Create product                              |
| PUT    | `/api/products/:id`         | 🔒 Admin | Update product                              |
| DELETE | `/api/products/:id`         | 🔒 Admin | Delete product                              |
| POST   | `/api/products/:id/reviews` | 🔒       | Add review                                  |
| POST   | `/api/orders`               | 🔒       | Place order                                 |
| GET    | `/api/orders/my`            | 🔒       | My orders                                   |
| GET    | `/api/orders/:id`           | 🔒       | Order detail                                |
| PUT    | `/api/orders/:id/pay`       | 🔒       | Mark as paid                                |
| GET    | `/api/orders`               | 🔒 Admin | All orders                                  |
| PUT    | `/api/orders/:id/status`    | 🔒 Admin | Update status                               |
| GET    | `/api/users`                | 🔒 Admin | All users                                   |
| PUT    | `/api/users/:id`            | 🔒 Admin | Update user                                 |
| DELETE | `/api/users/:id`            | 🔒 Admin | Delete user                                 |

---

## 🧠 Key Concepts to Study

| Topic                       | Where to look                                                 |
| --------------------------- | ------------------------------------------------------------- |
| JWT Auth flow               | `authMiddleware.js` → `authController.js` → `AuthContext.jsx` |
| React Context pattern       | `AuthContext.jsx`, `CartContext.jsx`                          |
| useReducer for cart         | `CartContext.jsx` — cartReducer function                      |
| React Query (data fetching) | `hooks/useProducts.js`, `hooks/useOrders.js`                  |
| Route protection            | `components/layout/PrivateRoute.jsx`                          |
| Axios interceptors          | `services/api.js` — auto-attach JWT, auto-logout on 401       |
| Mongoose schemas            | `models/` — relationships via ObjectId refs                   |
| Pagination pattern          | `productController.js` + `ProductsPage.jsx`                   |

---

## 🛡️ Create Admin User

After registering normally, open MongoDB shell or Compass and run:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } });
```

Then log in — you'll see the **Admin Panel** link in the navbar.
