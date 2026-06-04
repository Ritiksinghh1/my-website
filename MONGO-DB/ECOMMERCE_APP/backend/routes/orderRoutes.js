const express = require("express");
const router  = express.Router();
const {
  createOrder, getMyOrders, getOrderById,
  markOrderAsPaid, getAllOrders, updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrder).get(protect, adminOnly, getAllOrders);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, markOrderAsPaid);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;