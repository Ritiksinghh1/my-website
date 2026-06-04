import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/helpers";
import { Link } from "react-router-dom";

const CartItem = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <Link to={`/products/${item._id}`}>
        <img src={item.image} alt={item.name} className="cart-item-img" />
      </Link>

      <div className="cart-item-info">
        <Link to={`/products/${item._id}`} className="cart-item-name">
          {item.name}
        </Link>
        <p className="cart-item-price">{formatPrice(item.price)}</p>
      </div>

      <div className="cart-item-qty">
        <button
          onClick={() =>
            item.quantity > 1
              ? updateQuantity(item._id, item.quantity - 1)
              : removeItem(item._id)
          }
        >−</button>
        <span>{item.quantity}</span>
        <button
          onClick={() =>
            item.quantity < item.countInStock &&
            updateQuantity(item._id, item.quantity + 1)
          }
          disabled={item.quantity >= item.countInStock}
        >+</button>
      </div>

      <p className="cart-item-subtotal">
        {formatPrice(item.price * item.quantity)}
      </p>

      <button className="cart-item-remove" onClick={() => removeItem(item._id)}>
        🗑
      </button>
    </div>
  );
};

export default CartItem;