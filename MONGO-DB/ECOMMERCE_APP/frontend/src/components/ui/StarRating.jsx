// Renders filled/half/empty stars based on rating (0–5)
const StarRating = ({ rating, onRate, size = 16 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating" style={{ fontSize: size }}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.round(rating) ? "filled" : ""}`}
          onClick={() => onRate?.(star)}
          style={{ cursor: onRate ? "pointer" : "default" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;