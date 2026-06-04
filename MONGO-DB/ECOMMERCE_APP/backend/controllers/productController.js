const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// GET /api/products  — supports ?keyword, ?category, ?page
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page     = Number(req.query.page) || 1;

  const keyword  = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  const filter = { ...keyword, ...category };
  const count  = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json(products);
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST /api/products  (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, brand, image, countInStock, isFeatured } = req.body;
  const product = await Product.create({
    name, description, price, category, brand, image,
    countInStock: countInStock || 0,
    isFeatured:   isFeatured   || false,
  });
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// DELETE /api/products/:id  (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

// POST /api/products/:id/reviews  (protected)
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed)
    return res.status(400).json({ message: "Product already reviewed" });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
};