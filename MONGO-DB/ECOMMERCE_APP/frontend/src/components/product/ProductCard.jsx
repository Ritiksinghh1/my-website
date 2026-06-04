import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/helpers";
import StarRating from "../ui/StarRating";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // don't navigate to product page
    if (product.countInStock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.countInStock === 0 && (
          <span className="badge-out">Out of Stock</span>
        )}
        {product.isFeatured && (
          <span className="badge-featured">Featured</span>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span>({product.numReviews})</span>
        </div>

        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;