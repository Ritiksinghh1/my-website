const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// GET /api/users  (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// DELETE /api/users/:id  (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

// PUT /api/users/:id  (admin) — toggle admin role
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name    = req.body.name    || user.name;
  user.isAdmin = req.body.isAdmin ?? user.isAdmin;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, isAdmin: updated.isAdmin });
});

module.exports = { getAllUsers, deleteUser, updateUser };