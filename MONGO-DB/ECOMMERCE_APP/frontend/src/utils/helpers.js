// Format price in Indian Rupees
export const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

// Format date
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });

// Truncate text
export const truncate = (str, n = 100) =>
  str.length > n ? str.slice(0, n) + "…" : str;

// Calculate discounted price
export const getDiscountedPrice = (price, discount) =>
  +(price * (1 - discount / 100)).toFixed(2);

// Get order status badge color
export const getStatusColor = (status) => {
  const map = {
    pending:    "#f59e0b",
    processing: "#3b82f6",
    shipped:    "#8b5cf6",
    delivered:  "#10b981",
    cancelled:  "#ef4444",
  };
  return map[status] || "#6b7280";
};