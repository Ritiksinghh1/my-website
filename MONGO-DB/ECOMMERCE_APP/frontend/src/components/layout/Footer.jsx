import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-section">
        <h3>🛍️ ShopNow</h3>
        <p>Your one-stop destination for quality products at great prices.</p>
      </div>

      <div className="footer-section">
        <h4>Shop</h4>
        <Link to="/products">All Products</Link>
        <Link to="/products?category=Electronics">Electronics</Link>
        <Link to="/products?category=Clothing">Clothing</Link>
      </div>

      <div className="footer-section">
        <h4>Account</h4>
        <Link to="/profile">My Profile</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/cart">Cart</Link>
      </div>

      <div className="footer-section">
        <h4>Support</h4>
        <a href="mailto:support@shopnow.com">Contact Us</a>
        <Link to="/faq">FAQ</Link>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} ShopNow. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;