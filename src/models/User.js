const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [60, "Name cannot exceed 60 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number"]
  },
  age: {
    type: Number,
    min: [0, "Age cannot be negative"],
    max: [120, "Age cannot exceed 120"]
  },
  address: {
    type: String,
    trim: true,
    maxlength: [250, "Address cannot exceed 250 characters"]
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("User", userSchema);
