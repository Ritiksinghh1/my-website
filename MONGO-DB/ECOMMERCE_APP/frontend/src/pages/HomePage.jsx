import { Link } from "react-router-dom";
import { useFeaturedProducts } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import { Spinner, ErrorMessage } from "../components/ui/Feedback";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home & Kitchen", "Sports", "Toys"];

const HomePage = () => {
  const { data: featured, isLoading, error } = useFeaturedProducts();

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>Shop the Best Deals</h1>
          <p>Discover thousands of products at unbeatable prices</p>
          <Link to="/products" className="btn-hero">Shop Now →</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="category-card"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <h2 className="section-title">Featured Products</h2>
        {isLoading && <Spinner />}
        {error   && <ErrorMessage message="Could not load featured products." />}
        <div className="product-grid">
          {featured?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;