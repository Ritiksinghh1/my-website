import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { EmptyState } from "../components/ui/Feedback";

const CartPage = () => {
  const { items, clearCart } = useCart();

  if (items.length === 0)
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        subtitle={<Link to="/products">Start shopping →</Link>}
      />
    );

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({items.length} items)</h1>

      <div className="cart-layout">
        <div className="cart-items-list">
          {/* Header row */}
          <div className="cart-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>

          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <button className="btn-clear-cart" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;