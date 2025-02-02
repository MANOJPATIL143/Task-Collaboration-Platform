const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  console.log(req.body);
  
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
    // Invalidate the token (optional, depends on your implementation)
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};