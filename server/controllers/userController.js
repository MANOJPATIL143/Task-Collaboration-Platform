const User = require('../models/User');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Cloudinary");

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images", 
    format: async (req, file) => "png", 
    public_id: (req, file) => `profile_${Date.now()}`,
  },
});
const upload = multer({ storage });

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id name email'); 
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSelfProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.UpdateUser = [
  upload.single("profileImage"), 
  async (req, res) => {
    try {
      const { name, email, mobileno } = req.body;
      const profileImage = req.file ? req.file.path : null
      if (!name || !email || !profileImage) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.name = name;
      user.email = email;
      user.mobileno = mobileno;
      if (profileImage) {
        user.profileImage = profileImage;
      }

      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
];

// Middleware to use in routes
exports.uploadMiddleware = upload.single("profileImage");