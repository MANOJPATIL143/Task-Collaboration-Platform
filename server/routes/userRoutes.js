const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// User routes
router.post('/users',protect, userController.createUser);
router.get('/', protect, userController.getUsers);
router.get('/me', protect, userController.getSelfProfile); 

module.exports = router;