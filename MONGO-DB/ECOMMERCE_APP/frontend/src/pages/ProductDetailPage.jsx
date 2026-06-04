import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct, useAddReview } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice, formatDate } from "../utils/helpers";
import StarRating from "../components/ui/StarRating";
import { Spinner, ErrorMessage } from "../components/ui/Feedback";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id }     = useParams();
  const { user }   = useAuth();
  const { addItem } = useCart();
  const [qty, setQty]         = useState(1);
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, error } = useProduct(id);
  const reviewMutation = useAddReview(id);

  if (isLoading) return <Spinner />;
  if (error)     return <ErrorMessage message="Could not load product." />;

  const handleAddToCart = () => {
    addItem({ ...product, quantity: qty });
    toast.success("Added to cart!");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    reviewMutation.mutate({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <div className="product-detail-page">
      {/* Product Info */}
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <p className="product-brand">{product.brand}</p>
          <h1>{product.name}</h1>

          <div className="product-rating">
            <StarRating rating={product.rating} />
            <span>{product.numReviews} reviews</span>
          </div>

          <p className="product-detail-price">{formatPrice(product.price)}</p>
          <p className="product-description">{product.description}</p>

          <div className="stock-status">
            {product.countInStock > 0
              ? <span className="in-stock">✓ In Stock ({product.countInStock} left)</span>
              : <span className="out-stock">✗ Out of Stock</span>}
          </div>

          {product.countInStock > 0 && (
            <div className="add-to-cart-section">
              <div className="qty-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))}>+</button>
              </div>
              <button className="btn-primary btn-large" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {product.reviews.length === 0 && <p>No reviews yet. Be the first!</p>}

        <div className="reviews-list">
          {product.reviews.map((r) => (
            <div key={r._id} className="review-card">
              <div className="review-header">
                <strong>{r.name}</strong>
                <StarRating rating={r.rating} size={14} />
                <span className="review-date">{formatDate(r.createdAt)}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Review form — only for logged-in users */}
        {user ? (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Write a Review</h3>
            <StarRating rating={rating} onRate={setRating} size={24} />
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={reviewMutation.isPending}>
              {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p>Please <a href="/login">login</a> to write a review.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;