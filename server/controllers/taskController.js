const Task = require('../models/Task');
const User = require('../models/User');
const { io } = require('../app');
const { getIo } = require("../socket");


exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, status } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      status,
      createdBy: req.user.id,
    });
    await task.save();
    const io = getIo();
    io.emit("taskCreated", task);
    console.log("Task created event emitted!");
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const { status, priority, dueDate } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (dueDate) filters.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(filters)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo, id } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();

    const io = getIo();
    io.emit("TaskUpdated", task);
    console.log("Task updated event emitted!");

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.deleteOne();

    const io = getIo();
    io.emit("taskDeleted", id);
    console.log("taskDeleted!");


    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};