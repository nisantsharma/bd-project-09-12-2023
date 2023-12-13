const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length for the password (adjust as needed)
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'], // Enumerated values for gender (adjust as needed)
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
  });
const User = mongoose.model('User', userSchema);
module.exports = User;