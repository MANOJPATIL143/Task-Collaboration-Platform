const Task = require('../models/TeamTask');

exports.assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, team } = req.body;
    const task = new Task({ title, description, assignedTo, team });
    await task.save();
    res.status(201).json({ message: 'Task assigned successfully', task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


