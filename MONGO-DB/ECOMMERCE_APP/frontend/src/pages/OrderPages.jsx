import { Link, useParams } from "react-router-dom";
import { useMyOrders, useOrder } from "../hooks/useOrders";
import { formatPrice, formatDate, getStatusColor } from "../utils/helpers";
import { Spinner, ErrorMessage, EmptyState } from "../components/ui/Feedback";

// ─── My Orders List ──────────────────────────────────────────────────────────
export const OrdersPage = () => {
  const { data: orders, isLoading, error } = useMyOrders();

  if (isLoading) return <Spinner />;
  if (error)     return <ErrorMessage />;
  if (!orders?.length)
    return <EmptyState icon="📦" title="No orders yet" subtitle={<Link to="/products">Start shopping!</Link>} />;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="order-card">
            <div className="order-card-header">
              <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
              <span
                className="order-status"
                style={{ color: getStatusColor(order.status) }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="order-card-body">
              <p>{order.orderItems.length} items · {formatPrice(order.totalPrice)}</p>
              <p>{formatDate(order.createdAt)}</p>
              <p>{order.isPaid ? "✓ Paid" : "⏳ Pending payment"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ─── Single Order Detail ─────────────────────────────────────────────────────
export const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) return <Spinner />;
  if (error)     return <ErrorMessage message="Order not found." />;

  return (
    <div className="order-detail-page">
      <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>

      <div className="order-detail-grid">
        {/* Left: Items + Shipping */}
        <div>
          <section className="order-section">
            <h2>Items Ordered</h2>
            {order.orderItems.map((item, i) => (
              <div key={i} className="order-item-row">
                <img src={item.image} alt={item.name} />
                <Link to={`/products/${item.product}`}>{item.name}</Link>
                <span>{item.quantity} × {formatPrice(item.price)}</span>
                <span>{formatPrice(item.quantity * item.price)}</span>
              </div>
            ))}
          </section>

          <section className="order-section">
            <h2>Shipping Address</h2>
            <p>
              {order.shippingAddress.street}, {order.shippingAddress.city},
              {order.shippingAddress.state} – {order.shippingAddress.zip},
              {order.shippingAddress.country}
            </p>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="order-summary-card">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{formatPrice(order.shippingPrice)}</span></div>
          <div className="summary-row"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
          <hr />
          <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>

          <div className="order-meta">
            <p>Payment: {order.paymentMethod}</p>
            <p>Status: <strong style={{ color: getStatusColor(order.status) }}>{order.status}</strong></p>
            <p>Placed: {formatDate(order.createdAt)}</p>
            {order.isPaid     && <p>Paid: {formatDate(order.paidAt)}</p>}
            {order.isDelivered && <p>Delivered: {formatDate(order.deliveredAt)}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};