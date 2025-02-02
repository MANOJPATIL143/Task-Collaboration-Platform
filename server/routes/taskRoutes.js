const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Task routes
router.post('/createTask', protect, taskController.createTask);
router.get('/getTasks', protect, taskController.getTasks);
router.post('/updateTask', protect, taskController.updateTask);
router.post('/deleteTask', protect, taskController.deleteTask);

module.exports = router;