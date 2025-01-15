const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Signup: Create a new user
const signup = async (email, password) => {
    const user = new User({ email, password });
    return await user.save();
};

// Find user by email
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Compare password
const comparePassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword);
};

// Check if email already exists
const isEmailTaken = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
};

module.exports = { signup, findUserByEmail, comparePassword, isEmailTaken };
