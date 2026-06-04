const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id:     user._id,
    name:    user.name,
    email:   user.email,
    isAdmin: user.isAdmin,
    token:   generateToken(user._id),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    _id:     user._id,
    name:    user.name,
    email:   user.email,
    isAdmin: user.isAdmin,
    token:   generateToken(user._id),
  });
});

// GET /api/auth/profile  (protected)
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// PUT /api/auth/profile  (protected)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name    = req.body.name    || user.name;
  user.email   = req.body.email   || user.email;
  user.address = req.body.address || user.address;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({
    _id:     updated._id,
    name:    updated.name,
    email:   updated.email,
    isAdmin: updated.isAdmin,
    token:   generateToken(updated._id),
  });
});

module.exports = { register, login, getProfile, updateProfile };