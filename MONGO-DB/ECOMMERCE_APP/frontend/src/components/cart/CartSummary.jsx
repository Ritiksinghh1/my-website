import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/helpers";

const CartSummary = () => {
  const { itemsPrice, shippingPrice, taxPrice, totalPrice, items } = useCart();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate("/login?redirect=/checkout");
    navigate("/checkout");
  };

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Items</span>
        <span>{formatPrice(itemsPrice)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>{shippingPrice === 0 ? "FREE" : formatPrice(shippingPrice)}</span>
      </div>
      <div className="summary-row">
        <span>Tax (18% GST)</span>
        <span>{formatPrice(taxPrice)}</span>
      </div>

      <hr />

      <div className="summary-row summary-total">
        <span>Total</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      {shippingPrice > 0 && (
        <p className="free-shipping-hint">
          Add {formatPrice(500 - itemsPrice)} more for free shipping!
        </p>
      )}

      <button
        className="btn-checkout"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;