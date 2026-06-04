import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import { PrivateRoute, AdminRoute } from "./components/layout/PrivateRoute";
import Navbar  from "./components/layout/Navbar";
import Footer  from "./components/layout/Footer";

import HomePage          from "./pages/HomePage";
import ProductsPage      from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage          from "./pages/CartPage";
import CheckoutPage      from "./pages/CheckoutPage";
import ProfilePage       from "./pages/ProfilePage";
import AdminPage         from "./pages/AdminPage";
import { LoginPage, RegisterPage }       from "./pages/AuthPages";
import { OrdersPage, OrderDetailPage }   from "./pages/OrderPages";

import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 }, // 5min cache
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/"               element={<HomePage />} />
              <Route path="/products"       element={<ProductsPage />} />
              <Route path="/products/:id"   element={<ProductDetailPage />} />
              <Route path="/cart"           element={<CartPage />} />
              <Route path="/login"          element={<LoginPage />} />
              <Route path="/register"       element={<RegisterPage />} />

              {/* Protected routes (login required) */}
              <Route element={<PrivateRoute />}>
                <Route path="/checkout"      element={<CheckoutPage />} />
                <Route path="/profile"       element={<ProfilePage />} />
                <Route path="/orders"        element={<OrdersPage />} />
                <Route path="/orders/:id"    element={<OrderDetailPage />} />
              </Route>

              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <div style={{ textAlign: "center", padding: "4rem" }}>
                  <h1>404 – Page Not Found</h1>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;