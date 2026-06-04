const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

// POST /api/orders  (protected)
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
  } = req.body;

  if (!orderItems?.length)
    return res.status(400).json({ message: "No order items" });

  const order = await Order.create({
    user: req.user._id,
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
  });

  res.status(201).json(order);
});

// GET /api/orders/my  (protected) — current user's orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id  (protected)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });

  // Users can only see their own orders; admins see all
  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  res.json(order);
});

// PUT /api/orders/:id/pay  (protected)
const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.isPaid  = true;
  order.paidAt  = Date.now();
  order.status  = "processing";
  const updated = await order.save();
  res.json(updated);
});

// GET /api/orders  (admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id/status  (admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = req.body.status;
  if (req.body.status === "delivered") {
    order.isDelivered  = true;
    order.deliveredAt  = Date.now();
  }
  const updated = await order.save();
  res.json(updated);
});

module.exports = {
  createOrder, getMyOrders, getOrderById,
  markOrderAsPaid, getAllOrders, updateOrderStatus,
};