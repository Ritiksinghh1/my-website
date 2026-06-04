import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "../hooks/useOrders";
import { formatPrice } from "../utils/helpers";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice, setShipping, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    street: "", city: "", state: "", zip: "", country: "India",
    paymentMethod: "Card",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { paymentMethod, ...shippingAddress } = form;

    try {
      const { data } = await createOrder.mutateAsync({
        orderItems: items.map((i) => ({
          product:  i._id,
          name:     i.name,
          image:    i.image,
          price:    i.price,
          quantity: i.quantity,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      setShipping(shippingAddress);
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate(`/orders/${data._id}`);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        {/* Shipping Form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Address</h2>

          {[
            { name: "street",  label: "Street Address", placeholder: "123 Main St" },
            { name: "city",    label: "City",           placeholder: "Mumbai" },
            { name: "state",   label: "State",          placeholder: "Maharashtra" },
            { name: "zip",     label: "PIN Code",       placeholder: "400001" },
            { name: "country", label: "Country",        placeholder: "India" },
          ].map(({ name, label, placeholder }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          <h2>Payment Method</h2>
          {["Card", "UPI", "Net Banking", "Cash on Delivery"].map((method) => (
            <label key={method} className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={form.paymentMethod === method}
                onChange={handleChange}
              />
              {method}
            </label>
          ))}

          <button
            type="submit"
            className="btn-primary btn-large"
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? "Placing Order..." : `Place Order – ${formatPrice(totalPrice)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Your Order</h2>
          {items.map((item) => (
            <div key={item._id} className="checkout-item">
              <img src={item.image} alt={item.name} />
              <span>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <hr />
          <div className="summary-row"><span>Items</span><span>{formatPrice(itemsPrice)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? "FREE" : formatPrice(shippingPrice)}</span></div>
          <div className="summary-row"><span>Tax</span><span>{formatPrice(taxPrice)}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;