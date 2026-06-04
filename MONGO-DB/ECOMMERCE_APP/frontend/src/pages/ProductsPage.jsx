import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import { Spinner, ErrorMessage, EmptyState } from "../components/ui/Feedback";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home & Kitchen", "Sports", "Toys"];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const keyword  = searchParams.get("keyword")  || "";
  const category = searchParams.get("category") || "";

  const { data, isLoading, error } = useProducts({
    keyword,
    category: category === "All" ? "" : category,
    page,
  });

  const setFilter = (key, value) => {
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="products-page">
      {/* Sidebar filters */}
      <aside className="filters-sidebar">
        <h3>Categories</h3>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${(category || "All") === cat ? "active" : ""}`}
            onClick={() => setFilter("category", cat === "All" ? "" : cat)}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="products-main">
        {keyword && (
          <div className="search-header">
            <h2>Results for: <em>{keyword}</em></h2>
            <button onClick={() => setFilter("keyword", "")}>Clear ✕</button>
          </div>
        )}

        {isLoading && <Spinner />}
        {error && <ErrorMessage />}

        {data && (
          <>
            <p className="results-count">{data.total} products found</p>
            {data.products.length === 0 ? (
              <EmptyState title="No products found" subtitle="Try a different search or category." />
            ) : (
              <div className="product-grid">
                {data.products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="pagination">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={page === p ? "active" : ""}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;