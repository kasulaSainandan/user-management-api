const mongoose = require("mongoose");
const User = require("../models/User");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/users - create a user
exports.createUser = async (req, res) => {
  const { name, email, phone, age, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  const existingUser = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists"
    });
  }

  const user = await User.create({ name, email, phone, age, address });
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user
  });
};

// GET /api/users - retrieve all users
exports.getUsers = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments()
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: users
  });
};

// GET /api/users/:id - retrieve one user
exports.getUserById = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, data: user });
};

// PUT /api/users/:id - update a user
exports.updateUser = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const allowedFields = ["name", "email", "phone", "age", "address"];
  const updates = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one valid field to update"
    });
  }

  if (updates.email) updates.email = String(updates.email).trim().toLowerCase();

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
};

// DELETE /api/users/:id - delete a user
exports.deleteUser = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: { id: user._id }
  });
};
