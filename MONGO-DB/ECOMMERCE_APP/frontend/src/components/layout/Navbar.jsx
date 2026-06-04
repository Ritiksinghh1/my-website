import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount }    = useCart();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          🛍️ ShopNow
        </Link>

        {/* Search bar */}
        <form
          className="navbar-search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = e.target.search.value.trim();
            if (q) navigate(`/products?keyword=${q}`);
          }}
        >
          <input name="search" placeholder="Search products..." />
          <button type="submit">🔍</button>
        </form>

        {/* Nav links */}
        <div className="navbar-links">
          <Link to="/products">Products</Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name.split(" ")[0]}</span>
              <div className="dropdown">
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">My Orders</Link>
                {user.isAdmin && <Link to="/admin">Admin Panel</Link>}
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;